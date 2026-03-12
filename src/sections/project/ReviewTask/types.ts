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
  projectId?: string | null
  /** Done tasks to review (already filtered to the current project). */
  doneTasks: Array<{
    id: string
    title: string
    assignees: string[]
    assigneesName: string[]
  }>
  /** Current user's project_member_id (used to filter out self-assigned tasks). */
  myProjectMemberId: string | null
  /** Called after support endpoint succeeds (to animate receivers). */
  onSupportApplied?: (receiverProjectMemberIds: string[]) => void
}
