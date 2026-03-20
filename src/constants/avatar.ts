export const AVATAR_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const PRESET_COLORS = [
  { value: "#ff995a", label: "Orange" },
  { value: "#70BEFF", label: "Blue" },
  { value: "#F76652", label: "Red" },
  { value: "#F7E352", label: "Yellow" },
  { value: "#2EBF49", label: "Green" },
  { value: "#948B81", label: "Brown" },
  { value: "#FFC3AB", label: "Peach" },
  { value: "#2F3E65", label: "Navy" },
] as const;

export const getColorValueById = (bgColorId?: number): string => {
  if (!bgColorId || bgColorId < 1 || bgColorId > PRESET_COLORS.length) {
    return PRESET_COLORS[0].value;
  }
  return PRESET_COLORS[bgColorId - 1].value;
};

export const getColorIdByValue = (colorValue?: string): number => {
  if (!colorValue) return 1;
  const index = PRESET_COLORS.findIndex(
    (c) => c.value.toLowerCase() === colorValue.toLowerCase(),
  );
  return index >= 0 ? index + 1 : 1;
};

export const getAvatarProfilePath = (avatarId?: number): string => {
  const id = avatarId && avatarId >= 1 && avatarId <= 9 ? avatarId : 1;
  return `/assets/sprites/characters/c${String(id).padStart(2, "0")}/profile.png`;
};

