import { Tasks } from "./KanbanBoard/types";


export const INITIAL_TASKS: Tasks = {
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

export const DAMAGE_LOGS = [
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

export const HP_DATA = {
  boss: { current: 50, max: 100 },
  player: { current: 80, max: 100 },
};

export const PROJECT_DATA = {
  deadline: "2023-12-31",
  daysLeft: 30,
  estimatedTime: 10,
};

export default {
  INITIAL_TASKS,
  DAMAGE_LOGS,
  HP_DATA,
  PROJECT_DATA,
};