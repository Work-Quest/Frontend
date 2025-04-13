import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";
import { Task, Tasks } from "./types";
import { Button } from "@/components/ui/button";
import { IoAddCircleOutline } from "react-icons/io5";

interface KanbanColumnProps {
  id: keyof Tasks;
  title: string;
  tasks: Task[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
}) => {
  const { setNodeRef } = useDroppable({ id: `column-${id}` });

  return (
    <div ref={setNodeRef} className="w-full min-h-[300px] flex flex-col">
      <div className="flex items-center mb-3">
        <h3>{title}</h3>
        <p className="ml-2 px-2 bg-lightBrown !text-offWhite text-sm !font-bold rounded-full">
          {tasks.length}
        </p>
      </div>
      <Button variant="shadow" className="!bg-blue mb-4">
        <IoAddCircleOutline />
        Add Task
      </Button>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 flex-grow">
          {tasks.map((task) => (
            <TaskItem key={task.id} id={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
