"use client"

import { useCallback, useEffect, useState } from "react"
import { get, post } from "@/Api"
import type { UserStatus } from "@/types/User"

type UseProjectMembersOptions = {
  /**
   * Polling interval in ms. Set to 0 to disable polling.
   * Default: 5000
   */
  pollIntervalMs?: number
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

  const pollIntervalMs = options.pollIntervalMs ?? 5000
  const refetchOnFocus = options.refetchOnFocus ?? true

  const refetchProjectMembers = useCallback(async () => {
    if (!projectId) return
    try {
      setMembersLoading(true)
      setMembersError(null)
      const members = await get<UserStatus[]>(`/api/project/${projectId}/members/`)
      setProjectMembers(members)
    } catch (error) {
      console.error("Error fetching project members:", error)
      setMembersError("Failed to load project members.")
    } finally {
      setMembersLoading(false)
    }
  }, [projectId])

  const leaveProject = useCallback(async () => {
    if (!projectId) throw new Error("Missing project id")
    return await post<{ project_id: string }, { message?: string; error?: string }>(
      "/api/project/member/leave/",
      { project_id: projectId },
    )
  }, [projectId])

  // Keep project members fresh ("realtime" via polling + refetch on focus).
  useEffect(() => {
    if (!projectId) return

    let cancelled = false
    let inFlight = false
    let intervalId: number | undefined

    const refetchMembers = async () => {
      if (inFlight) return
      inFlight = true
      try {
        const members = await get<UserStatus[]>(`/api/project/${projectId}/members/`)
        if (!cancelled) setProjectMembers(members)
      } catch (error) {
        // Best-effort; keep last known members.
        console.error("Error fetching project members:", error)
      } finally {
        inFlight = false
      }
    }

    // Initial + polling.
    refetchMembers()
    if (pollIntervalMs > 0) {
      intervalId = window.setInterval(refetchMembers, pollIntervalMs)
    }

    // Refetch immediately when the user comes back to the tab.
    const onVisibility = () => {
      if (!refetchOnFocus) return
      if (document.visibilityState === "visible") refetchMembers()
    }
    const onFocus = () => {
      if (!refetchOnFocus) return
      refetchMembers()
    }

    if (refetchOnFocus) {
      document.addEventListener("visibilitychange", onVisibility)
      window.addEventListener("focus", onFocus)
    }

    return () => {
      cancelled = true
      if (intervalId !== undefined) window.clearInterval(intervalId)
      if (refetchOnFocus) {
        document.removeEventListener("visibilitychange", onVisibility)
        window.removeEventListener("focus", onFocus)
      }
    }
  }, [projectId, pollIntervalMs, refetchOnFocus])

  return {
    projectMembers,
    membersLoading,
    membersError,
    leaveProject,
    refetchProjectMembers,
    setProjectMembers,
  }
}


