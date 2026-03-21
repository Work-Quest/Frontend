import type { StatusEffectEntry } from '@/types/GameApi'

/** Normalize game API payload — supports `{ member }` and `{ members[] }`. */
export function extractEffectsFromGamePayload(
  data: unknown,
  myProjectMemberId: string | null
): StatusEffectEntry[] {
  if (!data || typeof data !== 'object') return []
  const o = data as Record<string, unknown>

  const member = o.member
  if (member && typeof member === 'object') {
    const eff = (member as { effects?: unknown }).effects
    if (Array.isArray(eff)) return eff as StatusEffectEntry[]
  }

  const members = o.members
  if (Array.isArray(members)) {
    const row = myProjectMemberId
      ? members.find(
          (m) =>
            m &&
            typeof m === 'object' &&
            String((m as { project_member_id?: unknown }).project_member_id) ===
              String(myProjectMemberId)
        )
      : members[0]
    if (row && typeof row === 'object') {
      const eff = (row as { effects?: unknown }).effects
      if (Array.isArray(eff)) return eff as StatusEffectEntry[]
    }
  }

  return []
}
