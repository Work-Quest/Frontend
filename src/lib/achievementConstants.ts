export const ACHIEVEMENT_IDS = ["01", "02", "03", "04", "05", "06"] as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

export interface AchievementMeta {
  id: AchievementId;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Record<AchievementId, AchievementMeta> = {
  "01": {
    id: "01",
    name: "Zombie of the group",
    description: "You died in battle and were revived to fight again.",
  },
  "02": {
    id: "02",
    name: "Last-minute Bestfriend",
    description: "You consistently finished tasks right before the deadline without being late.",
  },
  "03": {
    id: "03",
    name: "Ghost helper",
    description: "You died but still played a strong supporting role for the team.",
  },
  "04": {
    id: "04",
    name: "The Last Stand",
    description: "You were the last surviving member when the boss went down.",
  },
  "05": {
    id: "05",
    name: "One HP Legend",
    description: "You helped end the project while hanging on with almost no HP left.",
  },
  "06": {
    id: "06",
    name: "MVP",
    description: "You achieved the highest score in the project with outstanding performance.",
  },
};

export const getAchievementImagePath = (id: AchievementId): string =>
  `/assets/achievements/${id}.png`;

export const getAchievementName = (id: AchievementId): string =>
  ACHIEVEMENTS[id]?.name ?? id;

export const getAchievementDescription = (id: AchievementId): string =>
  ACHIEVEMENTS[id]?.description ?? "";


