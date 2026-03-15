import { useState, useEffect, useCallback } from "react";
import { get } from "@/Api";
import type { UserScore } from "@/sections/project-end/User";
import { Boss1 } from "@/types/Boss";

export type ProjectEndSummary = {
  users: UserScore[];
  boss: Boss1[]; // TODO: change type after replace all boss mock data
  boss_count: number;
  reduction_percent: number;
  // delayDays?: number;
};

export function useProjectEndSummary(projectId?: string) {
  const [summary, setSummary] = useState<ProjectEndSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await get<ProjectEndSummary>(
        `/api/project/${projectId}/end-summary/`
      );
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project end summary");
      console.error("Error fetching project end summary:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}


