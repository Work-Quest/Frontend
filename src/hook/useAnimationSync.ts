import { useEffect, useRef, useCallback } from 'react'
import type { ProjectLogEntry } from '@/types/LogApi'
import type { GameActionPayload } from '@/types/battleTypes'
import { getActionKey } from '@/utils/actionDeduplication'

type UseAnimationSyncOptions = {
  /**
   * Function to call when actions should be enqueued
   */
  onActionsReady: (actions: GameActionPayload[]) => void
  /**
   * Map of API actions that have already been processed (for deduplication)
   * Key: action key (act:taskId), Value: timestamp
   */
  apiActionsRef: React.MutableRefObject<Map<string, number>>
  /**
   * Project ID for cleanup when it changes
   */
  projectId?: string | null
}

/**
 * Hook that synchronizes animations from logs for cross-window animation sync.
 *
 * Features:
 * - Converts log entries to game actions
 * - Filters out duplicate actions (already processed from API responses)
 * - Skips historical logs on initial load
 * - Tracks processed log IDs to avoid reprocessing
 */
export function useAnimationSync(
  logs: ProjectLogEntry[] | undefined,
  options: UseAnimationSyncOptions
) {
  const { onActionsReady, apiActionsRef, projectId } = options

  // Track which log IDs have been processed to avoid reprocessing
  const processedLogIdsRef = useRef<Set<string>>(new Set())

  // Convert log entries to game actions with task_id context
  const convertLogsToActions = useCallback(
    (logEntries: ProjectLogEntry[]): Array<{ action: GameActionPayload; taskId?: string }> => {
      const actionsWithTaskId: Array<{ action: GameActionPayload; taskId?: string }> = []

      for (const log of logEntries) {
        const eventType = String(log.event_type || '').toUpperCase()
        const payload = log.payload || {}
        const taskId = payload.task_id ? String(payload.task_id) : undefined

        let action: GameActionPayload | null = null

        switch (eventType) {
          case 'USER_ATTACK': {
            const playerId = payload.player_id
              ? String(payload.player_id)
              : log.actor_id
                ? String(log.actor_id)
                : null
            if (playerId) {
              action = { act: 'ATTACK', userId: playerId }
            }
            break
          }

          case 'BOSS_ATTACK': {
            const attackedPlayerId = payload.player_id
              ? String(payload.player_id)
              : payload.target_player_id
                ? String(payload.target_player_id)
                : null
            if (attackedPlayerId) {
              action = { act: 'BOSS_ATTACK_USER', userId: attackedPlayerId }
            }
            break
          }

          case 'KILL_PLAYER': {
            const killedPlayerId = payload.receiver_id
              ? String(payload.receiver_id)
              : payload.player_id
                ? String(payload.player_id)
                : null
            if (killedPlayerId) {
              action = { act: 'DIE', userId: killedPlayerId }
            }
            break
          }

          case 'KILL_BOSS':
            action = { act: 'BOSS_DIE' }
            break

          case 'BOSS_REVIVE':
            action = { act: 'BOSS_REVIVE' }
            break

          case 'USER_REVIVE': {
            const revivedPlayerId = payload.player_id
              ? String(payload.player_id)
              : log.actor_id
                ? String(log.actor_id)
                : null
            if (revivedPlayerId) {
              action = { act: 'REVIVE', userId: revivedPlayerId }
            }
            break
          }
        }

        if (action) {
          actionsWithTaskId.push({ action, taskId })
        }
      }

      return actionsWithTaskId
    },
    []
  )

  // Clear processed logs when projectId changes
  useEffect(() => {
    processedLogIdsRef.current.clear()
  }, [projectId])

  // Process logs and sync animations
  useEffect(() => {
    if (!logs || logs.length === 0) return

    // Detect initial load: if processedLogIdsRef is empty and we have logs, this is the first load
    // Mark all historical logs as processed without animating them
    const isInitialLoad = processedLogIdsRef.current.size === 0 && logs.length > 0
    if (isInitialLoad) {
      // Mark all current logs as processed (don't animate historical events on page load)
      logs.forEach((log) => {
        processedLogIdsRef.current.add(log.id)
      })
      return // Skip processing on initial load
    }

    // Filter to only process new logs that haven't been processed yet
    const newLogs = logs.filter((log) => !processedLogIdsRef.current.has(log.id))

    if (newLogs.length === 0) return

    // Mark these logs as processed
    newLogs.forEach((log) => {
      processedLogIdsRef.current.add(log.id)
    })

    // Convert logs to actions with task_id context
    const actionsWithTaskId = convertLogsToActions(newLogs)

    // Filter out actions that match tracked API actions (deduplication)
    const now = Date.now()
    const DEDUP_WINDOW_MS = 5000 // 5 seconds
    const uniqueActions: GameActionPayload[] = []

    for (const { action, taskId } of actionsWithTaskId) {
      const key = getActionKey(action, taskId)
      const apiActionTimestamp = apiActionsRef.current.get(key)

      // Skip if this action was already processed from API response (within 5 second window)
      if (apiActionTimestamp && now - apiActionTimestamp <= DEDUP_WINDOW_MS) {
        continue // Skip duplicate action
      }

      uniqueActions.push(action)
    }

    // Enqueue only unique actions that weren't already processed from API
    if (uniqueActions.length > 0) {
      onActionsReady(uniqueActions)
    }
  }, [logs, convertLogsToActions, onActionsReady, apiActionsRef])
}
