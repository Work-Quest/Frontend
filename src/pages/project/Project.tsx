'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import ToggleButton from '@/components/ToggleButton'
import ProjectDetailCard from '@/sections/project/ProjectDetailCard/ProjectDetailCard'
import ReviewTask from '@/sections/project/ReviewTask/ReviewTask'
import DamageLog from '@/sections/project/DamageLog/DamageLog'
import { KanbanBoard } from '@/sections/project/KanbanBoard/KanbanBoard'
import { useKanbanBoard } from '@/sections/project/KanbanBoard/useKanbanBoard'
import { useTask } from '@/hook/useTask'
import { useProjectMembers } from '@/hook/useProjectMembers'
import BossPlaceholder from '@/sections/project/BossPlaceholder'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '@/hook/useGame'
import toast from 'react-hot-toast'
import type { GameActionPayload } from '@/types/battleTypes'
import useLog from '@/hook/useLog'
import { useAuth } from '@/context/AuthContext'
import { useOverdueBossAttack } from '@/hook/useOverdueBossAttack'
import { POLLING_CONFIG } from '@/config/pollingConfig'
import { getActionKey } from '@/utils/actionDeduplication'
import { useAnimationSync } from '@/hook/useAnimationSync'
import { useProjects } from '@/hook/useProjects'
import DeadlineWarningModal from '@/sections/project/DeadlineWarningModal'
import { useEstimateFinishTime } from '@/hook/useEstimateFinishTime'

