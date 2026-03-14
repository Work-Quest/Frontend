"use client"

import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import DamageLogItem from "./DamageLogItem";
import DamageLogModalCard from "./DamageLogModalCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {DamageLogEntry, DamageLogProps} from "./types";

const DamageLog: React.FC<DamageLogProps> = ({ logs = [] }) => {
  const [showCount, setShowCount] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [personFilter, setPersonFilter] = useState<string>("only-you");


  const damageLogs = useMemo<DamageLogEntry[]>(() => {
    return logs.map((log) => {
      const p = log.payload as any;
      const taskName = p?.task?.task_name as string | undefined;
      const actorName = p?.actor?.username as string | undefined;

      if (log.event_type === "BOSS_ATTACK") {
        const targetName = p?.target?.username as string | undefined;
        const damage = typeof p?.damage === "number" ? (p.damage as number) : 0;

        return {
          id: log.id,
          action: taskName ?? log.event_type,
          timestamp: log.created_at,
          damageValue: -damage,
          participants: [targetName].filter(Boolean) as string[],
        };
      }

      return {
        id: log.id,
        action: taskName ?? log.event_type,
        timestamp: log.created_at,
        damageValue: typeof p?.damage === "number" ? (p.damage as number) : 0,
        participants: [actorName].filter(Boolean) as string[],
      };
    });
  }, [logs]);

  const uniqueParticipants = useMemo(() => {
    const set = new Set<string>();
    damageLogs.forEach((log) => log.participants.forEach((p) => set.add(p)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [damageLogs]);

  // 3) Filter FROM processed logs (since raw logs don't have participants)
  const filteredByPerson = useMemo(() => {
    if (personFilter === "all" || personFilter === "only-you") return damageLogs;
    return damageLogs.filter((log) =>
        log.participants.some((p) => p.toLowerCase() === personFilter.toLowerCase())
    );
  }, [damageLogs, personFilter]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1920) {
        setShowCount(3);
      } else {
        setShowCount(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full pr-3 self-stretch bg-offWhite inline-flex flex-col justify-start items-start font-['Baloo_2']">
      <Header bgColor="bg-orange" textColor="text-offWhite" text="Damage Log" />
      {damageLogs.length > 0 ? (
        damageLogs.slice(0, showCount).map((log) => <DamageLogItem key={log.id} log={log} />)
      ) : (
        <p className="self-stretch px-6 py-4 text-center text-darkBrown">
          No damage logs yet
        </p>
      )}


      <Button
        variant="shadow"
        className="!bg-orange mr-4 w-full my-4 font-['Baloo_2']"
        onClick={() => setModalOpen(true)}
      >
        See More
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          variant="normal"
          showCloseButton={true}
          className="!w-[66.666vw] !min-w-[320px] !max-w-[95vw] h-[80vh] min-h-[420px] max-h-[90vh] p-0 gap-0 bg-[#FDF8F0] border-darkBrown/10 font-['Baloo_2'] overflow-hidden flex flex-col"
        >
          <div className="bg-[#FDF8F0] rounded-lg overflow-hidden font-['Baloo_2'] flex-1 min-h-0 flex flex-col">
            <DialogTitle className="sr-only">Damage Log</DialogTitle>
            <div className="flex items-center justify-between px-6 py-4 border-b border-darkBrown/10 shrink-0">
              <h2 className="text-2xl font-bold text-darkBrown font-['Baloo_2']">
                Damage Log
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 min-h-0">
              {/* All Damage Logs */}
              <div className="flex flex-col border-r border-darkBrown/10 min-h-0 overflow-hidden">
                <p className="px-6 py-3 text-base !font-medium text-darkBrown shrink-0 font-['Baloo_2']">
                  All Damage Logs
                </p>
                <div className="flex-1 min-h-0 overflow-hidden px-2">
                  <ScrollArea className="h-full">
                    <div className="px-4 pb-4 space-y-3">
                      {damageLogs.length === 0 ? (
                        <p className="py-6 text-center text-darkBrown/70 font-['Baloo_2']">
                          No damage logs yet
                        </p>
                      ) : (
                        damageLogs.map((log) => (
                          <DamageLogModalCard key={log.id} log={log} />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Damage Logs by Person */}
              <div className="flex flex-col min-h-0 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 shrink-0 gap-2">
                  <p className="text-base !font-medium text-darkBrown font-['Baloo_2']">
                    Damage Logs by Person
                  </p>
                  <Select
                    value={personFilter}
                    onValueChange={setPersonFilter}
                  >
                    <SelectTrigger className="w-[150px] border-darkBrown/20 text-darkBrown bg-white/80 font-['Baloo_2']">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="font-['Baloo_2']">
                      <SelectItem value="only-you">Only You</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                      {uniqueParticipants.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden px-2">
                  <ScrollArea className="h-full">
                    <div className="px-4 pb-4 space-y-3">
                      {filteredByPerson.length === 0 ? (
                        <p className="py-6 text-center text-darkBrown/70 font-['Baloo_2']">
                          No logs for this filter
                        </p>
                      ) : (
                        filteredByPerson.map((log) => (
                          <DamageLogModalCard key={log.id} log={log} />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DamageLog;
