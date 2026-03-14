import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { get } from "@/Api"
import type { ProjectGameLogsResponse, ProjectLogEntry } from "@/types/LogApi"
import { usePolling } from "./usePolling"
import { POLLING_CONFIG } from "@/config/pollingConfig"

type UseLogState = {
  logs: ProjectLogEntry[]
  count: number
  loading: boolean
  error: string | null
}

export type UseLogOptions = {

  pollIntervalMs?: number
 
  enabled?: boolean
}

export function useLog(explicitProjectId?: string, options?: UseLogOptions) {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>()
  const projectId = useMemo(
    () => explicitProjectId ?? routeProjectId ?? null,
    [explicitProjectId, routeProjectId]
  )

  const pollIntervalMs = options?.pollIntervalMs ?? POLLING_CONFIG.logs.interval
  const enabled = options?.enabled ?? true

  const [state, setState] = useState<UseLogState>({
    logs: [],
    count: 0,
    loading: false,
    error: null,
  })

  // Track initial load time to filter historical logs on subsequent polls
  const initialLoadTimeRef = useRef<number | null>(null)

  const fetchProjectGameLogs = useCallback(async (pid: string, silent?: boolean, timeBegin?: string) => {
    const url = timeBegin 
      ? `/api/project/${pid}/logs/game/?time_begin=${encodeURIComponent(timeBegin)}`
      : `/api/project/${pid}/logs/game/`
    return get<ProjectGameLogsResponse>(url, silent)
  }, [])

  const refetch = useCallback(async (opts?: { silent?: boolean }) => {
    if (!projectId) return null
    
    // On initial load (not silent), record timestamp
    const isInitialLoad = !opts?.silent && initialLoadTimeRef.current === null
    if (isInitialLoad) {
      initialLoadTimeRef.current = Date.now()
    }
    
    // For subsequent polls (silent), use time_begin to only fetch new logs
    const timeBegin = opts?.silent && initialLoadTimeRef.current 
      ? new Date(initialLoadTimeRef.current).toISOString()
      : undefined
    
    if (!opts?.silent) {
      setState((prev) => ({ ...prev, loading: true, error: null }))
    }
    try {
      const data = await fetchProjectGameLogs(projectId, opts?.silent, timeBegin)
      
      // Merge new logs with existing logs (avoid duplicates by ID)
      setState((prev) => {
        if (timeBegin) {
          // Subsequent poll: merge new logs with existing
          const existingLogIds = new Set(prev.logs.map(log => log.id))
          const newLogs = (data.logs ?? []).filter(log => !existingLogIds.has(log.id))
          const mergedLogs = [...prev.logs, ...newLogs].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          return {
            logs: mergedLogs,
            count: mergedLogs.length,
            loading: false,
            error: null,
          }
        } else {
          // Initial load: replace all logs
          return {
            logs: data.logs ?? [],
            count: typeof data.count === "number" ? data.count : (data.logs?.length ?? 0),
            loading: false,
            error: null,
          }
        }
      })
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load logs"
      setState((prev) => ({ ...prev, loading: false, error: message }))
      throw err
    }
  }, [fetchProjectGameLogs, projectId])
  
  // Reset initial load time when projectId changes
  useEffect(() => {
    initialLoadTimeRef.current = null
  }, [projectId])

  // Use centralized polling hook
  usePolling(refetch, {
    pollIntervalMs: enabled ? pollIntervalMs : undefined,
    enabled,
  }, [projectId])

  return {
    projectId,
    logs: state.logs,
    count: state.count,
    loading: state.loading,
    error: state.error,
    refetch,
  }
}

export default useLog


