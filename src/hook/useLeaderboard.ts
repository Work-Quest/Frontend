import { useState, useEffect, useCallback } from 'react';
import { get } from '@/Api';
import type { UserScore } from '@/sections/project-end/User';

type UseLeaderboardState = {
  leaderboard: UserScore[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useLeaderboard(): UseLeaderboardState {
  const [state, setState] = useState<UseLeaderboardState>({
    leaderboard: null,
    loading: false,
    error: null,
    refetch: () => {}, // Placeholder
  });

  const fetchLeaderboard = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await get<UserScore[]>(`/api/leaderboard/`);
      setState({ leaderboard: data, loading: false, error: null, refetch: fetchLeaderboard });
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setState((prev) => ({
        ...prev,
        leaderboard: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load leaderboard",
        refetch: fetchLeaderboard,
      }));
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { ...state, refetch: fetchLeaderboard };
}


