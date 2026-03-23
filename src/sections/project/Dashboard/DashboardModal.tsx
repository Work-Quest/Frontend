import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ClipboardCheck, Trophy } from "lucide-react";
import { TaskStatusPieChart } from "./TaskStatusPieChart";
import { BurnDownChart } from "./BurnDownChart";
import type { DashboardData } from "@/hook/useDashboard";
import {
  ACHIEVEMENT_IDS,
  getAchievementName,
  type AchievementId,
} from "@/lib/achievementConstants";

type DashboardModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
};

const ACHIEVEMENT_IDS_SET = new Set<string>(ACHIEVEMENT_IDS);

const dialogShellClassName =
  "w-[calc(100vw-1rem)] sm:w-[min(92vw,1200px)] max-w-[calc(100vw-1rem)] max-h-[90dvh] h-[min(90dvh,880px)] p-0 gap-0 overflow-hidden flex flex-col font-baloo2";

export const DashboardModal: React.FC<DashboardModalProps> = ({
  open,
  onOpenChange,
  dashboardData,
  loading,
  error,
  onRetry,
}) => {
  const achievementIdsSource = dashboardData?.achievementIds;
  const projectAchievements = useMemo(() => {
    const ids = Array.isArray(achievementIdsSource) ? achievementIdsSource : [];
    return ids.filter((id): id is AchievementId => ACHIEVEMENT_IDS_SET.has(id));
  }, [achievementIdsSource]);

  if (!dashboardData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent variant="normal" showCloseButton className={dialogShellClassName}>
          <div className="flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden bg-offWhite/90">
            <DialogTitle className="sr-only">Dashboard</DialogTitle>
            <div className="flex flex-col items-center justify-center gap-4 min-h-[12rem] flex-1 px-6 text-center">
              {loading ? (
                <div className="text-darkBrown font-baloo2">Loading dashboard...</div>
              ) : error ? (
                <>
                  <p className="text-darkBrown font-baloo2 text-sm max-w-md">{error}</p>
                  {onRetry ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="font-baloo2 border-lightBrown"
                      onClick={() => onRetry()}
                    >
                      Try again
                    </Button>
                  ) : null}
                </>
              ) : (
                <p className="text-darkBrown font-baloo2 text-sm">
                  Open this dialog to load the dashboard.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { taskStatusCounts, burnDownData, projectDetails } = dashboardData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="normal" showCloseButton className={dialogShellClassName}>
        <div className="flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden bg-offWhite/90">
          <DialogTitle className="sr-only">Dashboard</DialogTitle>
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-darkBrown/10 shrink-0 min-w-0 pr-14">
            <h2 className="text-xl sm:text-2xl font-bold text-darkBrown font-baloo2 truncate">
              Dash Board
            </h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-gutter:stable]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <div className="min-w-0 border-darkBrown/10 border-b lg:border-b-0 lg:border-r">
                <div className="p-4 sm:p-6 space-y-3 pb-6">
                  <div>
                    <TaskStatusPieChart taskStatusCounts={taskStatusCounts} />
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-medium text-darkBrown mb-4 font-baloo2">
                      Project's Detail
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-cream rounded-lg border-2 border-lightBrown min-w-0">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-darkBrown/70 font-baloo2 mb-1">
                            Deadline
                          </div>
                          <div className="flex flex-wrap items-end gap-2">
                            <div className="text-base font-bold text-darkBrown font-baloo2 break-words">
                              {projectDetails.deadline || "-"}
                            </div>
                            {projectDetails.daysLeft !== null && (
                              <div className="text-sm text-red font-baloo2">
                                ({projectDetails.daysLeft} Days left)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-cream rounded-lg border-2 border-lightBrown">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-darkBrown/70 font-baloo2 mb-1">
                            Estimate Finish Time
                          </div>
                          <div className="text-base font-bold text-darkBrown font-baloo2">
                            {projectDetails.estimatedFinishTime !== null
                              ? `${projectDetails.estimatedFinishTime} days`
                              : "-"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-cream rounded-lg border-2 border-lightBrown">
                        <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 text-orange shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-darkBrown/70 font-baloo2 mb-1">
                            Tasks
                          </div>
                          <div className="text-base font-bold text-darkBrown font-baloo2">
                            {projectDetails.completedTasks}/{projectDetails.totalTasks}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-w-0 lg:col-span-2">
                <div className="p-4 sm:p-6 space-y-6 pb-6">
                  <div className="border-darkBrown/10 border-b pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange shrink-0" />
                      <h3 className="text-lg sm:text-xl font-medium text-darkBrown font-baloo2">
                        Achievement
                      </h3>
                    </div>
                    {projectAchievements.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {projectAchievements.map((id) => (
                          <div
                            key={id}
                            className="px-3 sm:px-4 py-2 bg-lightOrange rounded-lg text-white font-baloo2 text-sm font-medium"
                          >
                            {getAchievementName(id)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-lightBrown font-baloo2 leading-relaxed max-w-xl">
                        No achievements unlocked for you in this project yet.
                      </p>
                    )}
                  </div>

                  <div className="min-w-0 w-full">
                    <BurnDownChart
                      burnDownData={burnDownData}
                      totalTasks={projectDetails.totalTasks}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
