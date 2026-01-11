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
  // INITIAL_TASKS,
  DAMAGE_LOGS,
  HP_DATA,
  PROJECT_DATA,
};