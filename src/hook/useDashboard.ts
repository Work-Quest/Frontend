import { useState, useEffect, useCallback } from "react";
import { get } from "@/Api";

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
};

type UseDashboardState = {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
};

export function useDashboard(projectId?: string) {
  const [state, setState] = useState<UseDashboardState>({
    dashboardData: null,
    loading: false,
    error: null,
  });

  const fetchDashboard = useCallback(async () => {
    if (!projectId) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const data = await get<DashboardData>(`/api/project/${projectId}/dashboard/`);
      setState({ dashboardData: data, loading: false, error: null });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setState({
        dashboardData: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load dashboard data",
      });
    }
  }, [projectId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    ...state,
    refetch: fetchDashboard,
  };
}



