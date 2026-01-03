/**
 * Convert ISO datetime string -> YYYY-MM-DD (for <input type="date" />)
 * Example:
 *  "2025-12-30T17:00:00Z" -> "2025-12-30"
 */
export function isoToDateInput(iso?: string | null): string {
  if (!iso) return ""
  return iso.split("T")[0]
}

/**
 * Convert YYYY-MM-DD -> ISO datetime (UTC, end of day optional)
 * Example:
 *  "2025-12-30" -> "2025-12-30T00:00:00.000Z"
 */
export function dateInputToISO(
  date: string,
  options?: { endOfDay?: boolean }
): string {
  const d = new Date(date)

  if (options?.endOfDay) {
    d.setUTCHours(23, 59, 59, 999)
  } else {
    d.setUTCHours(0, 0, 0, 0)
  }

  return d.toISOString()
}

/**
 * Convert ISO datetime -> readable local format
 * Example:
 *  "2025-12-30T17:00:00Z" -> "30 Dec 2025"
 */
export function isoToReadableDate(iso?: string | null): string {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
