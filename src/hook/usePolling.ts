import { useEffect, useRef, useCallback } from "react"

export type UsePollingOptions = {
  /**
   * Polling interval in milliseconds.
   * If not set or <= 0, polling is disabled.
   */
  pollIntervalMs?: number
  /**
   * Enable/disable polling (default: true)
   */
  enabled?: boolean
  /**
   * Pause polling when tab is hidden (default: true)
   */
  pauseOnHidden?: boolean
}

type RefetchFunction = (opts?: { silent?: boolean }) => Promise<any> | any

/**
 * Generic polling hook that handles long-polling pattern with:
 * - Visibility API integration (pause when tab hidden)
 * - Request deduplication (prevent overlapping requests)
 * - Proper cleanup and cancellation
 * - Silent mode support (automatically passes { silent: true } for polling)
 * - Error handling (continues on error)
 *
 * @param refetchFn - Function to call for fetching data. Should accept optional { silent?: boolean }
 * @param options - Polling configuration options
 * @param dependencies - Array of dependencies that should trigger initial fetch (like projectId)
 */
export function usePolling(
  refetchFn: RefetchFunction,
  options: UsePollingOptions = {},
  dependencies: unknown[] = []
) {
  const {
    pollIntervalMs,
    enabled = true,
    pauseOnHidden = true,
  } = options

  const inFlightRef = useRef(false)
  const cancelledRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const isVisibleRef = useRef(!document.hidden)

  const sleep = useCallback((ms: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      timerRef.current = window.setTimeout(() => resolve(), ms)
    })
  }, [])

  const executeFetch = useCallback(async (silent: boolean) => {
    // Request deduplication: skip if already in flight
    if (inFlightRef.current) return
    if (cancelledRef.current) return

    inFlightRef.current = true
    try {
      await refetchFn({ silent })
    } catch (error) {
      // Continue polling even if request fails
      console.error("Polling fetch error:", error)
    } finally {
      inFlightRef.current = false
    }
  }, [refetchFn])

  // Initial fetch on mount or when dependencies change (not silent - shows loading bar)
  useEffect(() => {
    if (cancelledRef.current) return
    void executeFetch(false)
  }, [executeFetch, ...dependencies])

  // Long-polling loop with visibility API support
  useEffect(() => {
    if (!enabled) return
    if (!pollIntervalMs || pollIntervalMs <= 0) return

    cancelledRef.current = false
    isVisibleRef.current = !document.hidden

    const loop = async () => {
      while (!cancelledRef.current) {
        // Wait for the polling interval
        await sleep(pollIntervalMs)

        // Skip if cancelled or tab is hidden (and pauseOnHidden is true)
        if (cancelledRef.current) break
        if (pauseOnHidden && !isVisibleRef.current) {
          // Continue loop but don't fetch - will resume when visible
          continue
        }

        // Execute fetch with silent flag (no loading bar for polling)
        await executeFetch(true)
      }
    }

    void loop()

    // Visibility change handler
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden
      // If tab becomes visible and we're paused, fetch immediately (not silent)
      if (isVisibleRef.current && pauseOnHidden && !cancelledRef.current) {
        void executeFetch(false)
      }
    }

    if (pauseOnHidden) {
      document.addEventListener("visibilitychange", handleVisibilityChange)
    }

    return () => {
      cancelledRef.current = true
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (pauseOnHidden) {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    }
  }, [enabled, pollIntervalMs, pauseOnHidden, executeFetch, sleep])

  return {
    /**
     * Manually trigger a fetch (bypasses deduplication for immediate fetch)
     * @param silent - Whether to fetch silently (default: false)
     */
    refetch: useCallback(async (silent = false) => {
      inFlightRef.current = false // Reset to allow immediate fetch
      return executeFetch(silent)
    }, [executeFetch]),
  }
}

/**
 * Conditional polling hook that only polls when a condition is met.
 * This is useful when you want to start polling only after certain dependencies are available,
 * but still allow fetching even when the condition isn't met yet.
 *
 * @param refetchFn - Function to call for fetching data. Should accept optional { silent?: boolean }
 * @param condition - Function that returns true when polling should be enabled
 * @param options - Polling configuration options
 * @param dependencies - Array of dependencies that should trigger initial fetch (like projectId)
 */
export function usePollingWhen(
  refetchFn: RefetchFunction,
  condition: () => boolean,
  options: UsePollingOptions = {},
  dependencies: unknown[] = []
) {
  const {
    pollIntervalMs,
    enabled = true,
    pauseOnHidden = true,
  } = options

  const inFlightRef = useRef(false)
  const cancelledRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const isVisibleRef = useRef(!document.hidden)

  const sleep = useCallback((ms: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      timerRef.current = window.setTimeout(() => resolve(), ms)
    })
  }, [])

  const executeFetch = useCallback(async (silent: boolean) => {
    // Request deduplication: skip if already in flight
    if (inFlightRef.current) return
    if (cancelledRef.current) return

    inFlightRef.current = true
    try {
      await refetchFn({ silent })
    } catch (error) {
      // Continue polling even if request fails
      console.error("Polling fetch error:", error)
    } finally {
      inFlightRef.current = false
    }
  }, [refetchFn])

  // Initial fetch on mount or when dependencies change (not silent - shows loading bar)
  // Always try to fetch, even if condition isn't met yet
  useEffect(() => {
    if (cancelledRef.current) return
    void executeFetch(false)
  }, [executeFetch, ...dependencies])

  // Long-polling loop with visibility API support
  // Only poll when condition is met
  useEffect(() => {
    if (!enabled) return
    if (!pollIntervalMs || pollIntervalMs <= 0) return
    if (!condition()) return // Only poll when condition is met

    cancelledRef.current = false
    isVisibleRef.current = !document.hidden

    const loop = async () => {
      while (!cancelledRef.current) {
        // Wait for the polling interval
        await sleep(pollIntervalMs)

        // Skip if cancelled or tab is hidden (and pauseOnHidden is true)
        if (cancelledRef.current) break
        if (pauseOnHidden && !isVisibleRef.current) {
          // Continue loop but don't fetch - will resume when visible
          continue
        }

        // Check condition again before fetching
        if (!condition()) {
          // Condition no longer met, stop polling
          break
        }

        // Execute fetch with silent flag (no loading bar for polling)
        await executeFetch(true)
      }
    }

    void loop()

    // Visibility change handler
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden
      // If tab becomes visible and we're paused, fetch immediately (not silent)
      if (isVisibleRef.current && pauseOnHidden && !cancelledRef.current && condition()) {
        void executeFetch(false)
      }
    }

    if (pauseOnHidden) {
      document.addEventListener("visibilitychange", handleVisibilityChange)
    }

    return () => {
      cancelledRef.current = true
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (pauseOnHidden) {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    }
  }, [enabled, pollIntervalMs, pauseOnHidden, executeFetch, sleep, condition])

  return {
    /**
     * Manually trigger a fetch (bypasses deduplication for immediate fetch)
     * @param silent - Whether to fetch silently (default: false)
     */
    refetch: useCallback(async (silent = false) => {
      inFlightRef.current = false // Reset to allow immediate fetch
      return executeFetch(silent)
    }, [executeFetch]),
  }
}

