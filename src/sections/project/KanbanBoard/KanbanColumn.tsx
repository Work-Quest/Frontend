import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";
import { Task, Tasks } from "./types";
import { AddTaskOverlay } from "./AddTaskOverlay";

interface KanbanColumnProps {
  id: keyof Tasks;
  title: string;
  tasks: Task[];
  onAddTask: (columnId: keyof Tasks, task: Omit<Task, "id">) => void;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onAddTask,
  onDeleteTask,
}) => {
  const { setNodeRef } = useDroppable({ id: `column-${id}` });

  const handleAddTask = (task: Omit<Task, "id">) => {
    onAddTask(id, task);
  };

  return (
    <div ref={setNodeRef} className="w-full min-h-[300px] flex flex-col">
      <div className="flex items-center mb-3">
        <h3 className="text-darkBrown font-medium font-['Baloo_2']">{title}</h3>
        <p className="ml-2 px-2 bg-lightBrown !text-offWhite text-sm !font-bold rounded-full">
          {tasks.length}
        </p>
      </div>
      
      <AddTaskOverlay columnId={id} onAddTask={handleAddTask} />
      
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 flex-grow">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              id={task.id} 
              task={task} 
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
