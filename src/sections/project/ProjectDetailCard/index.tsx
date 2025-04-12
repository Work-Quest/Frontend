import React from 'react';
import Header from '../Header';
import DeadlineBox from './DeadlineBox';
import EstimateBox from './EstimateBox';
import HpBar from './HpBar';

type ProjectDetailCardProps = {
  hpData?: {
    boss?: { current?: number; max?: number };
    player?: { current?: number; max?: number };
  };
  projectData?: {
    deadline?: string;
    daysLeft?: number;
    estimatedTime?: number;
  };
};

const ProjectDetailCard: React.FC<ProjectDetailCardProps> = ({
  hpData = {},
  projectData = {},
}) => {
  const bossHp = hpData?.boss?.current || 0;
  const maxBossHp = hpData?.boss?.max || 100;
  const playerHp = hpData?.player?.current || 0;
  const maxPlayerHp = hpData?.player?.max || 100;

  return (
    <div className="self-stretch bg-offWhite inline-flex flex-col justify-start items-start">
      <Header bgColor="bg-blue" textColor="text-darkBrown" />

      <div className="self-stretch border-b-[3px] border-lightBrown border-dashed inline-flex justify-start items-end flex-wrap content-end">
        <div className="flex-1 inline-flex flex-col justify-start items-start">
          <div className="self-stretch px-4 py-2 inline-flex justify-start items-center gap-2">
            <div className="flex-1 flex justify-start items-start gap-4">
              <DeadlineBox projectData={projectData} />
              <EstimateBox estimatedTime={projectData?.estimatedTime} />
            </div>
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-end flex-wrap content-end">
        <div className="flex-1 inline-flex flex-col justify-start items-start">
          <div className="self-stretch px-6 py-4 flex flex-col justify-center items-start gap-2">
            <HpBar label="Boss HP" current={bossHp} max={maxBossHp} color="orange" />
            <HpBar label="Player HP" current={playerHp} max={maxPlayerHp} color="green" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailCard;
