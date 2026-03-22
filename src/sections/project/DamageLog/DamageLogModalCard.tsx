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
    <div className="flex flex-col gap-2 rounded-lg border border-darkBrown/5 bg-white/60 p-4 font-baloo2">
      <div className="flex w-full items-baseline justify-between gap-2">
        <div className="min-w-0 flex-1 text-base font-bold text-darkBrown">
          {log.action}
        </div>
        <div
          className={`shrink-0 text-right text-2xl font-bold ${
            isPositive ? "text-green" : "text-red"
          }`}
        >
          {isPositive ? "+" : ""}
          {log.damageValue.toLocaleString()}
        </div>
      </div>
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {log.participants.map((participant, index) => (
            <span
              key={`${log.id}-${index}`}
              className="tag tag-name rounded-full px-2 py-0.5 font-baloo2 text-xs"
            >
              {participant}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-sm text-darkBrown/70">{timeAgo}</span>
      </div>
      {log.comment && (
        <div
          className={`text-sm font-medium ${
            isPositive ? "text-green" : "text-red"
          }`}
        >
          {log.comment}
        </div>
      )}
    </div>
  );
};

export default DamageLogModalCard;

