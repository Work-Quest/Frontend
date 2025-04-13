import { useState } from 'react';
import ProjectDetailCard from "@/sections/project/ProjectDetailCard/ProjectDetailCard";
import DamageLog from "@/sections/project/DamageLog/DamageLog";
import ReviewTask from "@/sections/project/ReviewTask";
import KanbanBoard from "@/sections/project/KanbanBoard/KanbanBoard";

export default function Project() {
  return (
    <div className="flex bg-cream overflow-hidden">
      <div className="w-[500px] h-full flex-shrink-0 bg-offWhite flex flex-col overflow-y-auto">
        <ProjectDetailCard
          hpData={{
            boss: { current: 50, max: 100 },
            player: { current: 80, max: 100 },
          }}
          projectData={{
            deadline: "2023-12-31",
            daysLeft: 30,
            estimatedTime: 10,
          }}
        />

        <DamageLog
          logs={[
            {
              id: "1",
              action: "Setup Django",
              timestamp: "2023-05-15T10:00:00Z",
              damageValue: 1234,
              participants: ["John", "Janny"],
              comment: "Good job!",
            },
            {
              id: "2",
              action: "Setup TailwindCSS",
              timestamp: "2024-05-15T10:00:00Z",
              damageValue: -127,
              participants: ["John", "Nano"],
              comment: "Late!",
            },
          ]}
        />

        <ReviewTask />
      </div>

      <div className="flex-1 h-full flex flex-col bg-offWhite min-w-0 overflow-hidden">
        <div className="h-[250px] flex-shrink-0 border-b border-gray-400 flex items-center justify-center text-gray-500 text-sm">
          Boss Fight Placeholder
        </div>
        
        <div className="flex-1 min-h-0 overflow-hidden">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}
