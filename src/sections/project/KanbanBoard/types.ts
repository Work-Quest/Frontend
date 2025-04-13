export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  iteration: string;
  assignees: string[];
  status: TaskStatus;
}

export interface Tasks {
  backlog: Task[];
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}