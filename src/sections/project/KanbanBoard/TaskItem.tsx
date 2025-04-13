import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IoTrashOutline } from "react-icons/io5";
import { Task } from "./types";
import { DeleteConfirmationOverlay } from "./DeleteConfirmationOverlay";

interface TaskItemProps {
  id: string;
  task: Task;
  onDelete?: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ id, task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [showOverlay, setShowOverlay] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    onDelete?.(task.id);
    setShowOverlay(false);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          className={`cursor-grab p-3 rounded-lg border border-brown bg-offWhite shadow-sm flex flex-col gap-2 transition-all group relative ${
            isDragging ? "shadow-lg border-dashed scale-105" : "hover:shadow-md hover:scale-101"
          }`}
        >
          <div className="flex justify-between items-start">
            <h4 className="text-darkBrown text-base font-medium font-['Baloo_2']">
              {task.title}
            </h4>
            <IoTrashOutline
              onClick={(e) => {
                e.stopPropagation();
                setShowOverlay(true);
              }}
              className="opacity-0 group-hover:opacity-100 group-hover:text-red cursor-pointer text-xl"
            />
          </div>

          <div className="h-px bg-brown w-full"></div>
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