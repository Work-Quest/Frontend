"use client"

import React, { useEffect, useState } from "react";
import { HP_DATA, PROJECT_DATA } from "@/sections/project/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToggleButton from "@/components/ToggleButton";
import ProjectDetailCard from "@/sections/project/ProjectDetailCard/ProjectDetailCard";
import DamageLog from "@/sections/project/DamageLog/DamageLog";
import ReviewTask from "@/sections/project/ReviewTask";
import { KanbanBoard } from "@/sections/project/KanbanBoard/KanbanBoard";
import { useKanbanBoard } from "@/sections/project/KanbanBoard/useKanbanBoard";
import { useTask } from "@/hook/useTask";
import { useProjectMembers } from "@/hook/useProjectMembers";
import ProjectBattle from "@/sections/project/ProjectBattle";
import { useParams } from "react-router-dom";
import { useGame } from "@/hook/useGame";
import toast from "react-hot-toast";
import type { GameActionPayload } from "@/types/battleTypes";
import useLog from "@/hook/useLog";
import { useAuth } from "@/context/AuthContext";
import { useOverdueBossAttack } from "@/hook/useOverdueBossAttack";

const ProjectPage: React.FC = () => {
  const [showBossPlaceholder, setShowBossPlaceholder] = useState(true);
  const { projectId } = useParams<{ projectId: string }>()
  const { fetchedTask } = useTask();
  const { projectMembers } = useProjectMembers(projectId)
  const { logs, loading: logsLoading } = useLog(projectId, { pollIntervalMs: 3000 });
  const { playerAttack, bossAttack, gameStatus } = useGame();
  const [payloadBatch, setPayloadBatch] = useState<GameActionPayload[] | null>(
    null
  );
  const [payloadBatchNonce, setPayloadBatchNonce] = useState(0);
  const [bossRefreshNonce, setBossRefreshNonce] = useState(0);
  const [bossUpdate, setBossUpdate] = useState<{ hp: number; maxHp: number } | null>(
    null
  );
  const [bossUpdateNonce, setBossUpdateNonce] = useState(0);

  const enqueueActions = React.useCallback((actions: GameActionPayload[]) => {
    if (!actions || actions.length === 0) return
    setPayloadBatch(actions)
    setPayloadBatchNonce((n) => n + 1)
  }, [])

  const bumpBossRefresh = React.useCallback(() => {
    setBossRefreshNonce((n) => n + 1)
  }, [])

  const handleMovedToDone = React.useCallback(
    async (taskId: string) => {
      if (!projectId) return;
      console.log(`Task ${taskId} moved to Done, initiating attack...`);
      try {
        const res = await playerAttack(projectId, { task_id: taskId });
        const attacked = res.result.attacks?.length ?? 0;
        const skipped = res.result.skipped?.length ?? 0;
        if (attacked > 0) toast.success(`Boss attacked by ${attacked} assignee(s)`);
        if (skipped > 0) toast(`Skipped ${skipped} assignee(s)`);
        const bossPhaseAdvanced = !!res.result.boss_phase_advanced;
        const bossWasDefeated = bossPhaseAdvanced || (res.result.boss_hp ?? 0) <= 0;

        if (bossPhaseAdvanced) {
          const phaseLabel =
            typeof res.result.boss_phase === "number"
              ? `Phase ${res.result.boss_phase}`
              : "next phase";
          toast.success(`Boss advanced to ${phaseLabel}!`);
        }

        const actions: GameActionPayload[] = (res.result.attacks ?? []).map(
          (a) => ({ act: "ATTACK", userId: String(a.player_id) })
        );

        // Boss transition animations:
        // - If boss was defeated and advances phase: die animation first, then revive to new max HP.
        // - If boss was defeated and does NOT advance phase: die animation only.
        if (bossWasDefeated) {
          actions.push({ act: "BOSS_DIE" });
        }

        if (bossPhaseAdvanced) actions.push({ act: "BOSS_REVIVE" });

        // Pass boss HP/maxHp updates down, but ProjectBattle will apply them only
        // when it is safe (e.g., before BOSS_REVIVE or after queue finishes).
        if (typeof res.result.boss_hp === "number" && typeof res.result.boss_max_hp === "number") {
          setBossUpdate({ hp: res.result.boss_hp, maxHp: res.result.boss_max_hp });
          setBossUpdateNonce((n) => n + 1);
        }
        
        enqueueActions(actions)
        bumpBossRefresh()
      } catch (err) {
        console.error(err);
        toast.error("Attack failed");
      }
    },
    [playerAttack, projectId, enqueueActions, bumpBossRefresh]
  );

  const overdueAttack = useOverdueBossAttack({
    projectId,
    tasks: fetchedTask,
    logs,
    logsLoading,
    bossAttack,
    enqueueActions,
    bumpBossRefresh,
    enabled: true,
  })

  useEffect(() => {
    if (overdueAttack.attackedTaskId) {
      toast.error("Overdue task! Boss attacked!")
    }
    if (overdueAttack.error) {
      // Silent-ish: show only in console; you can toast if you want
      console.error(overdueAttack.error)
    }
  }, [overdueAttack.attackedTaskId, overdueAttack.error])

  const {
    tasks,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    findActiveTask,
    handleAddTask,
    handleDeleteTask,
  } = useKanbanBoard(fetchedTask, { onMovedToDone: handleMovedToDone });

  const toggleBossPlaceholder = () => {
    setShowBossPlaceholder((prev) => !prev);
  };

  const { user } = useAuth()
  const me = gameStatus?.user_statuses?.find((s) => s.user_id === user?.id)
  const HP_DATA = {
    boss: {
      current: gameStatus?.boss_status?.hp ?? 50,
      max: gameStatus?.boss_status?.max_hp ?? 100,
    },
    player: {
      current: me?.hp ?? 100,
      max: me?.max_hp ?? 100,
    },
  }

  return (
    <div className="flex h-[calc(100vh-148px)] w-full">
      {/* Left sidebar */}
      <aside className="w-125 flex-shrink-0 bg-offWhite border-r border-cream">
        <ScrollArea className="h-full" type="always">
          <ProjectDetailCard hpData={HP_DATA} projectData={PROJECT_DATA} />
          <DamageLog logs={logs} />
          <ReviewTask />
        </ScrollArea>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-offWhite overflow-hidden">
        {/* <BossPlaceholder isVisible={showBossPlaceholder} /> */}
        <ProjectBattle
          projectMembers={projectMembers ?? []}
          payloadBatch={payloadBatch}
          payloadBatchNonce={payloadBatchNonce}
          bossRefreshNonce={bossRefreshNonce}
          bossUpdate={bossUpdate}
          bossUpdateNonce={bossUpdateNonce}
        />
        <ToggleButton
          isVisible={showBossPlaceholder}
          onClick={toggleBossPlaceholder}
        />

        {/* Kanban board */}
        <section className="flex-1 overflow-y-auto pt-6 z-40">
          <ScrollArea className="h-full" type="always">
            <KanbanBoard
              tasks={tasks}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              activeId={activeId}
              findActiveTask={findActiveTask}
              projectMember={projectMembers ?? []}
            />
          </ScrollArea>
        </section>
      </main>
    </div>
  );
};

export default ProjectPage;