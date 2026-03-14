import React, { useState } from "react";
import Header from "../Header";
import DeadlineBox from "./DeadlineBox";
import EstimateBox from "./EstimateBox";
import HpBar from "./HpBar";
import MemberScoresModal from "./MemberScoresModal";
import type { GameStatusResponse } from "@/types/GameApi";
import {Button} from "@/components/ui/button.tsx";

type ProjectDetailCardProps = {
  hpData?: {
    boss?: { current?: number; max?: number };
    player?: { current?: number; max?: number };
  };
  projectData?: {
    deadline?: string;
    daysLeft?: number;
    delayedDays?: number;
    isDelayed?: boolean;
    estimatedTime?: number;
  };
  userScore?: number;
  gameStatus?: GameStatusResponse | null;
};

const ProjectDetailCard: React.FC<ProjectDetailCardProps> = ({
  hpData = {},
  projectData = {},
  userScore = 0,
  gameStatus,
}) => {
  const [isScoresModalOpen, setIsScoresModalOpen] = useState(false);
  const bossHp = hpData?.boss?.current || 0;
  const maxBossHp = hpData?.boss?.max || 100;
  const playerHp = hpData?.player?.current || 0;
  const maxPlayerHp = hpData?.player?.max || 100;

  return (
    <div className="w-full pr-3 self-stretch bg-offWhite inline-flex flex-col justify-start items-start">
      <Header
        bgColor="bg-blue"
        textColor="!text-darkBlue2"
        text="Project's Detail"
      />

      <div className="self-stretch border-b-[3px] border-lightBrown border-dashed inline-flex justify-start items-end flex-wrap content-end">
        <div className="flex-1 inline-flex flex-col justify-start items-start">
          <div className="self-stretch px-3 sm:px-4 py-2 inline-flex justify-start items-center gap-2">
            <div className="flex-1 flex flex-col sm:flex-row justify-start items-start gap-2 sm:gap-4">
              <DeadlineBox projectData={projectData} />
              <EstimateBox estimatedTime={projectData?.estimatedTime} />
            </div>
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-end flex-wrap content-end">
        <div className="flex-1 inline-flex flex-col justify-start items-start">
          <div className="self-stretch px-4 sm:px-6 py-4 flex flex-col justify-center items-start gap-2">
            <HpBar
              label="Boss HP"
              current={bossHp}
              max={maxBossHp}
              color="orange"
            />
            <HpBar
              label="Player HP"
              current={playerHp}
              max={maxPlayerHp}
              color="green"
            />
          </div>
        </div>
      </div>

      {/* User Score Section */}
      <div className="self-stretch flex px-4 sm:px-6 pb-4 bf">
        <Button
          onClick={() => setIsScoresModalOpen(true)}
          className="w-full px-4 py-3 bg-orange rounded-lg justify-between hover:bg-cream/80 justify-between transition-colors cursor-pointer"
        >
          {/*<div className="flex gap-10  items-center ">*/}
            <span className="text-darkBrown font-bold text-sm sm:text-base">Your Score</span>
            <span className="text-orange font-bold text-lg sm:text-xl">{userScore.toLocaleString()}</span>
          {/*</div>*/}
        </Button>
      </div>

      <MemberScoresModal
        open={isScoresModalOpen}
        onOpenChange={setIsScoresModalOpen}
        gameStatus={gameStatus}
      />
    </div>
  );
};

export default ProjectDetailCard;
