import { useEffect, useMemo, useState } from 'react';
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
}

const ProjectBattle = ({
  projectMembers,
  payloadBatch,
  payloadBatchNonce,
  bossRefreshNonce,
}: ProjectBattleProps) => {
  const {
    users,
    boss,
    setBoss,
    isSequenceRunning,
    handleGameAction
  } = useBattleLogic(projectMembers);

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

        setBoss((prev) => ({
          ...prev,
          id: configId,
          status: isDead ? "dead" : "idle",
          hp: projectBoss.hp,
          maxHp: projectBoss.max_hp,
        }))
      } catch {
        // ignore; keep default boss until backend is ready
      }
    }

    loadBoss()
  }, [bossNameToConfigId, bossRefreshNonce, getProjectBoss, projectId, setBoss])

  // Queue payload actions so we don't drop actions while an animation sequence is running.
  const [actionQueue, setActionQueue] = useState<GameActionPayload[]>([])

  useEffect(() => {
    if (!payloadBatch || payloadBatch.length === 0) return
    // Use nonce to allow re-sending identical batches.
    setActionQueue((prev) => [...prev, ...payloadBatch])
  }, [payloadBatchNonce]) // intentionally only keyed by nonce

  useEffect(() => {
    if (actionQueue.length === 0) return
    if (isSequenceRunning) return
    void handleGameAction(actionQueue[0])
    setActionQueue((prev) => prev.slice(1))
  }, [actionQueue, handleGameAction, isSequenceRunning])

  return (
    <div className=" bg-slate-950 text-white font-sans flex flex-col z-10">
      <BattleScene users={users} boss={boss} />
    </div>
  );
};

export default ProjectBattle;