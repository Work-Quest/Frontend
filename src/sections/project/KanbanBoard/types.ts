export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'done'

export interface Task {
  id: string
  title: string
  priority: TaskPriority
  description: string | null
  deadline: string | null
  assignees: string[]
  assigneesName: string[]
  status: TaskStatus
}

export interface TaskResponse {
  task_id: string
  project: string
  priority: number
  task_name: string
  description: string
  status: TaskStatus
  deadline: string | null
  created_at: string
  completed_at: string | null
  // Optional fields depending on backend serializer (for persistence after refresh)
  assignees?: unknown
  assignees_name?: unknown
  assignee_names?: unknown
  assignee_ids?: unknown
}

export interface Tasks {
  backlog: Task[]
  todo: Task[]
  inProgress: Task[]
  done: Task[]
}

export const PRIORITY_MAP: Record<number, TaskPriority> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Urgent',
}

export const PRIORITY_TO_NUMBER: Record<TaskPriority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Urgent: 4,
}

// -----------------------------
// Mapper functions
// -----------------------------

function unknownArrayToStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => String(v))
}

export const mapTaskResponseToTask = (task: TaskResponse): Task => ({
  id: task.task_id,
  title: task.task_name,
  priority: PRIORITY_MAP[task.priority],
  description: task.description,
  deadline: task.deadline,
  assignees: unknownArrayToStrings(task.assignees ?? task.assignee_ids),
  assigneesName: unknownArrayToStrings(task.assignees_name ?? task.assignee_names),
  status: task.status,
})

export const mapTaskToTaskResponse = (task: Task): TaskResponse => ({
  task_id: task.id ?? undefined,
  project: '',
  priority: PRIORITY_TO_NUMBER[task.priority],
  task_name: task.title,
  description: task.description || '',
  status: task.status,
  deadline: task.deadline,
  created_at: '',
  completed_at: null,
})
