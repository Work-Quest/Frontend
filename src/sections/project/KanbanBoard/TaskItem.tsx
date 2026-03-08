import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IoTrashOutline } from "react-icons/io5";
import { Task } from "./types";
import { DeleteConfirmationOverlay } from "./DeleteConfirmationOverlay";

interface TaskItemProps {
  id: string;
  task: Task;
  disabled?: boolean;
  onDelete?: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ id, task, disabled = false, onDelete }) => {
  const isDone = disabled || task.status === "done";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const [showOverlay, setShowOverlay] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    if (!task.id) return;
    onDelete?.(task.id);
    setShowOverlay(false);
  };

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
          <h4
            className={`text-base font-medium font-['Baloo_2'] ${
              isDone ? "text-gray-700" : "text-darkBrown"
            }`}
          >
            {task.title}
          </h4>
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowOverlay(true)
            }}
            {...{
              "data-no-dnd": true,
              onPointerDown: (e) => {
                e.stopPropagation()
              },
              onKeyDown: (e) => {
                e.stopPropagation()
              },
              draggable: false,
            }}
          >
            <IoTrashOutline
              className={`text-xl hover:scale-110 transition-transform ${
                isDone
                  ? "text-gray-600 hover:text-red"
                  : "text-darkBrown hover:text-red"
              }`}
            />
          </div>
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
          {task.assignees.map((assignee) => (
            <div key={`${task.id}-${assignee}`} className="tag tag-name">
              {assignee}
            </div>
          ))}
        </div>
      </div>

      {showOverlay && (
        <DeleteConfirmationOverlay
          task={task}
          onCancel={() => setShowOverlay(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
