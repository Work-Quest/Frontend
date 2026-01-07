import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { mapTaskResponseToTask, Task, TaskResponse, Tasks, TaskStatus } from "../sections/project/KanbanBoard/types";
import { get, post, patch, del } from "@/Api";
import { UserStatus } from "@/types/User";

export const useTask = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [fetchedTask, setFetchedTasks] = useState<Tasks>({
    backlog: [],
    todo: [],
    inProgress: [],
    done: [],
  });
  const [projectMembers, setProjectMember] = useState<UserStatus[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const fetchTasks = async (projectId: string): Promise<TaskResponse[]> => {
    const response = await get<TaskResponse[]>(`/api/project/${projectId}/tasks/`);
    return response;
  };

  const fetchMembers = async(projectId: string): Promise<UserStatus[]> => {
    const response = await get<UserStatus[]>(`/api/project/${projectId}/members/`);
    return response;
  };


  // const updateTaskStatus = async (projectId: string, taskId: string, status: TaskStatus): Promise<Task> => {
  //   const response = await patch<{ status: TaskStatus }, Task>(`/api/project/${projectId}/tasks/${taskId}/update/`, {
  //     status: status,
  //   });
  //   return response;
  // };

  // const addTask = async (projectId: string, task: Omit<Task, 'id'>): Promise<Task> => {
  //   const response = await post<Omit<Task, 'id'>, Task>(`/api/project/${projectId}/tasks/create/`, task);
  //   return response;
  // };

  // const deleteTask = async (projectId: string, taskId: string): Promise<void> => {
  //   await del(`/api/project/${projectId}/tasks/${taskId}/delete/`);
  // };
  

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
          const members = await fetchMembers(projectId);
          setProjectMember(members)
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
    projectMembers,
    setProjectMember
  };
};
