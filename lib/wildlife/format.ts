import { SPILL_START_DATE, todayDateStringLondon } from "@/data/spill";
import type {
  WildlifeAnimalType,
  WildlifeCondition,
  WildlifeFilter,
  WildlifeReportStatus,
} from "@/types/wildlife";

export const WILDLIFE_MIN_DATE = SPILL_START_DATE;
export const WILDLIFE_COUNT_MIN = 1;
export const WILDLIFE_COUNT_MAX = 100;
export const WILDLIFE_SPECIES_MAX = 80;
export const WILDLIFE_DESCRIPTION_MAX = 1000;
export const WILDLIFE_EMAIL_MAX = 120;
export const WILDLIFE_NAME_MAX = 40;

export const WILDLIFE_ANIMAL_TYPES: {
  id: WildlifeAnimalType;
  label: string;
}[] = [
  { id: "bird", label: "Bird" },
  { id: "fish", label: "Fish" },
  { id: "seal", label: "Seal" },
  { id: "marine_mammal", label: "Marine mammal" },
  { id: "crustacean", label: "Crustacean / shellfish" },
  { id: "other", label: "Other" },
  { id: "unknown", label: "Unknown" },
];

export const WILDLIFE_CONDITIONS: {
  id: WildlifeCondition;
  label: string;
}[] = [
  { id: "alive_distress", label: "Alive and in distress" },
  { id: "dead", label: "Dead" },
  { id: "interacting_nurdles", label: "Interacting with nurdles" },
  { id: "unsure", label: "Unsure" },
];

export const WILDLIFE_FILTERS: { id: WildlifeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "distress", label: "In distress" },
  { id: "dead", label: "Dead" },
  { id: "nurdles", label: "Interaction with nurdles" },
];

export function animalTypeLabel(id: string): string {
  return WILDLIFE_ANIMAL_TYPES.find((item) => item.id === id)?.label ?? id;
}

export function conditionLabel(id: string): string {
  return WILDLIFE_CONDITIONS.find((item) => item.id === id)?.label ?? id;
}

export function statusLabel(status: WildlifeReportStatus): string {
  if (status === "approved") return "Verified";
  if (status === "rejected") return "Not published";
  return "Awaiting review";
}

export function displaySpecies(
  animalType: WildlifeAnimalType,
  species: string | null,
): string {
  const trimmed = species?.trim();
  if (trimmed) return trimmed;
  return animalTypeLabel(animalType);
}

export function isValidAnimalType(id: string): id is WildlifeAnimalType {
  return WILDLIFE_ANIMAL_TYPES.some((item) => item.id === id);
}

export function isValidCondition(id: string): id is WildlifeCondition {
  return WILDLIFE_CONDITIONS.some((item) => item.id === id);
}

export function isValidWildlifeDate(
  dateStr: string,
  nowMs: number = Date.now(),
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  if (dateStr < WILDLIFE_MIN_DATE) return false;
  if (dateStr > todayDateStringLondon(nowMs)) return false;
  return true;
}

export function isValidOptionalTime(value: string | null | undefined): boolean {
  if (value == null || value.trim() === "") return true;
  return /^\d{2}:\d{2}$/.test(value.trim());
}

export function matchesWildlifeFilter(
  condition: WildlifeCondition,
  filter: WildlifeFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "distress") return condition === "alive_distress";
  if (filter === "dead") return condition === "dead";
  if (filter === "nurdles") return condition === "interacting_nurdles";
  return true;
}

export function formatObservedDate(dateStr: string): string {
  const ms = Date.parse(`${dateStr}T12:00:00`);
  if (Number.isNaN(ms)) return dateStr;
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function sanitiseSpecies(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | { ok: false; reason: "too_long" } {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > WILDLIFE_SPECIES_MAX) {
    return { ok: false, reason: "too_long" };
  }
  return { ok: true, value: trimmed };
}

export function sanitiseDescription(raw: string | null | undefined): {
  ok: true;
  value: string;
} | { ok: false; reason: "required" | "too_long" } {
  if (raw == null) return { ok: false, reason: "required" };
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: "required" };
  if (trimmed.length > WILDLIFE_DESCRIPTION_MAX) {
    return { ok: false, reason: "too_long" };
  }
  return { ok: true, value: trimmed };
}

export function sanitiseWildlifeEmail(raw: string | null | undefined): {
  ok: true;
  value: string;
} | { ok: false; reason: "required" | "invalid" | "too_long" } {
  if (raw == null) return { ok: false, reason: "required" };
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return { ok: false, reason: "required" };
  if (trimmed.length > WILDLIFE_EMAIL_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

export function sanitiseWildlifeName(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | { ok: false; reason: "too_long" | "invalid" } {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > WILDLIFE_NAME_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (!/^[\p{L}][\p{L}\s'-]{0,39}$/u.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}
