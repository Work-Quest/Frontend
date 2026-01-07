export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'done';

export interface Task {
  id?: string;
  title: string;
  priority: TaskPriority;
  description: string | null;
  deadline: string | null;
  iteration: string | null;
  assignees: string[];
  status: TaskStatus;
}

export interface TaskResponse {
  task_id?: string;
  project: string;
  priority: number;
  task_name: string;
  description: string;
  status: TaskStatus;
  deadline: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Tasks {
  backlog: Task[];
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}


export const PRIORITY_MAP: Record<number, TaskPriority> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Urgent',
}

export const PRIORITY_TO_NUMBER: Record<TaskPriority, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Urgent: 3,
}

// -----------------------------
// Mapper functions
// -----------------------------

export const mapTaskResponseToTask = (task: TaskResponse): Task => ({
  id: task.task_id ?? undefined,
  title: task.task_name,
  priority: PRIORITY_MAP[task.priority],
  description: task.description,
  deadline: task.deadline,
  iteration: null,
  assignees: [],
  status: task.status,
})

export const mapTaskToTaskResponse = (task: Task): TaskResponse => ({
  task_id: task.id?? undefined,
  project: '',
  priority: PRIORITY_TO_NUMBER[task.priority],
  task_name: task.title,
  description: task.description || '',
  status: task.status,
  deadline: task.deadline,
  created_at: '',
  completed_at: null,
})