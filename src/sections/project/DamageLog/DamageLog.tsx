import React from "react";
import Header from "../Header";
import DamageLogItem from "./DamageLogItem";
import { Button } from "@/components/ui/button";
import { DamageLogProps } from "./types";

const DamageLog: React.FC<DamageLogProps> = ({ logs = [] }) => {
  return (
    <div className="self-stretch bg-offWhite inline-flex flex-col justify-start items-start">
      <Header bgColor="bg-orange" textColor="text-offWhite" text="Damage Log" />
      {logs.length > 0 ? (
        logs.map((log) => <DamageLogItem key={log.id} log={log} />)
      ) : (
        <div className="self-stretch px-6 py-4 text-center text-darkBrown">
          No damage logs yet
        </div>
      )}
      <Button variant="shadow" className="!bg-orange m-2">
        See More
      </Button>
    </div>
  );
};

export default DamageLog;
