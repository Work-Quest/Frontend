function coerceNum(x: unknown): number {
  if (typeof x === 'number') return x
  if (typeof x === 'string' && x.trim() !== '') return Number(x)
  return Number.NaN
}

export function parseDailyWorkload(raw: unknown): number[] {
  if (raw == null) return []

  if (Array.isArray(raw)) {
    return raw.map(coerceNum).filter((n) => Number.isFinite(n))
  }

  if (typeof raw === 'string') {
    const s = raw.trim()
    if (!s) return []
    try {
      let parsed: unknown = JSON.parse(s)
      // Double-encoded: "[1,2,3]"
      if (typeof parsed === 'string') {
        const inner = parsed.trim()
        if (inner.startsWith('[') || inner.startsWith('{')) {
          try {
            parsed = JSON.parse(inner)
          } catch {
            // keep string
          }
        }
      }
      if (Array.isArray(parsed)) {
        return parsed.map(coerceNum).filter((n) => Number.isFinite(n))
      }
      if (parsed && typeof parsed === 'object') {
        const o = parsed as Record<string, unknown>
        for (const k of ['values', 'daily', 'days', 'data', 'workload', 'work_load_per_day']) {
          const v = o[k]
          if (Array.isArray(v)) {
            return v.map(coerceNum).filter((n) => Number.isFinite(n))
          }
        }
      }
    } catch {
      if (s.includes(',')) {
        return s
          .split(',')
          .map((x) => coerceNum(x.trim()))
          .filter((n) => Number.isFinite(n))
      }
    }
  }

  return []
}
