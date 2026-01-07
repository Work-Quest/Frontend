"use client"

import { useEffect, useState } from 'react';
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { mapTaskResponseToTask, mapTaskToTaskResponse, Task, TaskResponse, Tasks, TaskStatus } from "./types";
import { post } from '@/Api';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useKanbanBoard = (initialTasks: Tasks) => {
  const [tasks, setTasks] = useState<Tasks>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { projectId } = useParams<{ projectId: string }>();

   // Add this useEffect to update tasks when initialTasks changes
   useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);


  const findContainer = (id: string) => {
    if (id in tasks) return id as keyof Tasks;
    for (const [container, containerTasks] of Object.entries(tasks)) {
      if (containerTasks.some((task: { id: string }) => task.id === id)) {
        return container as keyof Tasks;
      }
    }
    return null;
  };

  // const handleAddTask = (columnId: TaskStatus, task: Omit<Task, "id">) => {
  //   const newTask: Task = {
  //     ...task,
  //     id: `task-${Date.now()}`,
  //     status: columnId,
  //     iteration: task.iteration || 'Sprint 1',
  //     assignees: task.assignees || ['You'],
  //   };
    
  //   setTasks(prev => ({
  //     ...prev,
  //     [columnId]: [...prev[columnId], newTask]
  //   }));
  // };

  const handleAddTask = async (
    columnId: TaskStatus,
    task: Task
  ) => {
    try {
      const mappedTask = mapTaskToTaskResponse(task);
      const res = await post<TaskResponse, TaskResponse>(`/api/project/${projectId}/tasks/create/`, mappedTask);
      const createdTask = mapTaskResponseToTask(res);
      console.log("Created Task:", createdTask);

      console.log(task.assignees);
      if (task.assignees.length > 0) {
        for (const assignee of task.assignees) {
          // Assuming there's an API endpoint to assign users to tasks
          await post(`/api/project/${projectId}/tasks/${createdTask.id}/assign/`, { "project_member_id": assignee });
          console.log(`Assigned ${assignee} to task ${createdTask.id}`);
        }
      }
      // update state without refetch
      setTasks(prev => ({
        ...prev,
        [columnId]: [...prev[columnId], createdTask],
      }));
      toast.success("Task added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => {
      const newTasks = {...prev};
      for (const column in newTasks) {
        newTasks[column as keyof Tasks] = newTasks[column as keyof Tasks].filter(task => task.id !== taskId);
      }
      return newTasks;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeContainer = findContainer(active.id as string);
    if (!activeContainer) return;
    
    if (over.id.toString().startsWith('column-')) {
      const containerId = over.id.toString().replace('column-', '') as keyof Tasks;
      if (activeContainer === containerId) return;
      
      setTasks(prev => {
        const activeItems = prev[activeContainer];
        const activeIndex = activeItems.findIndex(item => item.id === active.id);
        return {
          ...prev,
          [activeContainer]: prev[activeContainer].filter(item => item.id !== active.id),
          [containerId]: [...prev[containerId], prev[activeContainer][activeIndex]]
        };
      });
      return;
    }
    
    const overContainer = findContainer(over.id as string);
    if (!overContainer || activeContainer === overContainer) return;

    setTasks(prev => {
      const activeItems = prev[activeContainer];
      const activeIndex = activeItems.findIndex(item => item.id === active.id);
      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter(item => item.id !== active.id)],
        [overContainer]: [...prev[overContainer], prev[activeContainer][activeIndex]]
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const activeContainer = findContainer(active.id as string);
    if (!activeContainer) {
      setActiveId(null);
      return;
    }
    
    if (over.id.toString().startsWith('column-')) {
      const containerId = over.id.toString().replace('column-', '') as keyof Tasks;
      if (activeContainer !== containerId) {
        setTasks(prev => {
          const activeItems = prev[activeContainer];
          const activeIndex = activeItems.findIndex(item => item.id === active.id);
          return {
            ...prev,
            [activeContainer]: prev[activeContainer].filter(item => item.id !== active.id),
            [containerId]: [...prev[containerId], prev[activeContainer][activeIndex]]
          };
        });
      }
      setActiveId(null);
      return;
    }
    
    const overContainer = findContainer(over.id as string);
    if (!overContainer) {
      setActiveId(null);
      return;
    }
    
    if (activeContainer === overContainer) {
      const activeIndex = tasks[activeContainer].findIndex(task => task.id === active.id);
      const overIndex = tasks[overContainer].findIndex(task => task.id === over.id);
      
      if (activeIndex !== overIndex) {
        setTasks(prev => ({
          ...prev,
          [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex)
        }));
      }
    }
    
    setActiveId(null);
  };

  const findActiveTask = () => {
    if (!activeId) return null;
    const container = findContainer(activeId);
    if (!container) return null;
    return tasks[container].find(task => task.id === activeId) || null;
  };

  return {
    tasks,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    findActiveTask,
    handleAddTask,
    handleDeleteTask,
  };
};