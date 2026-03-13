import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { get, post } from "@/Api"
import type {
  BossAttackRequest,
  BossAttackResponse,
  BossData,
  BossStatusResponse,
  GameStatusResponse,
  MessageResponse,
  PlayerAttackRequest,
  PlayerAttackResponse,
  PlayerHealRequest,
  PlayerHealResponse,
  PlayerSupportRequest,
  PlayerSupportResponse,
  ProjectMemberItemsResponse,
  ProjectMemberStatusEffectsResponse,
  ReviveRequest,
  UseProjectMemberItemRequest,
  UseProjectMemberItemResponse,
  UserStatusesResponse,
} from "@/types/GameApi"

type UseGameState = {
  loading: boolean
  error: string | null
}

export type UseGameOptions = {
  /**
   * If set, will continuously refetch game status while the component is mounted.
   * This is "long polling" style (request -> wait -> request) to avoid overlaps.
   */
  pollIntervalMs?: number
  /**
   * Enable/disable polling (default: true)
   */
  enabled?: boolean
}

export function useGame(explicitProjectId?: string, options?: UseGameOptions) {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>()
  const projectId = useMemo(
    () => explicitProjectId ?? routeProjectId ?? null,
    [explicitProjectId, routeProjectId]
  )

  const [state, setState] = useState<UseGameState>({
    loading: false,
    error: null,
  })

  const [gameStatus, setGameStatus] = useState<GameStatusResponse | null>(null)

  const pollIntervalMs = options?.pollIntervalMs
  const enabled = options?.enabled ?? true

  const call = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setState({ loading: true, error: null })
    try {
      return await fn()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Game request failed"
      setState({ loading: false, error: message })
      throw err
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  // -----------------
  // Boss
  // -----------------

  const getProjectBoss = useCallback(async (projectId: string) => {
    return call(() =>
      get<BossData>(`/api/game/project/${projectId}/boss/`)
    )
  }, [call])

  const getBossStatus = useCallback(async (projectId: string) => {
    return call(() =>
      get<BossStatusResponse>(
        `/api/game/project/${projectId}/boss/status/`
      )
    )
  }, [call])

  const bossAttack = useCallback(
    async (projectId: string, payload: BossAttackRequest) => {
      return call(() =>
        post<BossAttackRequest, BossAttackResponse>(
          `/api/game/project/${projectId}/boss/attack/`,
          payload
        )
      )
    },
    [call]
  )

  const setupSpecialBoss = useCallback(async (projectId: string) => {
    return call(() =>
      post<{}, { message: string; boss: BossData }>(
        `/api/game/project/${projectId}/boss/setup/special/`,
        {}
      )
    )
  }, [call])

  // -----------------
  // Project member actions
  // -----------------

  const playerAttack = useCallback(
    async (projectId: string, payload: PlayerAttackRequest) => {
      return call(() =>
        post<PlayerAttackRequest, PlayerAttackResponse>(
          `/api/game/project/${projectId}/project_member/attack/`,
          payload
        )
      )
    },
    [call]
  )

  const playerHeal = useCallback(
    async (projectId: string, payload: PlayerHealRequest) => {
      return call(() =>
        post<PlayerHealRequest, PlayerHealResponse>(
          `/api/game/project/${projectId}/project_member/heal/`,
          payload
        )
      )
    },
    [call]
  )

  const playerSupport = useCallback(
    async (projectId: string, payload: PlayerSupportRequest) => {
      return call(() =>
        post<PlayerSupportRequest, PlayerSupportResponse>(
          `/api/game/project/${projectId}/project_member/support/`,
          payload
        )
      )
    },
    [call]
  )

  const revivePlayer = useCallback(
    async (projectId: string, payload: ReviveRequest) => {
      return call(() =>
        post<ReviveRequest, MessageResponse>(
          `/api/game/project/${projectId}/project_member/revive/`,
          payload
        )
      )
    },
    [call]
  )

  // -----------------
  // Status
  // -----------------

  const getUserStatuses = useCallback(async (projectId: string) => {
    return call(() =>
      get<UserStatusesResponse>(
        `/api/game/project/${projectId}/project_member/get_all_status/`
      )
    )
  }, [call])

  const getGameStatus = useCallback(async (projectId: string) => {
    return call(() =>
      get<GameStatusResponse>(`/api/game/project/${projectId}/status/`)
    )
  }, [call])

  const refreshGameStatus = useCallback(async (opts?: { silent?: boolean }) => {
    if (!projectId) return null
    if (!opts?.silent) {
      // Could add loading state here if needed
    }
    try {
      const data = await getGameStatus(projectId)
      setGameStatus(data)
      return data
    } catch (error) {
      if (!opts?.silent) {
        console.error("Error fetching game status:", error)
      }
      throw error
    }
  }, [projectId, getGameStatus])

  useEffect(() => {
    if (!projectId) return
    void refreshGameStatus()
  }, [projectId, refreshGameStatus])

  // Long-poll loop for game status: request -> wait -> request (no overlap).
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
          await refreshGameStatus({ silent: true })
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
  }, [projectId, enabled, pollIntervalMs, refreshGameStatus])

  // -----------------
  // Items / effects
  // -----------------

  const getMyItems = useCallback(async (projectId: string) => {
    return call(() =>
      get<ProjectMemberItemsResponse>(
        `/api/game/project/${projectId}/project_member/item/`
      )
    )
  }, [call])

  const useMyItem = useCallback(
    async (projectId: string, payload: UseProjectMemberItemRequest) => {
      return call(() =>
        post<UseProjectMemberItemRequest, UseProjectMemberItemResponse>(
          `/api/game/project/${projectId}/project_member/item/use/`,
          payload
        )
      )
    },
    [call]
  )

  const getMyStatusEffects = useCallback(async (projectId: string) => {
    return call(() =>
      get<ProjectMemberStatusEffectsResponse>(
        `/api/game/project/${projectId}/project_member/status/effect/`
      )
    )
  }, [call])

  return {
    loading: state.loading,
    error: state.error,

    // boss
    gameStatus,
    refreshGameStatus,
    getProjectBoss,
    getBossStatus,
    bossAttack,
    setupSpecialBoss,

    // player actions
    playerAttack,
    playerHeal,
    playerSupport,
    revivePlayer,

    // status
    getUserStatuses,
    getGameStatus,

    // items / effects
    getMyItems,
    useMyItem,
    getMyStatusEffects,
  }
}

export default useGame


