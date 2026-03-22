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
import type { ProjectLogEntry } from "@/types/LogApi";
import { DamageLogEntry, DamageLogPayload, DamageLogProps } from "./types";

function usernameMatches(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Group logs that share event + task + same clock second (e.g. multi-assignee attacks). */
function mergeGroupKey(log: ProjectLogEntry): string {
  const p = log.payload as DamageLogPayload;
  const taskId =
    p?.task_id != null && String(p.task_id).length > 0
      ? String(p.task_id)
      : p?.task && typeof (p.task as { task_id?: string }).task_id === "string"
        ? String((p.task as { task_id: string }).task_id)
        : "";
  const sec = Math.floor(new Date(log.created_at).getTime() / 1000);
  if (!taskId) {
    return log.id;
  }
  return `${log.event_type}|${taskId}|${sec}`;
}

function mergeDamageLogEntries(entries: DamageLogEntry[]): DamageLogEntry {
  if (entries.length === 1) return entries[0];
  const byTimeDesc = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const seen = new Set<string>();
  const participants: string[] = [];
  for (const e of byTimeDesc) {
    for (const name of e.participants) {
      const k = name.trim().toLowerCase();
      if (!k || seen.has(k)) continue;
      seen.add(k);
      participants.push(name);
    }
  }
  const damageValue = entries.reduce((sum, e) => sum + e.damageValue, 0);
  const comments = entries.map((e) => e.comment).filter(Boolean) as string[];
  const comment =
    comments.length === 0
      ? undefined
      : [...new Set(comments)].join(" · ");

  return {
    id: byTimeDesc.map((e) => e.id).sort().join("+"),
    action: byTimeDesc[0].action,
    timestamp: byTimeDesc[0].timestamp,
    damageValue,
    participants,
    comment,
  };
}

const DamageLog: React.FC<DamageLogProps> = ({ logs = [], currentUsername }) => {
  const [showCount, setShowCount] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [personFilter, setPersonFilter] = useState<string>("only-you");


  const damageLogs = useMemo<DamageLogEntry[]>(() => {
    const rawEntries = logs.map((log) => {
      const p = log.payload as DamageLogPayload;
      const taskName = p?.task?.task_name;
      const actorName = p?.actor?.username;

      if (log.event_type === "BOSS_ATTACK") {
        const targetName = p?.target?.username;
        const damage = typeof p?.damage === "number" ? p.damage : 0;

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
        damageValue: typeof p?.damage === "number" ? p.damage : 0,
        participants: [actorName].filter(Boolean) as string[],
      };
    });

    const groups = new Map<string, DamageLogEntry[]>();
    for (let i = 0; i < logs.length; i++) {
      const key = mergeGroupKey(logs[i]);
      const list = groups.get(key);
      if (list) list.push(rawEntries[i]);
      else groups.set(key, [rawEntries[i]]);
    }

    const merged = Array.from(groups.values()).map((g) => mergeDamageLogEntries(g));
    merged.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return merged;
  }, [logs]);

  const uniqueParticipants = useMemo(() => {
    const set = new Set<string>();
    damageLogs.forEach((log) => log.participants.forEach((p) => set.add(p)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [damageLogs]);

  // 3) Filter FROM processed logs (since raw logs don't have participants)
  const filteredByPerson = useMemo(() => {
    if (personFilter === "all") return damageLogs;
    if (personFilter === "only-you") {
      const me = currentUsername?.trim();
      if (!me) return [];
      return damageLogs.filter((log) =>
        log.participants.some((p) => usernameMatches(p, me))
      );
    }
    return damageLogs.filter((log) =>
      log.participants.some((p) => usernameMatches(p, personFilter))
    );
  }, [damageLogs, personFilter, currentUsername]);


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
    <div className="w-full pr-3 self-stretch bg-offWhite inline-flex flex-col justify-start items-start font-baloo2">
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
        className="!bg-orange mr-4 w-full my-4 font-baloo2"
        onClick={() => setModalOpen(true)}
      >
        See More
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          variant="normal"
          showCloseButton={true}
          className="!w-[66.666vw] !min-w-[320px] !max-w-[95vw] h-[80vh] min-h-[420px] max-h-[90vh] p-0 gap-0 bg-[#FDF8F0] border-darkBrown/10 font-baloo2 overflow-hidden flex flex-col"
        >
          <div className="bg-[#FDF8F0] rounded-lg overflow-hidden font-baloo2 flex-1 min-h-0 flex flex-col">
            <DialogTitle className="sr-only">Damage Log</DialogTitle>
            <div className="flex items-center justify-between px-6 py-4 border-b border-darkBrown/10 shrink-0">
              <h2 className="text-2xl font-bold text-darkBrown font-baloo2">
                Damage Log
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 min-h-0">
              {/* All Damage Logs */}
              <div className="flex flex-col border-r border-darkBrown/10 min-h-0 overflow-hidden">
                <p className="px-6 py-3 text-base !font-medium text-darkBrown shrink-0 font-baloo2">
                  All Damage Logs
                </p>
                <div className="flex-1 min-h-0 overflow-hidden px-2">
                  <ScrollArea className="h-full">
                    <div className="px-4 pb-4 space-y-3">
                      {damageLogs.length === 0 ? (
                        <p className="py-6 text-center text-darkBrown/70 font-baloo2">
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
                  <p className="text-base !font-medium text-darkBrown font-baloo2">
                    Damage Logs by Person
                  </p>
                  <Select
                    value={personFilter}
                    onValueChange={setPersonFilter}
                  >
                    <SelectTrigger className="w-[150px] border-darkBrown/20 text-darkBrown bg-white/80 font-baloo2">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="font-baloo2">
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
                        <p className="py-6 text-center text-darkBrown/70 font-baloo2">
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
