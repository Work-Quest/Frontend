import { useEffect, useMemo, useRef, useState } from 'react';
import { BattleScene } from '@/components/battle/BattleScene';
import { useBattleLogic } from '@/hook/useBattleLogic';
import type { UserStatus } from "@/types/User"
import { useParams } from "react-router-dom"
import { useGame } from "@/hook/useGame"
import { ENTITY_CONFIG } from "@/config/battleConfig"
import type { GameActionPayload } from "@/types/battleTypes"

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
    status: "idle" | "dead"
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
  const { getProjectBoss } = useGame()

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
          status: (isDead ? "dead" : "idle") as const,
          hp: projectBoss.hp,
          maxHp: projectBoss.max_hp,
        }

        const isBusy =
          actionQueueLengthRef.current > 0 || isProcessingQueueRef.current

        if (isBusy) {
          pendingBossPatchRef.current = patch
          return
        }

        setBoss((prev) => ({ ...prev, ...patch }))
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
    setBoss((prev) => ({ ...prev, ...patch }))
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
    <div className=" bg-slate-950 text-white font-sans flex flex-col z-10">
      <BattleScene users={users} boss={boss} />
    </div>
  );
};

export default ProjectBattle;