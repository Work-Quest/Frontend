'use client'

import { AddTaskOverlay } from '@/sections/project/KanbanBoard/AddTaskOverlay'
import { useTask } from '@/hook/useTask'
import { TaskItem } from '@/sections/project/KanbanBoard/TaskItem'
import { useKanbanBoard } from '@/sections/project/KanbanBoard/useKanbanBoard'
import { Task } from '@/sections/project/KanbanBoard/types'
import useProjects from '@/hook/useProjects'
import { useProjectMembers } from '@/hook/useProjectMembers'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { PartyMembers } from '@/sections/start-project/PartyMembers'
import { useMemo, useState } from 'react'
import { PartyMember } from '@/types/User'
import { useAuth } from '@/context/AuthContext'
import { getAxiosApiMessage } from '@/lib/apiError'

const PRIORITY_HP: Record<string, number> = {
  Low: 1000,
  Medium: 2000,
  High: 3000,
  Urgent: 4000,
}

export default function SetupProject() {
  const { fetchedTask } = useTask()
  const { tasks, handleAddTask, handleDeleteTask, handleUpdateTask } = useKanbanBoard(fetchedTask)
  const { setupBoss, getProjectOwner } = useProjects()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { projectId } = useParams()
  // Poll members so the party list updates as people join/leave without refreshing the page.
  const { projectMembers, leaveProject, refetchProjectMembers } = useProjectMembers(projectId, {
    pollIntervalMs: 5000,
    refetchOnFocus: true,
  })

  const [isLoading] = useState(false)
  const handleBacklogAddTask = (task: Task) => {
    handleAddTask('backlog', task)
  }

  const partyMembers: PartyMember[] = useMemo(() => {
    // Backend `/members/` returns `UserStatus` (no avatar fields),
    // so we derive stable avatars from ids for display.
    const stableHash = (s: string) => {
      let h = 0
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
      return h
    }

    const members = projectMembers ?? []
    const owner = getProjectOwner(projectId)
    const ownerUsername = (owner?.owner_username || '').toString().trim().toLowerCase()
    const ownerMemberId = ownerUsername
      ? members.find((m) => (m.username || '').toString().trim().toLowerCase() === ownerUsername)
          ?.id
      : undefined

    return members.map((m) => {
      const h = stableHash(m.id || m.username || m.name || '')
      const avatarId =
        m.selected_character_id && m.selected_character_id >= 1 && m.selected_character_id <= 9
          ? m.selected_character_id
          : (h % 9) + 1
      const avatarBgColorId =
        m.bg_color_id && m.bg_color_id >= 1 && m.bg_color_id <= 8 ? m.bg_color_id : (h % 8) + 1
      return {
        id: m.id,
        name: m.name,
        username: `@${m.username}`.replace(/^@@/, '@'),
        avatarId,
        avatarBgColorId,
        isLeader: ownerMemberId ? m.id === ownerMemberId : false,
      }
    })
  }, [getProjectOwner, projectId, projectMembers])

  const handleLeaveProject = async () => {
    try {
      await leaveProject()
      toast.success('You’ve left this project.\nBack on your home dashboard.')
      // After leaving, user no longer has access to this project routes.
      navigate('/home', { replace: true })
    } catch (err: unknown) {
      const apiMsg = getAxiosApiMessage(err)
      toast.error(`Couldn’t leave the project\n${apiMsg || 'Try again in a moment.'}`)
      console.error(err)
    } finally {
      // Best-effort refresh if we stay on page for any reason.
      refetchProjectMembers().catch(() => {})
    }
  }

  const handleSetupBoss = async () => {
    try {
      if (!projectId) {
        toast.error('Missing project\nOpen setup from your project list and try again.')
        return
      }

      await setupBoss(projectId)
      toast.success('Boss is ready!\nOpening your quest…')
      navigate(`/project/${projectId}`)
    } catch (error) {
      console.error('Error setting up boss:', error)
      toast.error('Couldn’t start the fight\nCheck your connection and backlog, then try again.')
      navigate(`/home`)
    }
  }

  const estimatedBossHP = Object.values(tasks)
    .flat()
    .reduce((sum, task) => {
      return sum + (PRIORITY_HP[task.priority] ?? 0)
    }, 0)

  return (
    <div className="!bg-[#f9f6f1] px-8 pt-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        <header className="space-y-2 lg:col-span-2 lg:row-start-1 lg:self-start">
          <h1 className="!text-3xl sm:!text-4xl !font-bold !text-red !font-baloo2 !tracking-tight">
            Prepare your quest
          </h1>
        </header>

        <section className="lg:col-span-2 lg:row-start-2 flex flex-col h-[72vh] min-h-0 gap-0">
          <div className="shrink-0 space-y-4 pb-4 !bg-[#f9f6f1]">
            <div>
              <h2 className="!text-lg !font-semibold !text-darkBrown !font-baloo2">Backlog</h2>
              <p className="mt-1 !text-sm !text-lightBrown !font-baloo2 !leading-relaxed">
                Tasks here use priority to shape boss HP. Assign teammates before you head into battle.
              </p>
            </div>

            <AddTaskOverlay
              columnId={'backlog'}
              projectMember={projectMembers ?? []}
              onAddTask={handleBacklogAddTask}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto space-y-4 pr-1 pb-12 [scrollbar-gutter:stable]">
            {tasks.backlog.length === 0 ? (
              <div className="rounded-xl !bg-white p-6 text-center shadow-sm border border-brown/10">
                <p className="!text-sm !text-lightBrown !font-baloo2 !leading-relaxed max-w-md mx-auto">
                  No tasks yet. Use{' '}
                  <span className="!font-semibold !text-darkBrown !font-baloo2">Add Task</span> to
                  build your backlog—each task adds to the boss’s strength by priority.
                </p>
              </div>
            ) : (
              tasks.backlog.map((task) => (
                <TaskItem
                  key={task.id}
                  id={task.id}
                  task={task}
                  disableHover
                  projectMember={projectMembers ?? []}
                  onDelete={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                />
              ))
            )}
          </div>
        </section>

        <div className="flex flex-col gap-4 min-h-0 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:self-start">
          <aside className="flex flex-col rounded-xl !bg-white p-6 shadow-sm border border-brown/10">
            <h3 className="text-center !text-lg !font-semibold !text-darkBrown !font-baloo2">
              Estimated boss HP
            </h3>
            <p className="mt-1 mb-3 text-center !text-xs !text-lightBrown !font-baloo2 px-2 !leading-relaxed">
              Total from backlog task priorities—your starting challenge level.
            </p>
            <div className="text-center">
              <p className="!text-3xl !font-bold !text-red-500 !font-baloo2 tabular-nums">
                {estimatedBossHP.toLocaleString()} HP
              </p>
            </div>
          </aside>

          <div className="flex flex-col gap-5 min-w-0">
            <PartyMembers
              members={partyMembers}
              removeMember={() => handleLeaveProject()}
              canRemoveMember={(m) => {
                const currentUsername = (user?.username || '').toString().trim().toLowerCase()
                const memberUsername = (m.username || '')
                  .toString()
                  .trim()
                  .replace(/^@/, '')
                  .toLowerCase()
                return Boolean(currentUsername) && currentUsername === memberUsername && !m.isLeader
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      <div
        className="
          fixed bottom-0 left-0
          w-screen h-[70px]
          flex items-center
          !bg-white
          z-[9999]
          shadow-md
      "
      >
        <div className="flex w-screen mx-10 justify-between items-center">
          <button
            className="!bg-transparent !text-[rgba(148,139,129,1)] !font-baloo2 !font-semibold !text-sm px-6 py-2 rounded-md hover:!opacity-90 transition-opacity"
            type="button"
            onClick={() => navigate(`/home`)}
          >
            Back to home
          </button>
          <button
            type="button"
            className="!bg-[rgba(215,206,197,1)] !text-darkBrown !font-baloo2 !font-semibold !text-sm px-6 py-2 rounded-md hover:!opacity-95 transition-opacity"
            onClick={handleSetupBoss}
          >
            Begin fight
          </button>
        </div>
      </div>
    </div>
  )
}
