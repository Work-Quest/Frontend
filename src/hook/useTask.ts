import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { mapTaskResponseToTask, Task, TaskResponse, Tasks } from "../sections/project/KanbanBoard/types";
import { get } from "@/Api";

export type UseTaskOptions = {
  /**
   * If set, will continuously refetch tasks while the component is mounted.
   * This is "long polling" style (request -> wait -> request) to avoid overlaps.
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

  const pollIntervalMs = options?.pollIntervalMs
  const enabled = options?.enabled ?? true

  const fetchTasks = async (projectId: string): Promise<TaskResponse[]> => {
    const response = await get<TaskResponse[]>(`/api/project/${projectId}/tasks/`);
    return response;
  };

  const refetch = useCallback(async (opts?: { silent?: boolean }) => {
    if (!projectId) return null
    if (!opts?.silent) {
      // Could add loading state here if needed
    }
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
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return
    void refetch()
  }, [projectId, refetch])

  // Long-poll loop: request -> wait -> request (no overlap).
  useEffect(() => {
    if (!projectId) return
    if (!enabled) return
    if (!pollIntervalMs || pollIntervalMs <= 0) return

    let cancelled = false
    let timer: number | null = null

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(() => resolve(), ms)
      })

    const loop = async () => {
      // Start after initial load; keep refreshing silently.
      while (!cancelled) {
        try {
          await refetch({ silent: true })
        } catch {
          // keep polling even if a request fails
        }
        await sleep(pollIntervalMs)
      }
    }

    void loop()

    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [projectId, enabled, pollIntervalMs, refetch])

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
