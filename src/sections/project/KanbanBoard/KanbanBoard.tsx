import type React from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { Task, Tasks, TaskStatus } from './types'
import { UserStatus } from '@/types/User'

interface KanbanBoardProps {
  tasks: Tasks
  onAddTask: (column: TaskStatus, task: Task) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onDragStart: (event: DragStartEvent) => void
  onDragOver: (event: DragOverEvent) => void
  onDragEnd: (event: DragEndEvent) => void
  activeId: string | null
  findActiveTask: () => Task | null
  projectMember: UserStatus[]
}

const getColumnTitle = (id: string): string => {
  const titles: Record<string, string> = {
    backlog: 'Backlog',
    todo: 'TODO',
    inProgress: 'In Progress',
    done: 'Done',
  }
  return titles[id] || id
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDragEnd,
  activeId,
  findActiveTask,
  projectMember,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeTask = findActiveTask()
  const activeAssignees = activeTask?.assigneesName?.length
    ? activeTask.assigneesName
    : (activeTask?.assignees ?? [])

  return (
    <div className="box-border min-w-0 w-full max-w-full p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        modifiers={[]}
        autoScroll={true}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
      >
        <div className="flex min-w-0 w-full max-w-full gap-4 overflow-x-auto overflow-y-visible pb-4 px-2 [scrollbar-gutter:stable]">
          {Object.keys(tasks).map((columnId) => (
            <KanbanColumn
              key={columnId}
              id={columnId as keyof typeof tasks}
              title={getColumnTitle(columnId)}
              tasks={tasks[columnId as keyof typeof tasks]}
              onAddTask={onAddTask}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              projectMember={projectMember}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div
              className="p-3 rounded-lg border border-brown border-dashed scale-105 bg-white/80 shadow-lg flex flex-col gap-2 transition-all"
              style={{ boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)' }}
            >
              <h4 className="text-darkBrown text-base font-medium font-baloo2">
                {activeTask?.title}
              </h4>
              <div className="h-px bg-brown w-full"></div>
              <div className="flex flex-wrap gap-2">
                <div
                  className={`tag tag-priority ${
                    activeTask?.priority === 'Low'
                      ? 'tag-priority-low'
                      : activeTask?.priority === 'Medium'
                        ? 'tag-priority-medium'
                        : activeTask?.priority === 'High'
                          ? 'tag-priority-high'
                          : 'tag-priority-urgent'
                  }`}
                >
                  {activeTask?.priority}
                </div>
                <div className="tag tag-iteration">{activeTask?.iteration}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeAssignees.map((assignee) => (
                  <div key={`${activeTask?.id ?? 'task'}-${assignee}`} className="tag tag-name">
                    {assignee}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
