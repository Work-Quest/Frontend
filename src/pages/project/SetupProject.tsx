"use client"

import { AddTaskOverlay } from "@/sections/project/KanbanBoard/AddTaskOverlay"
import { useTask } from "@/hook/useTask"
import { TaskItem } from "@/sections/project/KanbanBoard/TaskItem"
import { useKanbanBoard } from "@/sections/project/KanbanBoard/useKanbanBoard"
import { Task } from "@/sections/project/KanbanBoard/types"
import useProjects from "@/hook/useProjects"
import { useProjectMembers } from "@/hook/useProjectMembers"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { PartyMembers } from "@/sections/start-project/PartyMembers"
import { useMemo, useState } from "react"
import { PartyMember } from "@/types/User"
import { useAuth } from "@/context/AuthContext"


const PRIORITY_HP: Record<string, number> = {
  Low: 1000,
  Medium: 2000,
  High: 3000,
  Urgent: 4000,
}


export default function SetupProject() {
  const { fetchedTask } = useTask()
  const { tasks, handleAddTask, handleDeleteTask } = useKanbanBoard(fetchedTask)
  const { setupBoss, getProjectOwner } = useProjects()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { projectMembers, leaveProject, refetchProjectMembers } = useProjectMembers(projectId)

  const [isLoading] = useState(false);
  const handleBacklogAddTask = (task: Task) => {
    handleAddTask("backlog", task)
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
    const ownerUsername = (owner?.owner_username || "").toString().trim().toLowerCase()
    const ownerMemberId =
      ownerUsername
        ? members.find((m) => (m.username || "").toString().trim().toLowerCase() === ownerUsername)?.id
        : undefined

    return members.map((m) => {
      const h = stableHash(m.id || m.username || m.name || "")
      return {
        id: m.id,
        name: m.name,
        username: `@${m.username}`.replace(/^@@/, "@"),
        avatarId: (h % 6) + 1,
        avatarBgColorId: (h % 10) + 1,
        isLeader: ownerMemberId ? m.id === ownerMemberId : false,
      }
    })
  }, [getProjectOwner, projectId, projectMembers])

  const handleLeaveProject = async () => {
    try {
      await leaveProject()
      toast.success("Left project successfully.")
      // After leaving, user no longer has access to this project routes.
      navigate("/home", { replace: true })
    } catch (err: any) {
      const apiMsg = err?.response?.data?.error || err?.response?.data?.message
      toast.error(apiMsg || "Failed to leave project.")
      console.error(err)
    } finally {
      // Best-effort refresh if we stay on page for any reason.
      refetchProjectMembers().catch(() => {})
    }
  }

  const handleSetupBoss = async () => { 
    try {
      if (!projectId) {
        toast.error("Missing project id.")
        return
      }

      await setupBoss(projectId)
      toast.success("Boss setup completed successfully!")
      navigate(`/project/${projectId}`)
    } catch (error) {
      console.error("Error setting up boss:", error)
      toast.error("Failed to setup boss.")
      navigate(`/home`)
    }
  }

  const estimatedBossHP = Object.values(tasks)
    .flat()
    .reduce((sum, task) => {
      return sum + (PRIORITY_HP[task.priority] ?? 0)
    }, 0)

  return (
    <div className=" h-[100%] bg-[#f9f6f1] px-8 py-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-orange-500">
          Prepare Your Quest...
        </h1>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT — TASKS */}
        <section className="lg:col-span-2 space-y-4 h-[75vh] overflow-y-auto">
          <h2 className="text-lg font-semibold">Backlog</h2>

          <AddTaskOverlay
            columnId={"backlog"}
            projectMember={projectMembers ?? []}
            onAddTask={handleBacklogAddTask}
          />

          {tasks.backlog.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
              No tasks yet! Add tasks to begin your journey ⚔️
            </div>
          ) : (
            tasks.backlog.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                task={task}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </section>

        {/* RIGHT — ESTIMATED BOSS HP */}
        <div className="flex flex-col gap-4 h-full">
        <aside className="flex flex-col justify-center rounded-xl bg-white p-6 shadow-sm h-[15vh]">
          <h3 className="mb-4 text-center  text-lg font-semibold">
            Estimated Boss HP
          </h3>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500">
              {estimatedBossHP.toLocaleString()} HP
            </h1>
          </div>
            </aside>


          <div className="flex flex-col gap-5 ">
            <PartyMembers
              members={partyMembers}
              // maxSize={MAX_PARTY_SIZE}
              removeMember={() => handleLeaveProject()}
              canRemoveMember={(m) => {
                // Only allow "remove" (leave) for the current user.
                const currentUsername = (user?.username || "").toString().trim().toLowerCase()
                const memberUsername = (m.username || "").toString().trim().replace(/^@/, "").toLowerCase()
                return Boolean(currentUsername) && currentUsername === memberUsername && !m.isLeader
              }}
              // handleCopyLink={handleCopyLink}
              isLoading={isLoading}
            /> 
          </div>
         
      
        
      </div>
       <div
        className="
            fixed bottom-0 left-0
            w-screen h-[70px]
            flex items-center 
            bg-white
            z-[9999]
            shadow-md
        ">
            <div className="flex w-screen mx-10 justify-between">
                <button
                    className= "!text-[rgba(148, 139, 129, 1)] px-6 py-2 rounded-md"
                    type="button"
                    onClick={() => navigate(`/home`)}
                >
                    retreat
                </button>
                <button
                    className="!bg-[rgba(215,206,197,1)] !text-[rgba(148, 139, 129, 1)] px-6 py-2 rounded-md"
                    onClick={handleSetupBoss}
                >
                    Begin Fight!
                </button>
          </div>
          </div>
        </div>
    </div>
  )
}