const ProjectPage: React.FC = () => {
  const [showBossPlaceholder, setShowBossPlaceholder] = useState(true)
  const { projectId } = useParams<{ projectId: string }>()
  const { projects, closeProject } = useProjects()
  const navigate = useNavigate()
  const { estimatedDays } = useEstimateFinishTime(projectId)
  const { fetchedTask } = useTask({ pollIntervalMs: POLLING_CONFIG.tasks.interval })
  const { projectMembers } = useProjectMembers(projectId)
  const { logs, loading: logsLoading } = useLog(projectId, {
    pollIntervalMs: POLLING_CONFIG.logs.interval,
  })
  const { playerAttack, bossAttack, gameStatus } = useGame(projectId, {
    pollIntervalMs: POLLING_CONFIG.gameStatus.interval,
  })
  const [payloadBatch, setPayloadBatch] = useState<GameActionPayload[] | null>(null)
  const [payloadBatchNonce, setPayloadBatchNonce] = useState(0)
  const [bossRefreshNonce, setBossRefreshNonce] = useState(0)
  const [bossUpdate, setBossUpdate] = useState<{
    hp: number
    maxHp: number
  } | null>(null)
  const [bossUpdateNonce, setBossUpdateNonce] = useState(0)
  // Track API actions to prevent duplicates from log polling
  const apiActionsRef = React.useRef<Map<string, number>>(new Map())

  // Clear API actions tracking when projectId changes
  useEffect(() => {
    apiActionsRef.current.clear()
  }, [projectId])

  const enqueueActions = React.useCallback((actions: GameActionPayload[], taskId?: string) => {
    if (!actions || actions.length === 0) return

    // Track API actions for deduplication (if taskId is provided)
    if (taskId) {
      const now = Date.now()
      const DEDUP_WINDOW_MS = 5000 // 5 seconds

      // Clean up old entries (older than 5 seconds)
      for (const [key, timestamp] of apiActionsRef.current.entries()) {
        if (now - timestamp > DEDUP_WINDOW_MS) {
          apiActionsRef.current.delete(key)
        }
      }

      // Track each action with act:taskId key
      for (const action of actions) {
        const key = getActionKey(action, taskId)
        apiActionsRef.current.set(key, now)
      }
    }

    setPayloadBatch(actions)
    setPayloadBatchNonce((n) => n + 1)
  }, [])

  const bumpBossRefresh = React.useCallback(() => {
    setBossRefreshNonce((n) => n + 1)
  }, [])

  const handleMovedToDone = React.useCallback(
    async (taskId: string) => {
      if (!projectId) return
      console.log(`Task ${taskId} moved to Done, initiating attack...`)
      try {
        const res = await playerAttack(projectId, { task_id: taskId })
        const attacked = res.result.attacks?.length ?? 0
        const skipped = res.result.skipped?.length ?? 0
        if (attacked > 0)
          toast.success(
            `Boss attacked by ${attacked} assignee(s)\nDamage was dealt based on completed tasks.`
          )
        if (skipped > 0)
          toast(`Skipped ${skipped} assignee(s)\nThey weren’t eligible to attack this round.`)
        const bossPhaseAdvanced = !!res.result.boss_phase_advanced
        const bossWasDefeated = bossPhaseAdvanced || (res.result.boss_hp ?? 0) <= 0

        if (bossPhaseAdvanced) {
          const phaseLabel =
            typeof res.result.boss_phase === 'number'
              ? `Phase ${res.result.boss_phase}`
              : 'next phase'
          toast.success(
            `Boss advanced to ${phaseLabel}!\nGet ready—the fight gets tougher from here.`
          )
        }

        const actions: GameActionPayload[] = (res.result.attacks ?? []).map((a) => ({
          act: 'ATTACK',
          userId: String(a.player_id),
        }))

        // Boss transition animations:
        // - If boss was defeated and advances phase: die animation first, then revive to new max HP.
        // - If boss was defeated and does NOT advance phase: die animation only.
        if (bossWasDefeated) {
          actions.push({ act: 'BOSS_DIE' })
        }

        if (bossPhaseAdvanced) actions.push({ act: 'BOSS_REVIVE' })

        // Pass boss HP/maxHp updates down, but ProjectBattle will apply them only
        // when it is safe (e.g., before BOSS_REVIVE or after queue finishes).
        if (typeof res.result.boss_hp === 'number' && typeof res.result.boss_max_hp === 'number') {
          setBossUpdate({
            hp: res.result.boss_hp,
            maxHp: res.result.boss_max_hp,
          })
          setBossUpdateNonce((n) => n + 1)
        }

        enqueueActions(actions, taskId)
        bumpBossRefresh()
      } catch (err) {
        console.error(err)
        toast.error(
          'Attack failed\nThe boss didn’t take damage—try moving another task or refresh.'
        )
      }
    },
    [playerAttack, projectId, enqueueActions, bumpBossRefresh]
  )

  const overdueAttack = useOverdueBossAttack({
    projectId,
    tasks: fetchedTask,
    logs,
    logsLoading,
    bossAttack,
    enqueueActions,
    bumpBossRefresh,
    enabled: true,
  })

  useEffect(() => {
    if (overdueAttack.attackedTaskId) {
      toast.error('Overdue task—boss struck!\nComplete tasks on time to avoid extra boss attacks.')
    }
    if (overdueAttack.error) {
      // Silent-ish: show only in console; you can toast if you want
      console.error(overdueAttack.error)
    }
  }, [overdueAttack.attackedTaskId, overdueAttack.error])

  // Animation synchronization: convert logs to actions for cross-window animation sync
  useAnimationSync(logs, {
    onActionsReady: enqueueActions,
    apiActionsRef,
    projectId,
  })

  const {
    tasks,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    findActiveTask,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useKanbanBoard(fetchedTask, { onMovedToDone: handleMovedToDone })

  const toggleBossPlaceholder = () => {
    setShowBossPlaceholder((prev) => !prev)
  }

  const { user } = useAuth()
  const me = gameStatus?.user_statuses?.find((s) => s.user_id === user?.id)
  const myProjectMemberId = me?.project_member_id ? String(me.project_member_id) : null

  // Get current project from projects list
  const project = useMemo(() => {
    if (!projectId || !projects) return null
    return projects.find((p) => p.project_id === projectId) ?? null
  }, [projectId, projects])

  // Calculate days left from deadline
  const daysLeft = useMemo(() => {
    if (!project?.deadline) return undefined
    const deadlineDate = new Date(project.deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    deadlineDate.setHours(0, 0, 0, 0)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [project?.deadline])

  // Check if deadline has passed
  const isDelayed = useMemo(() => {
    return daysLeft !== undefined && daysLeft < 0
  }, [daysLeft])

  const delayedDays = useMemo(() => {
    if (!isDelayed) return 0
    return Math.abs(daysLeft ?? 0)
  }, [isDelayed, daysLeft])

  // Check if deadline warning should be shown
  const [showDeadlineWarning, setShowDeadlineWarning] = useState(false)

  useEffect(() => {
    if (!projectId || !project?.deadline) return

    // Check if deadline has passed and decision hasn't been made
    if (isDelayed && !project.deadline_decision) {
      // Check localStorage to see if user has already seen this warning
      const warningKey = `deadline_warning_seen_${projectId}`
      const hasSeenWarning = localStorage.getItem(warningKey)

      if (!hasSeenWarning) {
        setShowDeadlineWarning(true)
      }
    }
  }, [projectId, project?.deadline, project?.deadline_decision, isDelayed])

  const handleDeadlineContinue = () => {
    if (projectId) {
      const warningKey = `deadline_warning_seen_${projectId}`
      localStorage.setItem(warningKey, 'true')
      setShowDeadlineWarning(false)
      // Refresh game status to get updated scores
      if (gameStatus) {
        // Trigger a refresh by updating a dependency
        window.location.reload()
      }
    }
  }

  const handleCloseProject = async (projectId: string) => {
    try {
      await closeProject(projectId)
      toast.success('Project closed successfully\nOpening your team’s end-of-quest summary.')
      navigate(`/project/${projectId}/project-end`)
    } catch (err) {
      console.error(err)
      toast.error(
        `Couldn’t close project\n${err instanceof Error ? err.message : 'Please try again.'}`
      )
    }
  }

  // Format deadline for display
  const formattedDeadline = useMemo(() => {
    if (!project?.deadline) return undefined
    return new Date(project.deadline).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  }, [project?.deadline])

  // Create PROJECT_DATA with real values
  const PROJECT_DATA = useMemo(
    () => ({
      deadline: formattedDeadline,
      daysLeft: isDelayed ? undefined : daysLeft,
      delayedDays: isDelayed ? delayedDays : undefined,
      isDelayed: isDelayed,
      estimatedTime: estimatedDays ?? undefined,
    }),
    [formattedDeadline, daysLeft, isDelayed, delayedDays, estimatedDays]
  )
  const HP_DATA = {
    boss: {
      current: gameStatus?.boss_status?.hp ?? 50,
      max: gameStatus?.boss_status?.max_hp ?? 100,
    },
    player: {
      current: me?.hp ?? 100,
      max: me?.max_hp ?? 100,
    },
  }

  return (
    <div className="flex h-[calc(100vh-148px)] w-full relative">
      {showDeadlineWarning && projectId && (
        <DeadlineWarningModal
          open={showDeadlineWarning}
          projectId={projectId}
          delayDays={delayedDays}
          onClose={() => setShowDeadlineWarning(false)}
          onContinue={handleDeadlineContinue}
        />
      )}
      {/* Left sidebar */}
      <aside className="w-125 flex-shrink-0 bg-offWhite border-r border-cream">
        <ScrollArea className="h-full" type="always">
          <ProjectDetailCard
            hpData={HP_DATA}
            projectData={PROJECT_DATA}
            userScore={me?.score ?? 0}
            gameStatus={gameStatus}
            projectId={projectId ?? undefined}
            onCloseProject={handleCloseProject}
          />
          <DamageLog logs={logs} />
          <ReviewTask
            projectId={projectId ?? null}
            doneTasks={tasks.done}
            myProjectMemberId={myProjectMemberId}
            onSupportApplied={(receiverIds) => {
              const actions: GameActionPayload[] = (receiverIds ?? []).map((id) => ({
                act: 'SUPPORT',
                userId: String(id),
              }))
              enqueueActions(actions)
            }}
          />
        </ScrollArea>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-offWhite overflow-hidden">
        <BossPlaceholder
          isVisible={showBossPlaceholder}
          projectMembers={projectMembers ?? []}
          payloadBatch={payloadBatch ?? []}
          payloadBatchNonce={payloadBatchNonce}
          bossRefreshNonce={bossRefreshNonce}
          bossUpdate={bossUpdate ?? { hp: 0, maxHp: 0 }}
          bossUpdateNonce={bossUpdateNonce}
        />
        <ToggleButton isVisible={showBossPlaceholder} onClick={toggleBossPlaceholder} />

        {/* Kanban board */}
        <section className="flex-1 overflow-y-auto pt-6 z-40">
          <ScrollArea className="h-full" type="always">
            <KanbanBoard
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              activeId={activeId}
              findActiveTask={findActiveTask}
              projectMember={projectMembers ?? []}
            />
          </ScrollArea>
        </section>
      </main>
    </div>
  )
}

export default ProjectPage
