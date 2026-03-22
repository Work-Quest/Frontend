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
    <div className="inline-flex flex-col items-start gap-2 self-stretch border-b-[3px] border-dashed border-lightBrown px-6 py-4 font-baloo2">
      <div className="flex w-full items-baseline justify-between gap-2">
        <div className="min-w-0 flex-1 text-base font-bold text-darkBrown">
          {log.action}
        </div>
        <div
          className={`highlightText shrink-0 text-right ${
            log.damageValue >= 0 ? "!text-green" : "text-red"
          }`}
        >
          {log.damageValue >= 0 ? "+" : ""}
          {log.damageValue.toLocaleString()}
        </div>
      </div>
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap content-center gap-2">
          {log.participants.map((participant, index) => (
            <div key={`${log.id}-${index}`} className="tag tag-name">
              {participant}
            </div>
          ))}
        </div>
        <p className="shrink-0 text-sm text-darkBrown/80">{formatTime(log.timestamp)}</p>
      </div>
      {log.comment && (
        <p
          className={`!font-medium ${
            log.damageValue >= 0 ? "!text-green" : "!text-red"
          }`}
        >
          {log.comment}
        </p>
      )}
    </div>
  );
};

export default DamageLogItem;
