import { useState, useEffect, useCallback } from 'react';
import { get } from '@/Api';

export type UserProfileStats = {
  highest_score: number;
  project_count: number;
  total_bosses_defeated: number;
};

type UseUserProfileStatsState = {
  stats: UserProfileStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useUserProfileStats(userId?: string): UseUserProfileStatsState {
  const [state, setState] = useState<UseUserProfileStatsState>({
    stats: null,
    loading: false,
    error: null,
    refetch: () => {}, // Placeholder
  });

  const fetchStats = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const url = userId 
        ? `/api/user/profile-stats/?user_id=${encodeURIComponent(userId)}`
        : `/api/user/profile-stats/`;
      const data = await get<UserProfileStats>(url);
      setState({ stats: data, loading: false, error: null, refetch: fetchStats });
    } catch (err) {
      console.error("Failed to fetch user profile stats:", err);
      setState((prev) => ({
        ...prev,
        stats: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load profile stats",
        refetch: fetchStats,
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { ...state, refetch: fetchStats };
}

