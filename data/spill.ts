/**
 * Port of Tyne nurdle spill — single source for “since the spill” dating.
 * Collision / spill start: 19 July 2026.
 */
export const SPILL_START_DATE = "2026-07-19";

/** YYYY-MM-DD for date inputs / comparisons (Europe/London calendar day). */
export function todayDateStringLondon(nowMs: number = Date.now()): string {
  return new Date(nowMs).toLocaleDateString("en-CA", {
    timeZone: "Europe/London",
  });
}

export function formatSpillStartLabel(): string {
  const ms = Date.parse(`${SPILL_START_DATE}T12:00:00+01:00`);
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}
