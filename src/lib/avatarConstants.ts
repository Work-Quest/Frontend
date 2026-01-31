export const TOTAL_AVATARS = 6;

export const AVATAR_OPTIONS = Array.from(
  { length: TOTAL_AVATARS },
  (_, i) => i + 1,
);

export const AVATAR_COLORS: Record<number, string> = {
  1: "#EF4444", // Red
  2: "#F97316", // Orange
  3: "#EAB308", // Yellow
  4: "#22C55E", // Green
  5: "#14B8A6", // Teal
  6: "#3B82F6", // Blue
  7: "#6366F1", // Indigo
  8: "#A855F7", // Purple
  9: "#EC4899", // Pink
  10: "#78716C", // Stone
};

// Helper to get color safely (fallback to gray)
export const getAvatarColor = (id: number) => AVATAR_COLORS[id] || "#cbd5e1";

// Helper to get avatar image path
export const getAvatarPath = (id: number) => `/avatars/${id}.png`;
