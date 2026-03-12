export type ReviewLogEntry = {
  id: string
  title: string
  participants: string[]
  timestamp: string | Date
}

export type ReviewHistoryEntry = {
  id: string
  title: string
  participants: string[]
  timestamp: string | Date
  comment: string
}

export type ReviewTaskData = {
  latestLogs: ReviewLogEntry[]
  otherLogsOptions: ReviewLogEntry[]
  history: ReviewHistoryEntry[]
}

export type ReviewTaskProps = {
  /** Replace with API data later. When provided, overrides mock data. */
  data?: ReviewTaskData | null
}
