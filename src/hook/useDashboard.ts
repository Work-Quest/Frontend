import { useState, useEffect, useCallback } from "react";
import { get } from "@/Api";
import { getAxiosApiMessage } from "@/lib/apiError";

export type DashboardData = {
  taskStatusCounts: {
    backlog: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  burnDownData: Array<{
    date: string;
    remainingTasks: number;
  }>;
  projectDetails: {
    deadline: string | null;
    daysLeft: number | null;
    estimatedFinishTime: number | null;
    totalTasks: number;
    completedTasks: number;
  };
  achievementIds: string[];
};

type UseDashboardState = {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
};

function withAchievementIds(data: DashboardData): DashboardData {
  return {
    ...data,
    achievementIds: Array.isArray(data.achievementIds) ? data.achievementIds : [],
  };
}

/**
 * When `enabled` is false (e.g. dashboard modal closed), no request runs.
 * Open the modal with `enabled={true}` so the dashboard loads on demand with current auth.
 */
export function useDashboard(projectId?: string, enabled = true) {
  const [state, setState] = useState<UseDashboardState>({
    dashboardData: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    setState({ dashboardData: null, loading: false, error: null });
  }, [projectId]);

  const fetchDashboard = useCallback(async () => {
    if (!projectId) {
      setState({
        dashboardData: null,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await get<DashboardData>(
        `/api/project/${projectId}/dashboard/`,
        true
      );
      setState({
        dashboardData: withAchievementIds(data),
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      const apiMsg = getAxiosApiMessage(err);
      setState({
        dashboardData: null,
        loading: false,
        error:
          apiMsg ??
          (err instanceof Error ? err.message : "Failed to load dashboard data"),
      });
    }
  }, [projectId]);

  useEffect(() => {
    if (!enabled) return;
    fetchDashboard();
  }, [enabled, fetchDashboard]);

  const awaitingFirstLoad =
    enabled &&
    !!projectId &&
    state.dashboardData == null &&
    state.error == null;

  return {
    ...state,
    loading: state.loading || awaitingFirstLoad,
    refetch: fetchDashboard,
  };
}



