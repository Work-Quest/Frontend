import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { mapTaskResponseToTask, Task, TaskResponse, Tasks } from "../sections/project/KanbanBoard/types";
import { get } from "@/Api";

export const useTask = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [fetchedTask, setFetchedTasks] = useState<Tasks>({
    backlog: [],
    todo: [],
    inProgress: [],
    done: [],
  });
  const [activeId] = useState<string | null>(null);

  const fetchTasks = async (projectId: string): Promise<TaskResponse[]> => {
    const response = await get<TaskResponse[]>(`/api/project/${projectId}/tasks/`);
    return response;
  };

  useEffect(() => {
    if (projectId) {
      const loadTasks = async () => {
        try {
          const tasks = await fetchTasks(projectId);
          const organizedTasks: Tasks = {
            backlog: [],
            todo: [],
            inProgress: [],
            done: [],
          };
          tasks.forEach((task) => {
            if (task.status in organizedTasks) {
              const mappedTask = mapTaskResponseToTask(task);
              organizedTasks[task.status as keyof Tasks].push(mappedTask);
            }
          });
          setFetchedTasks(organizedTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      loadTasks();
    }
  }, [projectId]);

  const findActiveTask = useCallback((): Task | null => {
    if (!activeId) return null;
    for (const columnId in fetchedTask) {
      const foundTask = fetchedTask[columnId as keyof Tasks].find(
        (task) => task.id === activeId
      );
      if (foundTask) return foundTask;
    }
    return null;
  }, [activeId, fetchedTask]);

  return {
    fetchedTask,
    setFetchedTasks,
    activeId,
    findActiveTask,
  };
};
