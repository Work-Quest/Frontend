export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  iteration: string;
  assignees: string[];
}

export interface Tasks {
  backlog: Task[];
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}