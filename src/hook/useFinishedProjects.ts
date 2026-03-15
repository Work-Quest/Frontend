import { useState, useEffect, useCallback } from 'react';
import { get } from '@/Api';
import type { FinishedProjectSummary } from '@/types/Project';

type UseFinishedProjectsState = {
  finishedProjects: FinishedProjectSummary[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useFinishedProjects(userId?: string): UseFinishedProjectsState {
  const [state, setState] = useState<UseFinishedProjectsState>({
    finishedProjects: null,
    loading: false,
    error: null,
    refetch: () => {}, // Placeholder
  });

  const fetchFinishedProjects = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const url = userId 
        ? `/api/user/finished-projects/?user_id=${encodeURIComponent(userId)}`
        : `/api/user/finished-projects/`;
      const data = await get<FinishedProjectSummary[]>(url);
      setState({ finishedProjects: data, loading: false, error: null, refetch: fetchFinishedProjects });
    } catch (err) {
      console.error("Failed to fetch finished projects:", err);
      setState((prev) => ({
        ...prev,
        finishedProjects: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load finished projects",
        refetch: fetchFinishedProjects,
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchFinishedProjects();
  }, [fetchFinishedProjects]);

  return { ...state, refetch: fetchFinishedProjects };
}

