import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, ClipboardCheck, Trophy } from "lucide-react";
import { TaskStatusPieChart } from "./TaskStatusPieChart";
import { BurnDownChart } from "./BurnDownChart";
import type { DashboardData } from "@/hook/useDashboard";

type DashboardModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string | null;
  dashboardData: DashboardData | null;
  loading: boolean;
};

// Mock achievement data
const mockAchievements = [
  "Last-minute Best friend",
  "Zombie of the group",
];

export const DashboardModal: React.FC<DashboardModalProps> = ({
  open,
  onOpenChange,
  dashboardData,
  loading,
}) => {
  if (loading || !dashboardData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          variant="normal"
          showCloseButton
          className="!w-[66.666vw] !min-w-[320px] !max-w-[95vw] h-[80vh] min-h-[420px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col font-baloo2"
        >
          <div className="flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden bg-offWhite/90">
            <DialogTitle className="sr-only">Dashboard</DialogTitle>
            <div className="flex items-center justify-center h-full">
              <div className="text-darkBrown font-baloo2">Loading dashboard...</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { taskStatusCounts, burnDownData, projectDetails } = dashboardData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="normal"
        showCloseButton
        className="!w-[66.666vw] !min-w-[320px] !max-w-[95vw] h-[80vh] min-h-[420px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col font-baloo2"
      >
        <div className="flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden bg-offWhite/90">
          <DialogTitle className="sr-only">Dashboard</DialogTitle>
          <div className="flex items-center justify-between px-6 py-4 border-b border-darkBrown/10 shrink-0">
            <h2 className="text-2xl font-bold text-darkBrown font-baloo2">Dash Board</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 flex-1 min-h-0 overflow-hidden">
            {/* Left Panel */}
            <div className="flex flex-col min-h-0 overflow-hidden border-r border-darkBrown/10">
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-3">
                  {/* Dash Board Section */}
                  <div >
                    <h3 className="text-xl font-medium text-darkBrown mb-4 font-baloo2">
                      Dash Board
                    </h3>
                    <TaskStatusPieChart taskStatusCounts={taskStatusCounts} />
                  </div>

                  {/* Project's Detail Section */}
                  <div>
                    <h3 className="text-xl font-medium text-darkBrown mb-4 font-baloo2">
                      Project's Detail
                    </h3>
                    <div className="space-y-4">
                      {/* Deadline Box */}
                      <div className="flex items-start gap-3 p-4 bg-cream rounded-lg border-2 border-lightBrown">
                        <Calendar className="w-6 h-6 text-orange flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="text-sm text-darkBrown/70 font-baloo2 mb-1">
                            Deadline
                          </div>
                          <div className="flex items-end gap-2 ">
                            <div className="text-base font-bold text-darkBrown font-baloo2">
                              {projectDetails.deadline || "-"}
                            </div>
                            {projectDetails.daysLeft !== null && (
                              <div className="text-sm text-red font-baloo2 mt-1">
                                ({projectDetails.daysLeft} Days left)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Estimate Finish Time Box */}
                      <div className="flex items-start gap-3 p-4 bg-cream rounded-lg border-2 border-lightBrown">
                        <Clock className="w-6 h-6 text-orange flex-shrink-0 mt-1" />
                        <div className="flex-1">
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

                      {/* Tasks Box */}
                      <div className="flex items-start gap-3 p-4 bg-cream rounded-lg border-2 border-lightBrown">
                        <ClipboardCheck className="w-6 h-6 text-orange flex-shrink-0 mt-1" />
                        <div className="flex-1">
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
              </ScrollArea>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col min-h-0 overflow-hidden md:col-span-2">
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Achievement Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-6 h-6 text-orange" />
                      <h3 className="text-xl font-medium text-darkBrown font-baloo2">
                        Achievement
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mockAchievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 bg-lightOrange rounded-lg text-white font-baloo2 text-sm font-medium"
                        >
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Burn Down Chart */}
                  <div>
                    <BurnDownChart 
                      burnDownData={burnDownData} 
                      totalTasks={projectDetails.totalTasks}
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

