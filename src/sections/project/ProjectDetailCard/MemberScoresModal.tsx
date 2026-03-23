import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GameStatusResponse } from "@/types/GameApi";

type MemberScoresModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameStatus?: GameStatusResponse | null;
};

const MemberScoresModal: React.FC<MemberScoresModalProps> = ({
  open,
  onOpenChange,
  gameStatus,
}) => {
  // Sort members by score (descending)
  const sortedMembers = useMemo(() => {
    if (!gameStatus?.user_statuses) return [];
    return [...gameStatus.user_statuses].sort((a, b) => b.score - a.score);
  }, [gameStatus?.user_statuses]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="normal"
        showCloseButton
        className="!w-[calc(100vw-2rem)] !max-w-[500px] max-h-[min(90dvh,720px)] p-0 gap-0 overflow-hidden flex flex-col font-baloo2"
      >
        <div className="flex min-h-0 max-h-[min(90dvh,720px)] flex-1 flex-col rounded-lg bg-offWhite/90">
          <DialogTitle className="shrink-0 border-b border-darkBrown/10 px-6 py-4 pr-14 text-2xl font-bold text-darkBrown font-baloo2">
            Team Scores
          </DialogTitle>
          <div className="min-h-0 flex-1 overflow-hidden px-2">
            <ScrollArea
              type="always"
              className="h-[min(55dvh,420px)] w-full sm:h-[min(60dvh,480px)]"
            >
              <div className="space-y-3 px-4 py-4 pb-6">
                {sortedMembers.length === 0 ? (
                  <div className="py-8 text-center text-darkBrown/60 font-baloo2">
                    No member scores available
                  </div>
                ) : (
                  sortedMembers.map((member, index) => (
                    <div
                      key={member.project_member_id}
                      className="flex items-center justify-between rounded-lg border-2 border-lightBrown bg-cream p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-bold text-darkBrown">
                            {member.username}
                          </div>
                          <div className="text-sm text-darkBrown/60">
                            {member.status === "Alive" ? "Alive" : "Dead"}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 text-right pl-2">
                        <div className="text-xl font-bold text-orange">
                          {member.score.toLocaleString()}
                        </div>
                        <div className="text-xs text-darkBrown/60">points</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberScoresModal;



