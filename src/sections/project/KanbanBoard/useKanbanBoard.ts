import { useState } from 'react';
import { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Tasks } from './types';

const initialTasks: Tasks = {
  backlog: [
    { id: 'task-1', title: 'Design database schema', priority: 'High', iteration: 'Sprint 1', assignees: ['Alice', 'You'] },
    { id: 'task-2', title: 'Research API requirements', priority: 'Medium', iteration: 'Sprint 1', assignees: ['Bob'] },
  ],
  todo: [
    { id: 'task-3', title: 'Setup project repository', priority: 'Low', iteration: 'Sprint 1', assignees: ['You'] },
    { id: 'task-4', title: 'Create component structure', priority: 'Medium', iteration: 'Sprint 1', assignees: ['Charlie', 'Alice'] },
  ],
  inProgress: [
    { id: 'task-5', title: 'Implement authentication', priority: 'Urgent', iteration: 'Sprint 2', assignees: ['You', 'David'] },
  ],
  done: [
    { id: 'task-6', title: 'Project setup', priority: 'Low', iteration: 'Sprint 1', assignees: ['Bob'] },
  ],
};

export const useKanbanBoard = () => {
  const [tasks, setTasks] = useState<Tasks>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const findContainer = (id: string) => {
    if (id in tasks) return id as keyof Tasks;
    for (const [container, containerTasks] of Object.entries(tasks)) {
      if (containerTasks.some((task: { id: string }) => task.id === id)) {
        return container as keyof Tasks;
      }
    }
    return null;
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
    findActiveTask
  };
};