import { SPILL_START_DATE, todayDateStringLondon } from "@/data/spill";

export const ADMIN_TIME_NAME_MAX = 40;
export const ADMIN_TIME_NOTES_MAX = 300;
export const ADMIN_TIME_MIN_MINUTES = 15;
export const ADMIN_TIME_MAX_MINUTES = 12 * 60;
export const ADMIN_TIME_MIN_DATE = SPILL_START_DATE;

export const ADMIN_TIME_CATEGORIES = [
  { id: "website", label: "Website / tech" },
  { id: "organising", label: "Organising / coordination" },
  { id: "communications", label: "Communications / social" },
  { id: "sewing", label: "Mesh bag sewing / supplies" },
  { id: "other", label: "Other admin" },
] as const;

export type AdminTimeCategoryId = (typeof ADMIN_TIME_CATEGORIES)[number]["id"];

export function categoryLabel(id: string): string {
  return (
    ADMIN_TIME_CATEGORIES.find((item) => item.id === id)?.label ?? id
  );
}

export function isValidAdminTimeCategory(
  id: string,
): id is AdminTimeCategoryId {
  return ADMIN_TIME_CATEGORIES.some((item) => item.id === id);
}

export function isValidAdminWorkDate(
  dateStr: string,
  nowMs: number = Date.now(),
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  if (dateStr < ADMIN_TIME_MIN_DATE) return false;
  if (dateStr > todayDateStringLondon(nowMs)) return false;
  return true;
}

export function parseAdminDurationMinutes(
  hours: number,
  minutes: number,
): { ok: true; minutes: number } | { ok: false } {
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return { ok: false };
  }
  const total = hours * 60 + minutes;
  if (total < ADMIN_TIME_MIN_MINUTES || total > ADMIN_TIME_MAX_MINUTES) {
    return { ok: false };
  }
  return { ok: true, minutes: total };
}

function formatHoursValue(totalMinutes: number): {
  display: string;
  value: string;
  numeric: number;
} {
  const hours = Math.round((totalMinutes / 60) * 10) / 10;
  const display =
    Number.isInteger(hours) || Math.abs(hours - Math.round(hours)) < 0.05
      ? String(Math.round(hours))
      : hours.toFixed(1);
  return {
    display,
    value: Number(display).toLocaleString("en-GB"),
    numeric: Math.abs(Number(display)),
  };
}

export function formatAdminHours(totalMinutes: number): string {
  const { value, numeric } = formatHoursValue(totalMinutes);
  return `${value} admin hour${numeric === 1 ? "" : "s"}`;
}

/** Community-effort callout label for organising / sewing time. */
export function formatAdminEffortHours(totalMinutes: number): string {
  const { value, numeric } = formatHoursValue(totalMinutes);
  return `${value} volunteer admin and manufacturing hour${numeric === 1 ? "" : "s"}`;
}

export function sanitiseAdminName(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long" | "invalid";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > ADMIN_TIME_NAME_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (!/^[\p{L}][\p{L}\s'-]{0,39}$/u.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

export function sanitiseAdminNotes(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > ADMIN_TIME_NOTES_MAX) {
    return { ok: false, reason: "too_long" };
  }
  return { ok: true, value: trimmed };
}
