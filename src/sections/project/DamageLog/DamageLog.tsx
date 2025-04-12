import React from "react";
import Header from "../Header";
import DamageLogItem from "./DamageLogItem";
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
    </div>
  );
};

export default DamageLog;
