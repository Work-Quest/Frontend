"use client"

import React, { useState } from "react";
import { DAMAGE_LOGS, HP_DATA, PROJECT_DATA } from "@/sections/project/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToggleButton from "@/components/ToggleButton";
import ProjectDetailCard from "@/sections/project/ProjectDetailCard/ProjectDetailCard";
import DamageLog from "@/sections/project/DamageLog/DamageLog";
import ReviewTask from "@/sections/project/ReviewTask";
import { KanbanBoard } from "@/sections/project/KanbanBoard/KanbanBoard";
import { useKanbanBoard } from "@/sections/project/KanbanBoard/useKanbanBoard";
import { useTask } from "@/hook/useTask";
import ProjectBattle from "@/sections/project/ProjectBattle";
import { useParams } from "react-router-dom";
import { useGame } from "@/hook/useGame";
import toast from "react-hot-toast";
import type { GameActionPayload } from "@/types/battleTypes";
const ProjectPage: React.FC = () => {
  const [showBossPlaceholder, setShowBossPlaceholder] = useState(true);
  const { projectId } = useParams<{ projectId: string }>();
  const { fetchedTask, projectMembers } = useTask();
  const { playerAttack } = useGame();
  const [payloadBatch, setPayloadBatch] = useState<GameActionPayload[] | null>(
    null
  );
  const [payloadBatchNonce, setPayloadBatchNonce] = useState(0);
  const [bossRefreshNonce, setBossRefreshNonce] = useState(0);

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

        const actions: GameActionPayload[] = (res.result.attacks ?? []).map(
          (a) => ({ act: "ATTACK", userId: String(a.player_id) })
        );
        if (actions.length > 0) {
          setPayloadBatch(actions);
          setPayloadBatchNonce((n) => n + 1);
        }
        setBossRefreshNonce((n) => n + 1);
      } catch (err) {
        console.error(err);
        toast.error("Attack failed");
      }
    },
    [playerAttack, projectId]
  );

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

  return (
    <div className="flex h-[calc(100vh-148px)] w-full">
      {/* Left sidebar */}
      <aside className="w-125 flex-shrink-0 bg-offWhite border-r border-cream">
        <ScrollArea className="h-full" type="always">
          <ProjectDetailCard hpData={HP_DATA} projectData={PROJECT_DATA} />
          <DamageLog logs={DAMAGE_LOGS} />
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