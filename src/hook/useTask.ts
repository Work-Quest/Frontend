import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { mapTaskResponseToTask, Task, TaskResponse, Tasks } from "../sections/project/KanbanBoard/types";
import { get } from "@/Api";
import { usePolling } from "./usePolling";
import { POLLING_CONFIG } from "@/config/pollingConfig";

export type UseTaskOptions = {
  /**
   * If set, will continuously refetch tasks while the component is mounted.
   * This is "long polling" style (request -> wait -> request) to avoid overlaps.
   * If not set, uses centralized config default.
   */
  pollIntervalMs?: number
  /**
   * Enable/disable polling (default: true)
   */
  enabled?: boolean
}

export const useTask = (options?: UseTaskOptions) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [fetchedTask, setFetchedTasks] = useState<Tasks>({
    backlog: [],
    todo: [],
    inProgress: [],
    done: [],
  });
  const [activeId] = useState<string | null>(null);

  const pollIntervalMs = options?.pollIntervalMs ?? POLLING_CONFIG.tasks.interval
  const enabled = options?.enabled ?? true

  const fetchTasks = async (projectId: string, silent?: boolean): Promise<TaskResponse[]> => {
    const response = await get<TaskResponse[]>(`/api/project/${projectId}/tasks/`, silent);
    return response;
  };

  const refetch = useCallback(async (opts?: { silent?: boolean }) => {
    if (!projectId) return null
    try {
      const tasks = await fetchTasks(projectId, opts?.silent);
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
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }, [projectId]);

  // Use centralized polling hook
  usePolling(refetch, {
    pollIntervalMs: enabled ? pollIntervalMs : undefined,
    enabled,
  }, [projectId])

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
    refetch,
  };
};
