"use client"

import { useCallback, useEffect, useState } from "react"
import { get } from "@/Api"
import type { UserStatus } from "@/types/User"

export function useProjectMembers(projectId?: string) {
  const [projectMembers, setProjectMembers] = useState<UserStatus[] | null>(null)
  const [membersLoading, setMembersLoading] = useState(false)
  const [membersError, setMembersError] = useState<string | null>(null)

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

  // Keep project members fresh ("realtime" via polling + refetch on focus).
  useEffect(() => {
    if (!projectId) return

    let cancelled = false
    let intervalId: number | undefined

    const refetchMembers = async () => {
      try {
        const members = await get<UserStatus[]>(`/api/project/${projectId}/members/`)
        if (!cancelled) setProjectMembers(members)
      } catch (error) {
        // Best-effort; keep last known members.
        console.error("Error fetching project members:", error)
      }
    }

    // Initial + polling.
    refetchMembers()
    intervalId = window.setInterval(refetchMembers, 5000)

    // Refetch immediately when the user comes back to the tab.
    const onVisibility = () => {
      if (document.visibilityState === "visible") refetchMembers()
    }
    const onFocus = () => refetchMembers()

    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("focus", onFocus)

    return () => {
      cancelled = true
      if (intervalId) window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("focus", onFocus)
    }
  }, [projectId])

  return {
    projectMembers,
    membersLoading,
    membersError,
    refetchProjectMembers,
    setProjectMembers,
  }
}


