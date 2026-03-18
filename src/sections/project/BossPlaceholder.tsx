import React from "react";
import ProjectBattle from "./ProjectBattle";
import { GameActionPayload } from "@/types/battleTypes";


interface BossPlaceholderProps {
  isVisible: boolean;
  projectMembers: any;
  payloadBatch: GameActionPayload[];
  payloadBatchNonce: number;
  bossRefreshNonce: number;
  bossUpdate: { hp: number; maxHp: number };
  bossUpdateNonce: number;
}

const BossPlaceholder: React.FC<BossPlaceholderProps> = ({
  isVisible,
  projectMembers,
  payloadBatch,
  payloadBatchNonce,
  bossRefreshNonce,
  bossUpdate,
  bossUpdateNonce,
}) => (
  <div
    className={`overflow-hidden transition-all duration-500 ease-in-out ${
      isVisible ? "h-82" : "h-10"
    }`}
  >
    <ProjectBattle
      projectMembers={projectMembers ?? []}
      payloadBatch={payloadBatch}
      payloadBatchNonce={payloadBatchNonce}
      bossRefreshNonce={bossRefreshNonce}
      bossUpdate={bossUpdate}
      bossUpdateNonce={bossUpdateNonce}
    />
  </div>
);

export default BossPlaceholder;
