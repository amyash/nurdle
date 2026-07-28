import { CHECKIN_EXPIRY_HOURS } from "@/data/checkin-beaches";
import type { BeachCheckinStats } from "@/types/check-in";

export const FIRST_NAME_MAX_LENGTH = 40;

/** Whether a check-in is active given server/DB timestamps (ISO strings). */
export function isCheckinActive(params: {
  checkedOutAt: string | null;
  expiresAt: string;
  nowMs: number;
}): boolean {
  if (params.checkedOutAt != null) return false;
  const expiresMs = Date.parse(params.expiresAt);
  if (Number.isNaN(expiresMs)) return false;
  return expiresMs > params.nowMs;
}

export function countActiveCheckins<
  T extends { checkedOutAt: string | null; expiresAt: string },
>(records: T[], nowMs: number): number {
  return records.filter((record) =>
    isCheckinActive({
      checkedOutAt: record.checkedOutAt,
      expiresAt: record.expiresAt,
      nowMs,
    }),
  ).length;
}

export function volunteerCountLabel(count: number): string {
  if (count === 1) return "1 volunteer currently here";
  return `${count} volunteers currently here`;
}

export function summaryLabel(stats: BeachCheckinStats[]): string {
  const totalVolunteers = stats.reduce(
    (sum, row) => sum + row.volunteerCount,
    0,
  );
  const beachesWithVolunteers = stats.filter(
    (row) => row.volunteerCount > 0,
  ).length;

  if (totalVolunteers === 0) {
    return "No volunteers currently checked in";
  }

  const volunteerWord =
    totalVolunteers === 1 ? "volunteer" : "volunteers";
  const beachWord = beachesWithVolunteers === 1 ? "beach" : "beaches";

  return `${totalVolunteers} ${volunteerWord} currently checked in across ${beachesWithVolunteers} ${beachWord}`;
}

/** Optional public name wording — never lists everyone. */
export function namedHelpingLabel(
  sampleFirstName: string | null,
  count: number,
): string | null {
  if (!sampleFirstName || count < 1) return null;
  if (count === 1) {
    return `${sampleFirstName} is currently helping here.`;
  }
  const others = count - 1;
  const othersWord = others === 1 ? "other" : "others";
  return `${sampleFirstName} and ${others} ${othersWord} are currently helping here.`;
}

export function sanitiseFirstName(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long" | "invalid";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > FIRST_NAME_MAX_LENGTH) {
    return { ok: false, reason: "too_long" };
  }
  // Letters (incl. accents), spaces, hyphen, apostrophe
  if (!/^[\p{L}][\p{L}\s'-]{0,39}$/u.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

export function formatRelativeCheckinTime(
  iso: string | null,
  nowMs: number,
): string | null {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return null;
  const diffSec = Math.max(0, Math.round((nowMs - then) / 1000));
  if (diffSec < 60) return "Checked in just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) {
    return diffMin === 1
      ? "Last check-in 1 minute ago"
      : `Last check-in ${diffMin} minutes ago`;
  }
  const diffHr = Math.round(diffMin / 60);
  return diffHr === 1
    ? "Last check-in 1 hour ago"
    : `Last check-in ${diffHr} hours ago`;
}

export function expiryHours(): number {
  return CHECKIN_EXPIRY_HOURS;
}
