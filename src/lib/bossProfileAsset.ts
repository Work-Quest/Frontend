import { ENTITY_CONFIG } from "@/config/battleConfig"

function bossNameToConfigIdMap(): Map<string, string> {
  const bosses = ENTITY_CONFIG.bosses as Record<string, { name?: string }>
  const map = new Map<string, string>()
  for (const [id, cfg] of Object.entries(bosses)) {
    if (cfg?.name) map.set(cfg.name.trim().toLowerCase(), id)
  }
  return map
}

const NAME_TO_ID = bossNameToConfigIdMap()

const DEFAULT_BOSS_ID = "b01"

/**
 * Public URL for boss portrait (`public/assets/sprites/bosses/{id}/profile.png`).
 * Uses `boss_image` when it looks like a config id (`b01`…); otherwise maps `boss_name`.
 */
export function getBossProfileImageSrc(project: {
  boss_name?: string | null
  boss_image?: string | null
}): string {
  const rawId = project.boss_image?.trim()
  if (rawId && /^b\d{2}$/i.test(rawId)) {
    return `/assets/sprites/bosses/${rawId.toLowerCase()}/profile.png`
  }
  const name = project.boss_name?.trim().toLowerCase()
  if (name) {
    const id = NAME_TO_ID.get(name) ?? DEFAULT_BOSS_ID
    return `/assets/sprites/bosses/${id}/profile.png`
  }
  return `/assets/sprites/bosses/${DEFAULT_BOSS_ID}/profile.png`
}
