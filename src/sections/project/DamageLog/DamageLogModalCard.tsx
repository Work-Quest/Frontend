import React from "react";
import { formatDistanceToNow } from "date-fns";
import { DamageLogEntry } from "./types";

type DamageLogModalCardProps = {
  log: DamageLogEntry;
};

const DamageLogModalCard: React.FC<DamageLogModalCardProps> = ({ log }) => {
  const timeAgo = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
  const isPositive = log.damageValue >= 0;

  return (
    <div className="rounded-lg bg-white/60 border border-darkBrown/5 p-4 flex items-start justify-between gap-2 font-['Baloo_2']">
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-darkBrown text-base">
            {log.action}
          </span>
          <span className="text-darkBrown/70 text-sm shrink-0">{timeAgo}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {log.participants.map((participant, index) => (
            <span
              key={`${log.id}-${index}`}
              className="tag tag-name text-xs px-2 py-0.5 rounded-full font-['Baloo_2']"
            >
              {participant}
            </span>
          ))}
        </div>
      </div>
      <div
        className={`text-right shrink-0 ${
          isPositive ? "text-green" : "text-red"
        }`}
      >
        <div className="font-bold text-2xl">
          {isPositive ? "+" : ""}
          {log.damageValue.toLocaleString()}
        </div>
        {log.comment && (
          <div className="text-sm font-medium mt-0.5">
            {log.comment}
          </div>
        )}
      </div>
    </div>
  );
};

export default DamageLogModalCard;

