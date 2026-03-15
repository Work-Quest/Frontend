/**
 * Maps boss names to frontend config IDs (b01, b02, b03, etc.)
 * Used to generate correct sprite paths for boss images.
 */
export const getBossConfigId = (bossName: string): string => {
  const nameLower = bossName.trim().toLowerCase();
  const mapping: Record<string, string> = {
    'dracula': 'b01',
    'golem': 'b02',
    'gnoll': 'b03',
    // Add more mappings as needed
  };
  return mapping[nameLower] || 'b01'; // Default to b01 if boss name doesn't match
};

