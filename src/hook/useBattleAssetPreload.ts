import { useEffect, useRef } from "react"
import type { BossState, User } from "@/types/battleTypes"
import { getBattlePreloadUrls, preloadBattleGifs } from "@/lib/battleAssetPreload"

/**
 * Decode battle GIFs into the browser cache before / while animating (helps low-spec devices).
 * Re-runs only when boss id or the set of party character folders changes.
 */
export function useBattleAssetPreload(users: User[], boss: BossState): void {
  const usersRef = useRef(users)
  usersRef.current = users

  const charSignature = [...new Set(users.map((u) => u.charId).filter(Boolean))]
    .sort()
    .join(",")
  const preloadKey = `${boss.id}|${charSignature}`

  useEffect(() => {
    const charIds = new Set(
      usersRef.current.map((u) => u.charId).filter(Boolean),
    )
    const urls = getBattlePreloadUrls(charIds, boss.id)
    preloadBattleGifs(urls, 4).catch(() => {
      /* non-fatal */
    })
  }, [preloadKey, boss.id])
}
