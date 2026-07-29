import { SPILL_START_DATE, todayDateStringLondon } from "@/data/spill";
import type { CleanupAggregate } from "@/types/cleanup-log";

export const CLEANUP_NAME_MAX = 40;
export const CLEANUP_NOTES_MAX = 300;
export const CLEANUP_MIN_MINUTES = 15;
export const CLEANUP_MAX_MINUTES = 12 * 60;
export const CLEANUP_MAX_VOLUNTEERS = 100;
export const CLEANUP_MAX_WEIGHT_KG = 1000;

/** 1 litre of nurdles ≈ 550 g. Midpoints used for ranges. */
export const NURDLE_KG_PER_LITRE = 0.55;

export const CLEANUP_VOLUME_OPTIONS = [
  { id: "handful", label: "Handful", litres: 0.05 },
  { id: "cup", label: "Cup (~250 ml)", litres: 0.25 },
  { id: "half-litre", label: "Half litre", litres: 0.5 },
  { id: "1-litre", label: "1 litre", litres: 1 },
  { id: "2-5-litres", label: "2–5 litres", litres: 3.5 },
  { id: "5-10-litres", label: "5–10 litres", litres: 7.5 },
  { id: "more-than-10-litres", label: "More than 10 litres", litres: 12.5 },
] as const;

export type CleanupVolumeId = (typeof CLEANUP_VOLUME_OPTIONS)[number]["id"];

export function litresToEstimatedKg(litres: number): number {
  return Math.round(litres * NURDLE_KG_PER_LITRE * 100) / 100;
}

export function estimatedKgForVolume(
  volumeId: string | null | undefined,
): { ok: true; id: CleanupVolumeId; label: string; kg: number } | { ok: false } {
  if (volumeId == null || volumeId === "") return { ok: false };
  const option = CLEANUP_VOLUME_OPTIONS.find((item) => item.id === volumeId);
  if (!option) return { ok: false };
  return {
    ok: true,
    id: option.id,
    label: option.label,
    kg: litresToEstimatedKg(option.litres),
  };
}

export function emptyCleanupAggregate(): CleanupAggregate {
  return {
    totalDurationMinutes: 0,
    totalVolunteerHours: 0,
    totalVolunteerSessions: 0,
    totalEstimatedWeightKg: 0,
    submissionCount: 0,
  };
}

/** Volunteer-hours for one submission: hours × people. */
export function volunteerHoursForSubmission(
  durationMinutes: number,
  volunteerCount: number,
): number {
  return (durationMinutes / 60) * volunteerCount;
}

export function formatVolunteerHours(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  const display =
    Number.isInteger(rounded) || Math.abs(rounded - Math.round(rounded)) < 0.05
      ? String(Math.round(rounded))
      : rounded.toFixed(1);
  const value = Number(display).toLocaleString("en-GB");
  return `${value} volunteer hour${Math.abs(Number(display)) === 1 ? "" : "s"}`;
}

export function formatVolunteerSessions(count: number): string {
  const value = count.toLocaleString("en-GB");
  return `${value} volunteer session${count === 1 ? "" : "s"}`;
}

export function formatEstimatedWeight(kg: number): string {
  if (kg <= 0) return "0 kg estimated collected";
  if (kg >= 1000) {
    const tonnes = Math.round((kg / 1000) * 10) / 10;
    const label = Number.isInteger(tonnes) ? String(tonnes) : tonnes.toFixed(1);
    return `${label} tonne${Number(label) === 1 ? "" : "s"} estimated collected`;
  }
  const rounded = Math.round(kg * 10) / 10;
  const nice = rounded.toLocaleString("en-GB", {
    maximumFractionDigits: 1,
  });
  return `${nice} kg estimated collected`;
}

export function isValidCleanupDate(
  dateStr: string,
  nowMs: number = Date.now(),
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  if (dateStr < SPILL_START_DATE) return false;
  if (dateStr > todayDateStringLondon(nowMs)) return false;
  return true;
}

export function parseDurationMinutes(
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
  if (total < CLEANUP_MIN_MINUTES || total > CLEANUP_MAX_MINUTES) {
    return { ok: false };
  }
  return { ok: true, minutes: total };
}

export function sanitiseCleanupName(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long" | "invalid";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > CLEANUP_NAME_MAX) return { ok: false, reason: "too_long" };
  if (!/^[\p{L}][\p{L}\s'-]{0,39}$/u.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

export function sanitiseCleanupNotes(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > CLEANUP_NOTES_MAX) {
    return { ok: false, reason: "too_long" };
  }
  return { ok: true, value: trimmed };
}

