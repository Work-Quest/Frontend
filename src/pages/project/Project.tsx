"use client"

import React, { useState } from "react";
import { DAMAGE_LOGS, HP_DATA, PROJECT_DATA } from "@/sections/project/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import BossPlaceholder from "@/sections/project/BossPlaceholder";
import ToggleButton from "@/components/ToggleButton";
import ProjectDetailCard from "@/sections/project/ProjectDetailCard/ProjectDetailCard";
import DamageLog from "@/sections/project/DamageLog/DamageLog";
import ReviewTask from "@/sections/project/ReviewTask";
import { KanbanBoard } from "@/sections/project/KanbanBoard/KanbanBoard";
import { useKanbanBoard } from "@/sections/project/KanbanBoard/useKanbanBoard";
import { useTask } from "@/hook/useTask";
const ProjectPage: React.FC = () => {
  const [showBossPlaceholder, setShowBossPlaceholder] = useState(true);
   const { fetchedTask, projectMembers } = useTask();
   console.log("Fetched tasks in ProjectPage:", fetchedTask);

  const {
    tasks,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    findActiveTask,
    handleAddTask,
    handleDeleteTask,
  } = useKanbanBoard(fetchedTask);

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
        <BossPlaceholder isVisible={showBossPlaceholder} />
        <ToggleButton
          isVisible={showBossPlaceholder}
          onClick={toggleBossPlaceholder}
        />

        {/* Kanban board */}
        <section className="flex-1 overflow-y-auto pt-6">
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