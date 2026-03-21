import React, { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Task } from "./types"
import { UserStatus } from "@/types/User"
import { DeleteConfirmationOverlay } from "./DeleteConfirmationOverlay"
import { EditTaskOverlay } from "./EditTaskOverlay"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskItemProps {
  id: string;
  task: Task;
  disabled?: boolean;
  projectMember: UserStatus[]
  onDelete?: (taskId: string) => void
  onUpdateTask?: (task: Task) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  task,
  disabled,
  projectMember,
  onDelete,
  onUpdateTask,
}) => {
// export const TaskItem: React.FC<TaskItemProps> = ({ id, task, disabled = false, onDelete }) => {
  const isDone = disabled || task.status === "done";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false)
  const [showEditOverlay, setShowEditOverlay] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    if (!task.id) return
    onDelete?.(task.id)
    setShowDeleteOverlay(false)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(disabled ? {} : attributes)}
        {...(disabled ? {} : listeners)}
        className={`p-3 rounded-lg border ${
          isDone
            ? "border-gray-300 bg-gray-100"
            : "border-brown bg-offWhite"
        } ${
          isDragging
            ? "border-dashed scale-105 bg-white/80 shadow-lg"
            : isDone
              ? "shadow-sm"
              : "shadow-sm hover:shadow-md hover:scale-[1.01]"
        } flex flex-col gap-2 transition-all ${
          disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="flex justify-between items-start">
          <h4 className="text-darkBrown text-base font-medium font-baloo2">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="p-1 rounded hover:bg-cream/50 text-brown hover:text-darkBrown transition-colors"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[140px] bg-offWhite border-lightBrown font-baloo2"
            >
              <DropdownMenuItem
                className="cursor-pointer focus:bg-cream"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowEditOverlay(true)
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteOverlay(true)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className={`h-px w-full ${isDone ? "bg-gray-300" : "bg-brown"}`}></div>
        <div className="flex flex-wrap gap-2">
          <div
            className={`tag tag-priority ${
              task.priority === "Low"
                ? "tag-priority-low"
                : task.priority === "Medium"
                  ? "tag-priority-medium"
                  : task.priority === "High"
                    ? "tag-priority-high"
                    : "tag-priority-urgent"
            }`}
          >
            {task.priority}
          </div>
          <div className="tag tag-iteration">{task.iteration}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(task.assigneesName?.length ? task.assigneesName : task.assignees).map(
            (assignee) => (
              <div key={`${task.id}-${assignee}`} className="tag tag-name">
                {assignee}
              </div>
            ),
          )}
        </div>
      </div>

      {showDeleteOverlay && (
        <DeleteConfirmationOverlay
          task={task}
          onCancel={() => setShowDeleteOverlay(false)}
          onConfirm={handleDelete}
        />
      )}

      <EditTaskOverlay
        task={task}
        open={showEditOverlay}
        onOpenChange={setShowEditOverlay}
        projectMember={projectMember}
        onUpdateTask={(updated) => {
          onUpdateTask?.(updated)
          setShowEditOverlay(false)
        }}
      />
    </>
  );
};
