import { ENTITY_CONFIG } from "@/config/battleConfig"

/** Always needed for the battle viewport */
export const BATTLE_GLOBAL_GIF_URLS = [
  "/assets/bg.gif",
  "/assets/magic_ring.gif",
] as const

function spriteActionUrls(
  type: "characters" | "bosses",
  entityId: string,
): string[] {
  const bucket = ENTITY_CONFIG[type] as Record<
    string,
    { actions?: Record<string, unknown> }
  >
  const cfg = bucket[entityId]
  if (!cfg?.actions) return []
  return Object.keys(cfg.actions).map(
    (action) => `/assets/sprites/${type}/${entityId}/${action}.gif`,
  )
}

/**
 * All GIF URLs for the current boss + party characters (every action file we ship).
 */
export function getBattlePreloadUrls(
  characterIds: Iterable<string>,
  bossId: string,
): string[] {
  const urls = new Set<string>(BATTLE_GLOBAL_GIF_URLS)
  for (const id of characterIds) {
    const trimmed = id?.trim()
    if (trimmed) spriteActionUrls("characters", trimmed).forEach((u) => urls.add(u))
  }
  const bid = bossId?.trim()
  if (bid) spriteActionUrls("bosses", bid).forEach((u) => urls.add(u))
  return [...urls]
}

/**
 * Warm HTTP cache + decode so CSS `background-image` swaps don’t stall on slow devices.
 */
function preloadOne(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    const finish = () => resolve()
    img.onload = () => {
      img.decode?.().then(finish).catch(finish)
    }
    img.onerror = finish
    img.src = url
    if (img.complete) {
      img.decode?.().then(finish).catch(finish)
    }
  })
}

/**
 * Preload in small batches to avoid spiking memory / connections on low-end phones.
 */
export async function preloadBattleGifs(
  urls: string[],
  concurrency = 4,
): Promise<void> {
  const queue = [...urls]
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (queue.length > 0) {
        const next = queue.shift()
        if (next) await preloadOne(next)
      }
    }),
  )
}
