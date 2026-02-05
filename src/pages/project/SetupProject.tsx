"use client"

import { AddTaskOverlay } from "@/sections/project/KanbanBoard/AddTaskOverlay"
import { useTask } from "@/hook/useTask"
import { TaskItem } from "@/sections/project/KanbanBoard/TaskItem"
import { useKanbanBoard } from "@/sections/project/KanbanBoard/useKanbanBoard"
import { Task } from "@/sections/project/KanbanBoard/types"
import useProjects from "@/hook/useProjects"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"


const PRIORITY_HP: Record<string, number> = {
  Low: 1000,
  Medium: 2000,
  High: 3000,
  Urgent: 4000,
}

export default function SetupProject() {
  const { fetchedTask, projectMembers } = useTask()
  const { tasks, handleAddTask, handleDeleteTask } = useKanbanBoard(fetchedTask)
  const { setupBoss } = useProjects()
  const navigate = useNavigate()
  const { projectId } = useParams()

  const handleBacklogAddTask = (task: Task) => {
    handleAddTask("backlog", task)
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
        <aside className="flex flex-col justify-center rounded-xl bg-white p-6 shadow-sm h-[40vh]">
          <h3 className="mb-4 text-center  text-lg font-semibold">
            Estimated Boss HP
          </h3>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500">
              {estimatedBossHP.toLocaleString()} HP
            </h1>
          </div>

         
        </aside>
        
      </div>
       <div
        className="
            fixed bottom-0 left-0
            w-screen h-[70px]
            flex items-center 
            bg-white
            z-[9999]
            shadow-md
        "
        >
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
  )
}
