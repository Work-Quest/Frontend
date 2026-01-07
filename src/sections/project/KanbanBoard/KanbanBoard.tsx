import type React from "react"
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { Task, Tasks, TaskStatus } from "./types";
import { UserStatus } from "@/types/User";

interface KanbanBoardProps {
  tasks: Tasks;
  onAddTask: (column: TaskStatus, task: Task) => void;
  onDragStart: (event: any) => void;
  onDragOver: (event: any) => void;
  onDragEnd: (event: any) => void;
  activeId: string | null;
  findActiveTask: () => Task | null;
  projectMember: UserStatus[]
}

const getColumnTitle = (id: string): string => {
  const titles: Record<string, string> = {
    backlog: "Backlog",
    todo: "TODO",
    inProgress: "In Progress",
    done: "Done",
  };
  return titles[id] || id;
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onAddTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDragEnd,
  activeId,
  findActiveTask,
  projectMember
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div className="p-4">
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
        <div className="flex gap-4 overflow-x-auto pb-4 px-2">
          {Object.keys(tasks).map((columnId) => (
            <KanbanColumn
              key={columnId}
              id={columnId as keyof typeof tasks}
              title={getColumnTitle(columnId)}
              tasks={tasks[columnId as keyof typeof tasks]}
              onAddTask={onAddTask}
              onDeleteTask={onDeleteTask}
              projectMember={projectMember}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div
              className="p-3 rounded-lg border border-brown border-dashed scale-105 bg-white/80 shadow-lg flex flex-col gap-2 transition-all"
              style={{ boxShadow: "0 8px 12px rgba(0, 0, 0, 0.15)" }}
            >
              <h4 className="text-darkBrown text-base font-medium font-['Baloo_2']">
                {findActiveTask()?.title}
              </h4>
              <div className="h-px bg-brown w-full"></div>
              <div className="flex flex-wrap gap-2">
                <div
                  className={`tag tag-priority ${
                    findActiveTask()?.priority === "Low"
                      ? "tag-priority-low"
                      : findActiveTask()?.priority === "Medium"
                      ? "tag-priority-medium"
                      : findActiveTask()?.priority === "High"
                      ? "tag-priority-high"
                      : "tag-priority-urgent"
                  }`}
                >
                  {findActiveTask()?.priority}
                </div>
                <div className="tag tag-iteration">
                  {findActiveTask()?.iteration}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {findActiveTask()?.assignees.map((assignee) => (
                  <div
                    key={`${findActiveTask()?.id}-${assignee}`}
                    className="tag tag-name"
                  >
                    {assignee}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
