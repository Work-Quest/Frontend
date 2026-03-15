import { useCallback, useEffect, useRef, useState } from "react"
import { get } from "@/Api"

export interface OverallAchievementsResponse {
  achievement_ids: string[]
}

export function useAchievements() {
  const [achievementIds, setAchievementIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchedRef = useRef(false)

  const fetchAchievements = useCallback(async (force = false) => {
    if (!force && fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)
    setError(null)
    try {
      const data = await get<OverallAchievementsResponse>("/api/me/achievements/")
      setAchievementIds(data.achievement_ids ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch achievements")
      setAchievementIds([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAchievements()
  }, [fetchAchievements])

  return {
    achievementIds,
    loading,
    error,
    refetch: useCallback(() => fetchAchievements(true), [fetchAchievements]),
  }
}
