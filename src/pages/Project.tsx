import React from "react";
import ProjectDetailCard from "@/sections/project/ProjectDetailCard/ProjectDetailCard";
import DamageLog from "@/sections/project/DamageLog/DamageLog";
import ReviewTask from "@/sections/project/ReviewTask";
import { KanbanBoard } from "@/sections/project/KanbanBoard/KanbanBoard";
import { useKanbanBoard } from "@/sections/project/KanbanBoard/useKanbanBoard";
import { Tasks } from "@/sections/project/KanbanBoard/types";

// dummy data
const INITIAL_TASKS: Tasks = {
  backlog: [
    {
      id: "task-1",
      title: "Design database schema",
      priority: "High",
      iteration: "Sprint 1",
      assignees: ["Alice", "You"],
      status: "backlog",
    },
    {
      id: "task-2",
      title: "Research API requirements",
      priority: "Medium",
      iteration: "Sprint 1",
      assignees: ["Bob"],
      status: "backlog",
    },
  ],
  todo: [
    {
      id: "task-3",
      title: "Setup project repository",
      priority: "Low",
      iteration: "Sprint 1",
      assignees: ["You"],
      status: "todo",
    },
    {
      id: "task-4",
      title: "Create component structure",
      priority: "Medium",
      iteration: "Sprint 1",
      assignees: ["Charlie", "Alice"],
      status: "todo",
    },
  ],
  inProgress: [
    {
      id: "task-5",
      title: "Implement authentication",
      priority: "Low",
      iteration: "Sprint 2",
      assignees: ["You", "David"],
      status: "inProgress",
    },
  ],
  done: [
    {
      id: "task-6",
      title: "Project setup",
      priority: "Low",
      iteration: "Sprint 1",
      assignees: ["Bob"],
      status: "done",
    },
  ],
};

const DAMAGE_LOGS = [
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
  {
    id: "3",
    action: "Setup React",
    timestamp: "2025-05-15T10:00:00Z",
    damageValue: 1234,
    participants: ["John", "Janny"],
    comment: "Good job!",
  },
  {
    id: "4",
    action: "Setup TailwindCSS",
    timestamp: "2026-05-15T10:00:00Z",
    damageValue: -127,
    participants: ["John", "Nano"],
    comment: "Late!",
  },
];

const HP_DATA = {
  boss: { current: 50, max: 100 },
  player: { current: 80, max: 100 },
};

const PROJECT_DATA = {
  deadline: "2023-12-31",
  daysLeft: 30,
  estimatedTime: 10,
};

const ProjectPage: React.FC = () => {
  const {
    tasks,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    findActiveTask,
    handleAddTask,
    handleDeleteTask,
  } = useKanbanBoard(INITIAL_TASKS);

  return (
    <div className="flex">
      {/* Left sidebar */}
      <aside className="flex flex-col w-125 flex-shrink-0 bg-offWhite border-r border-cream">
        <ProjectDetailCard hpData={HP_DATA} projectData={PROJECT_DATA} />

        <DamageLog logs={DAMAGE_LOGS} />

        <ReviewTask />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-offWhite overflow-hidden">
        {/* Boss fight header */}
        <header className="h-64 flex-shrink-0 border-b border-gray-400 flex items-center justify-center text-gray-500 text-sm">
          Boss Fight Placeholder
        </header>

        {/* Kanban board section */}
        <section className="flex-1 p-4 overflow-auto">
          <KanbanBoard
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            activeId={activeId}
            findActiveTask={findActiveTask}
          />
        </section>
      </main>
    </div>
  );
};

export default ProjectPage;
