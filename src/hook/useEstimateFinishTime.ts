import { useState, useEffect, useCallback } from "react";
import { get } from "@/Api";

export function useEstimateFinishTime(projectId?: string) {
  const [estimatedDays, setEstimatedDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstimate = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await get<{ estimatedDays: number | null }>(
        `/api/project/${projectId}/estimate-finish-time/`
      );
      setEstimatedDays(data.estimatedDays);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch estimate finish time");
      console.error("Error fetching estimate finish time:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEstimate();
  }, [fetchEstimate]);

  return { estimatedDays, loading, error, refetch: fetchEstimate };
}



