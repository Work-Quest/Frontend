import { useEffect, useMemo, useRef, useState } from 'react';
import { BattleScene } from '@/components/battle/BattleScene';
import { useBattleLogic } from '@/hook/useBattleLogic';
import type { UserStatus } from "@/types/User"
import { useParams } from "react-router-dom"
import { useGame } from "@/hook/useGame"
import { useProjects } from "@/hook/useProjects"
import { ENTITY_CONFIG } from "@/config/battleConfig"
import type { GameActionPayload } from "@/types/battleTypes"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

type ProjectBattleProps = {
  projectMembers: UserStatus[]
  payloadBatch?: GameActionPayload[] | null
  payloadBatchNonce?: number
  bossRefreshNonce?: number
  bossUpdate?: { hp: number; maxHp: number } | null
  bossUpdateNonce?: number
}

const ProjectBattle = ({
  projectMembers,
  payloadBatch,
  payloadBatchNonce,
  bossRefreshNonce,
  bossUpdate,
  bossUpdateNonce,
}: ProjectBattleProps) => {
  const {
    users,
    boss,
    setBoss,
    handleGameAction
  } = useBattleLogic(projectMembers);


  const applyBossPatch = (patch: {
    id: string
    status: "idle" | "dead" | "hidden"
    hp: number
    maxHp: number
  }) => {
    setBoss((prev) => {
      // Backend can stay in a "dead" status after defeat, but in the UI we want the
      // boss to disappear (hidden) after the death animation, and also not show at all
      // if we load the page while the boss is already dead.
      const nextStatus =
        patch.status === "dead" ? "hidden" : patch.status

      return {
        ...prev,
        ...patch,
        status: nextStatus,
        hp: nextStatus === "hidden" ? 0 : patch.hp,
      }
    })
  }

  // Keep a stable reference to the latest handler so queue processing
  // doesn't restart/cancel on every re-render.
  const handleGameActionRef = useRef(handleGameAction)
  useEffect(() => {
    handleGameActionRef.current = handleGameAction
  }, [handleGameAction])

  // Queue payload actions so we don't drop actions while an animation sequence is running.
  const [actionQueue, setActionQueue] = useState<GameActionPayload[]>([])
  const isProcessingQueueRef = useRef(false)
  const actionQueueLengthRef = useRef(0)
  useEffect(() => {
    actionQueueLengthRef.current = actionQueue.length
  }, [actionQueue.length])

  // Hold boss updates (from backend refresh) while animations are running, so HP doesn't jump mid-animation.
  const pendingBossPatchRef = useRef<{
    id: string
    status: "idle" | "dead" | "hidden"
    hp: number
    maxHp: number
  } | null>(null)

  // Boss HP/maxHp that should be applied for phase transitions (used before BOSS_REVIVE).
  const bossUpdateRef = useRef<{ hp: number; maxHp: number } | null>(null)
  useEffect(() => {
    if (!bossUpdate) return
    bossUpdateRef.current = bossUpdate
  }, [bossUpdateNonce]) // intentionally only keyed by nonce

  const { projectId } = useParams<{ projectId: string }>()
  const { getProjectBoss, setupSpecialBoss } = useGame()
  const { closeProject } = useProjects()
  const navigate = useNavigate()
  const [isClosing, setIsClosing] = useState(false)
  const [isSettingUpSpecialBoss, setIsSettingUpSpecialBoss] = useState(false)

  const handleEndJourney = async () => {
    if (!projectId) return
    try {
      setIsClosing(true)
      await closeProject(projectId)
      toast.success("Project closed")
      // Best-effort: send user back to projects list (adjust if your route differs)
      navigate("/projects")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to close project")
    } finally {
      setIsClosing(false)
    }
  }

  const handleChallengeSpecialBoss = async () => {
    if (!projectId) return
    try {
      setIsSettingUpSpecialBoss(true)
      await setupSpecialBoss(projectId)
      toast.success("Special boss summoned!")

      // Refresh boss state immediately so overlay disappears
      const projectBoss = await getProjectBoss(projectId)
      if (projectBoss?.boss_name) {
        const configId =
          bossNameToConfigId.get(projectBoss.boss_name.trim().toLowerCase()) ??
          "b01"
        const backendStatus = String(projectBoss.status || "")
        const isDead = backendStatus.toLowerCase().includes("dead")
        applyBossPatch({
          id: configId,
          status: isDead ? ("dead" as const) : ("idle" as const),
          hp: projectBoss.hp,
          maxHp: projectBoss.max_hp,
        })
      } else {
        // If backend still doesn't return a boss, at least hide overlay by making boss visible idle
        setBoss((prev) => ({ ...prev, status: "idle" }))
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to setup special boss")
    } finally {
      setIsSettingUpSpecialBoss(false)
    }
  }

  const bossNameToConfigId = useMemo(() => {
    const bosses = ENTITY_CONFIG.bosses as Record<string, { name?: string }>
    const map = new Map<string, string>()
    for (const [id, cfg] of Object.entries(bosses)) {
      if (!cfg?.name) continue
      map.set(cfg.name.trim().toLowerCase(), id)
    }
    return map
  }, [])

  useEffect(() => {
    if (!projectId) return

    const loadBoss = async () => {
      try {
        const projectBoss = await getProjectBoss(projectId)
        // If boss is not yet setup, backend returns boss fields as null.
        if (!projectBoss?.boss_name) return

        const configId =
          bossNameToConfigId.get(projectBoss.boss_name.trim().toLowerCase()) ??
          "b01"

        const backendStatus = String(projectBoss.status || "")
        const isDead = backendStatus.toLowerCase().includes("dead")

        const patch = {
          id: configId,
          status: isDead ? ("dead" as const) : ("idle" as const),
          hp: projectBoss.hp,
          maxHp: projectBoss.max_hp,
        }

        const isBusy =
          actionQueueLengthRef.current > 0 || isProcessingQueueRef.current

        if (isBusy) {
          pendingBossPatchRef.current = patch
          return
        }

        applyBossPatch(patch)

      } catch {
        // ignore; keep default boss until backend is ready
      }
    }

    loadBoss()
  }, [bossNameToConfigId, bossRefreshNonce, getProjectBoss, projectId, setBoss])

  // When queue finishes, apply any pending boss refresh patch.
  useEffect(() => {
    if (actionQueue.length !== 0) return
    if (isProcessingQueueRef.current) return
    const patch = pendingBossPatchRef.current
    if (!patch) return
    pendingBossPatchRef.current = null
    applyBossPatch(patch)
  }, [actionQueue.length, setBoss])

  useEffect(() => {
    if (!payloadBatch || payloadBatch.length === 0) return
    // Use nonce to allow re-sending identical batches.
    setActionQueue((prev) => [...prev, ...payloadBatch])
  }, [payloadBatchNonce]) // intentionally only keyed by nonce

  useEffect(() => {
    if (actionQueue.length === 0) return
    if (isProcessingQueueRef.current) return

    isProcessingQueueRef.current = true
    let unmounted = false

    ;(async () => {
      try {
        // Await so actions run strictly sequentially.
        const action = actionQueue[0]

        // If we're about to revive the boss for a next phase, apply the new max HP first
        // so the revive sets HP to the correct max.
        if (action?.act === "BOSS_REVIVE") {
          const update = bossUpdateRef.current
          if (update?.maxHp && Number.isFinite(update.maxHp)) {
            setBoss((prev) => ({
              ...prev,
              maxHp: update.maxHp,
              hp: 0,
            }))
          }
          // Once used, clear it so it doesn't affect future revives.
          bossUpdateRef.current = null
        }

        await handleGameActionRef.current(action)
      } finally {
        if (!unmounted) setActionQueue((prev) => prev.slice(1))
        isProcessingQueueRef.current = false
      }
    })()

    return () => {
      unmounted = true
    }
  }, [actionQueue])

  return (
    <div className="relative bg-slate-950 text-white font-sans flex flex-col z-10">
      {(boss.status === "hidden" || boss.status === "dead") && (
        <div className="absolute inset-0 z-[999] bg-black/50 flex items-center justify-center">
          <div className="text-center font-mono tracking-widest">
            <h1 className="text-yellow-300 text-2xl">BOSS DEFEATED</h1>
            <div className=" mt-2 tracking-normal flex flex-col">
                <h3 className="!text-white"> Choose your next step: </h3>
                <text>You may continue working without a boss, but no points will be awarded.</text>
                <button
                  onClick={handleChallengeSpecialBoss}
                  disabled={isSettingUpSpecialBoss || isClosing}
                  className="!bg-blue-500 hover:!bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Challenge Special Boss
                </button>
                <button
                  onClick={handleEndJourney}
                  disabled={isClosing}
                  className="!bg-red-500 hover:!bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded mt-2"
                >
                  End your journey here
                </button>
            </div>
          </div>
        </div>
      )}
      <BattleScene users={users} boss={boss} />
    </div>
  );
};

export default ProjectBattle;