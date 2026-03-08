"use client"

import React, { useEffect, useState } from "react";
import Header from "../Header";
import DamageLogItem from "./DamageLogItem";
import { Button } from "@/components/ui/button";
import { DamageLogProps } from "./types";

const DamageLog: React.FC<DamageLogProps> = ({ logs = [] }) => {
  const [showCount, setShowCount] = useState(3);
  const damageLogs = logs.map((log) => {
  const p = log.payload as any
  const taskName = p?.task?.task_name as string | undefined
  const actorName = p?.actor?.username as string | undefined

  if (log.event_type === "BOSS_ATTACK"){
    const targetName = p?.target?.username as string | undefined
    const damage = typeof p?.damage === "number" ? (p.damage as number) : 0
    return {
      id: log.id,
      action: taskName ?? log.event_type,
      timestamp: log.created_at,
      damageValue: -(damage),
      participants: [targetName].filter(Boolean) as string[],
  }
  }

  return {
    id: log.id,
    action: taskName ?? log.event_type,
    timestamp: log.created_at,
    damageValue: typeof p?.damage === "number" ? (p.damage as number) : 0,
    participants: [actorName].filter(Boolean) as string[],
  }
})


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1920) {
        setShowCount(4);
      } else {
        setShowCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full pr-3 self-stretch bg-offWhite inline-flex flex-col justify-start items-start">
      <Header bgColor="bg-orange" textColor="text-offWhite" text="Damage Log" />
      {damageLogs.length > 0 ? (
        damageLogs.slice(0, showCount).map((log) => <DamageLogItem key={log.id} log={log} />)
      ) : (
        <p className="self-stretch px-6 py-4 text-center text-darkBrown">
          No damage logs yet
        </p>
      )}
      <Button variant="shadow" className="!bg-orange mr-4 w-full my-4">
        See More
      </Button>
    </div>
  );
};

export default DamageLog;
