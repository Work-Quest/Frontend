import React from "react";
import { formatDistanceToNow } from "date-fns";
import { DamageLogEntry } from "./types";

type DamageLogItemProps = {
  log: DamageLogEntry;
};

const DamageLogItem: React.FC<DamageLogItemProps> = ({ log }) => {
  const formatTime = (timestamp: string | Date) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className="self-stretch px-6 py-4 border-b-[3px] border-lightBrown border-dashed inline-flex flex-col justify-start items-start gap-2">
      <div className="self-stretch inline-flex justify-start items-center gap-2">
        <div className="flex-1 flex justify-start items-center gap-4">
          <div className="justify-start text-darkBrown text-base font-bold font-['Baloo_2']">
            {log.action}
          </div>
          <p className="justify-start text-darkBrown/80">
            {formatTime(log.timestamp)}
          </p>
        </div>
        <div
          className={`highlightText w-28 text-right justify-start ${
            log.damageValue >= 0 ? "!text-green" : "text-red"
          }`}
        >
          {log.damageValue >= 0 ? "+" : ""}
          {log.damageValue.toLocaleString()}
        </div>
      </div>
      <div className="self-stretch inline-flex justify-between items-end">
        <div className="flex-1 flex justify-start items-center gap-2 flex-wrap content-center">
          {log.participants.map((participant, index) => (
            <div key={`${log.id}-${index}`} className="tag tag-name">
              {participant}
            </div>
          ))}
        </div>
        {log.comment && (
          <p
            className={`justify-start !font-medium ${
              log.damageValue >= 0 ? "!text-green" : "!text-red"
            }`}
          >
            {log.comment}
          </p>
        )}
      </div>
    </div>
  );
};

export default DamageLogItem;
