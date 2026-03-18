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
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="text-2xl font-bold text-darkBrown mb-4">
          Team Scores
        </DialogTitle>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4">
            {sortedMembers.length === 0 ? (
              <div className="text-center text-darkBrown/60 py-8">
                No member scores available
              </div>
            ) : (
              sortedMembers.map((member, index) => (
                <div
                  key={member.project_member_id}
                  className="flex items-center justify-between p-4 bg-cream rounded-lg border-2 border-lightBrown"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-darkBrown">{member.username}</div>
                      <div className="text-sm text-darkBrown/60">
                        {member.status === "Alive" ? "Alive" : "Dead"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
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
      </DialogContent>
    </Dialog>
  );
};

export default MemberScoresModal;



