import { useState, useEffect, useCallback } from 'react';
import { get } from '@/Api';

export type DefeatedBoss = {
  id: string;
  name: string;
  type: string;
};

type UseUserDefeatedBossesState = {
  defeatedBosses: DefeatedBoss[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useUserDefeatedBosses(userId?: string): UseUserDefeatedBossesState {
  const [state, setState] = useState<UseUserDefeatedBossesState>({
    defeatedBosses: [],
    loading: false,
    error: null,
    refetch: () => {}, // Placeholder
  });

  const fetchBosses = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const url = userId 
        ? `/api/user/defeated-bosses/?user_id=${encodeURIComponent(userId)}`
        : `/api/user/defeated-bosses/`;
      const data = await get<DefeatedBoss[]>(url);
      setState({ defeatedBosses: data, loading: false, error: null, refetch: fetchBosses });
    } catch (err) {
      console.error("Failed to fetch defeated bosses:", err);
      setState((prev) => ({
        ...prev,
        defeatedBosses: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load defeated bosses",
        refetch: fetchBosses,
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchBosses();
  }, [fetchBosses]);

  return { ...state, refetch: fetchBosses };
}

