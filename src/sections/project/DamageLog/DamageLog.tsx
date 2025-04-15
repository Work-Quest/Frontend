"use client"

import React, { useEffect, useState } from "react";
import Header from "../Header";
import DamageLogItem from "./DamageLogItem";
import { Button } from "@/components/ui/button";
import { DamageLogProps } from "./types";

const DamageLog: React.FC<DamageLogProps> = ({ logs = [] }) => {
  const [showCount, setShowCount] = useState(3);

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
      {logs.length > 0 ? (
        logs.slice(0, showCount).map((log) => <DamageLogItem key={log.id} log={log} />)
      ) : (
        <p className="self-stretch px-6 py-4 text-center text-darkBrown">
          No damage logs yet
        </p>
      )}
      <Button variant="shadow" className="!bg-orange m-2">
        See More
      </Button>
    </div>
  );
};

export default DamageLog;
