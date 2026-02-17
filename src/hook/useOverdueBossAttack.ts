import { useEffect, useMemo, useRef, useState } from "react"
import type { ProjectLogEntry } from "@/types/LogApi"
import type { Tasks } from "@/sections/project/KanbanBoard/types"
import type { BossAttackRequest, BossAttackResponse } from "@/types/GameApi"
import type { GameActionPayload } from "@/types/battleTypes"

type UseOverdueBossAttackParams = {
  projectId: string | null | undefined
  tasks: Tasks
  logs: ProjectLogEntry[]
  logsLoading: boolean
  bossAttack: (projectId: string, payload: BossAttackRequest) => Promise<BossAttackResponse>
  enqueueActions: (actions: GameActionPayload[]) => void
  bumpBossRefresh: () => void
  enabled?: boolean
}

type UseOverdueBossAttackState = {
  running: boolean
  attackedTaskId: string | null
  error: string | null
}

/**
 * On page entry, checks for overdue (deadline passed), incomplete tasks and triggers one boss attack.
 * Uses logs to avoid re-attacking the same overdue task (idempotent-ish on the client).
 */
export function useOverdueBossAttack({
  projectId,
  tasks,
  logs,
  logsLoading,
  bossAttack,
  enqueueActions,
  bumpBossRefresh,
  enabled = true,
}: UseOverdueBossAttackParams) {
  const [state, setState] = useState<UseOverdueBossAttackState>({
    running: false,
    attackedTaskId: null,
    error: null,
  })

  // Only run once per mount/page entry.
  const hasRunRef = useRef(false)

  const activeTasks = useMemo(() => {
    return [...tasks.backlog, ...tasks.todo, ...tasks.inProgress]
  }, [tasks.backlog, tasks.todo, tasks.inProgress])

  const attackedTaskIds = useMemo(() => {
    const set = new Set<string>()
    for (const l of logs ?? []) {
      if (String(l.event_type).toUpperCase() !== "BOSS_ATTACK") continue
      const taskId = String((l.payload as any)?.task_id ?? "")
      if (taskId) set.add(taskId)
    }
    return set
  }, [logs])

  const overdueTaskId = useMemo(() => {
    const now = Date.now()
    const overdue = activeTasks
      .filter((t) => t.deadline && new Date(t.deadline).getTime() < now)
      .filter((t) => !attackedTaskIds.has(String(t.id)))
      .sort(
        (a, b) =>
          new Date(a.deadline as string).getTime() - new Date(b.deadline as string).getTime()
      )
    return overdue[0]?.id ? String(overdue[0].id) : null
  }, [activeTasks, attackedTaskIds])

  useEffect(() => {
    if (!enabled) return
    if (!projectId) return
    if (hasRunRef.current) return

    // Wait until logs have loaded at least once; otherwise we may re-attack a task
    // that was already attacked earlier but the logs haven't arrived yet.
    if (logsLoading) return

    // Wait until tasks have loaded. (If the project has 0 tasks, do nothing.)
    if (activeTasks.length === 0) return

    if (!overdueTaskId) return

    hasRunRef.current = true

    let cancelled = false
    setState((s) => ({ ...s, running: true, error: null }))

    ;(async () => {
      try {
        const res = await bossAttack(projectId, { task_id: overdueTaskId })
        if (cancelled) return

        const actions: GameActionPayload[] = (res.result?.attacked_players ?? []).flatMap(
          (p) => {
            const uid = String(p.player_id)
            const batch: GameActionPayload[] = [{ act: "BOSS_ATTACK_USER", userId: uid }]
            if ((p.hp ?? 0) <= 0) batch.push({ act: "DIE", userId: uid })
            return batch
          }
        )

        if (actions.length > 0) enqueueActions(actions)
        bumpBossRefresh()

        setState({ running: false, attackedTaskId: overdueTaskId, error: null })
      } catch (e) {
        if (cancelled) return
        setState({
          running: false,
          attackedTaskId: null,
          error: e instanceof Error ? e.message : "Overdue boss attack failed",
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [
    enabled,
    projectId,
    logsLoading,
    activeTasks.length,
    overdueTaskId,
    bossAttack,
    enqueueActions,
    bumpBossRefresh,
  ])

  return state
}

export default useOverdueBossAttack



