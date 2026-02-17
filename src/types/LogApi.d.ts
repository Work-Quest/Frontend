export type ProjectLogEntry = {
  id: string
  project_id: string
  actor_type: "user" | "boss" | "system" | string
  actor_id: string | null
  event_type: string
  payload: Record<string, unknown>
  created_at: string
}

export type ProjectGameLogsResponse = {
  project_id: string
  logs: ProjectLogEntry[]
  count: number
}




