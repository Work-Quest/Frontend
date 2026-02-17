import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { get } from "@/Api"
import type { ProjectGameLogsResponse, ProjectLogEntry } from "@/types/LogApi"

type UseLogState = {
  logs: ProjectLogEntry[]
  count: number
  loading: boolean
  error: string | null
}

export type UseLogOptions = {
  /**
   * If set, will continuously refetch logs while the component is mounted.
   * This is "long polling" style (request -> wait -> request) to avoid overlaps.
   */
  pollIntervalMs?: number
  /**
   * Enable/disable polling (default: true)
   */
  enabled?: boolean
}

export function useLog(explicitProjectId?: string, options?: UseLogOptions) {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>()
  const projectId = useMemo(
    () => explicitProjectId ?? routeProjectId ?? null,
    [explicitProjectId, routeProjectId]
  )

  const pollIntervalMs = options?.pollIntervalMs
  const enabled = options?.enabled ?? true

  const [state, setState] = useState<UseLogState>({
    logs: [],
    count: 0,
    loading: false,
    error: null,
  })

  const fetchProjectGameLogs = useCallback(async (pid: string) => {
    return get<ProjectGameLogsResponse>(`/api/project/${pid}/logs/game/`)
  }, [])

  const refetch = useCallback(async (opts?: { silent?: boolean }) => {
    if (!projectId) return null
    if (!opts?.silent) {
      setState((prev) => ({ ...prev, loading: true, error: null }))
    }
    try {
      const data = await fetchProjectGameLogs(projectId)
      setState({
        logs: data.logs ?? [],
        count: typeof data.count === "number" ? data.count : (data.logs?.length ?? 0),
        loading: false,
        error: null,
      })
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load logs"
      setState((prev) => ({ ...prev, loading: false, error: message }))
      throw err
    }
  }, [fetchProjectGameLogs, projectId])

  useEffect(() => {
    if (!projectId) return
    void refetch()
  }, [projectId, refetch])

  // Long-poll loop: request -> wait -> request (no overlap).
  useEffect(() => {
    if (!projectId) return
    if (!enabled) return
    if (!pollIntervalMs || pollIntervalMs <= 0) return

    let cancelled = false
    let timer: number | null = null

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(() => resolve(), ms)
      })

    const loop = async () => {
      // Start after initial load; keep refreshing silently.
      while (!cancelled) {
        try {
          await refetch({ silent: true })
        } catch {
          // keep polling even if a request fails
        }
        await sleep(pollIntervalMs)
      }
    }

    void loop()

    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [projectId, enabled, pollIntervalMs, refetch])

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


