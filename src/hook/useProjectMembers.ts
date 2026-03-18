"use client"

import { useCallback, useState } from "react"
import { get, post } from "@/Api"
import type { UserStatus } from "@/types/User"
import { usePolling } from "./usePolling"
import { POLLING_CONFIG } from "@/config/pollingConfig"

type UseProjectMembersOptions = {
  /**
   * Polling interval in ms. Set to 0 to disable polling.
   * If not set, uses centralized config default.
   */
  pollIntervalMs?: number
  /**
   * Enable/disable polling (default: true)
   */
  enabled?: boolean
  /**
   * Refetch immediately when returning to the tab/window.
   * Default: true
   */
  refetchOnFocus?: boolean
}

export function useProjectMembers(projectId?: string, options: UseProjectMembersOptions = {}) {
  const [projectMembers, setProjectMembers] = useState<UserStatus[] | null>(null)
  const [membersLoading, setMembersLoading] = useState(false)
  const [membersError, setMembersError] = useState<string | null>(null)

  const pollIntervalMs = options.pollIntervalMs ?? POLLING_CONFIG.members.interval
  const enabled = options?.enabled ?? true
  const refetchOnFocus = options.refetchOnFocus ?? true

  const refetchProjectMembers = useCallback(async (opts?: { silent?: boolean }) => {
    if (!projectId) return null
    try {
      if (!opts?.silent) {
        setMembersLoading(true)
        setMembersError(null)
      }
      const members = await get<UserStatus[]>(`/api/project/${projectId}/members/`, opts?.silent)
      setProjectMembers(members)
      if (!opts?.silent) {
        setMembersError(null)
      }
      return members
    } catch (error) {
      console.error("Error fetching project members:", error)
      if (!opts?.silent) {
        setMembersError("Failed to load project members.")
      }
      throw error
    } finally {
      if (!opts?.silent) {
        setMembersLoading(false)
      }
    }
  }, [projectId])

  const leaveProject = useCallback(async () => {
    if (!projectId) throw new Error("Missing project id")
    return await post<{ project_id: string }, { message?: string; error?: string }>(
      "/api/project/member/leave/",
      { project_id: projectId },
    )
  }, [projectId])

  // Use centralized polling hook
  usePolling(refetchProjectMembers, {
    pollIntervalMs: enabled ? pollIntervalMs : undefined,
    enabled,
    pauseOnHidden: refetchOnFocus, // If refetchOnFocus is true, pause on hidden (usePolling handles resume)
  }, [projectId])

  return {
    projectMembers,
    membersLoading,
    membersError,
    leaveProject,
    refetchProjectMembers,
    setProjectMembers,
  }
}


