export const OPEN_LETTER_NAME_MAX = 80;
export const OPEN_LETTER_NAME_MIN = 2;
export const OPEN_LETTER_TOWN_MAX = 80;
export const OPEN_LETTER_TOWN_MIN = 2;
export const OPEN_LETTER_POSTCODE_MAX = 12;
export const OPEN_LETTER_POSTCODE_MIN = 5;

export function sanitiseOpenLetterName(raw: string | null | undefined):
  | { ok: true; value: string }
  | { ok: false; reason: "required" | "too_short" | "too_long" | "invalid" } {
  if (raw == null) return { ok: false, reason: "required" };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: false, reason: "required" };
  if (trimmed.length < OPEN_LETTER_NAME_MIN) {
    return { ok: false, reason: "too_short" };
  }
  if (trimmed.length > OPEN_LETTER_NAME_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

export function sanitiseOpenLetterTown(raw: string | null | undefined):
  | { ok: true; value: string }
  | { ok: false; reason: "required" | "too_short" | "too_long" | "invalid" } {
  if (raw == null) return { ok: false, reason: "required" };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: false, reason: "required" };
  if (trimmed.length < OPEN_LETTER_TOWN_MIN) {
    return { ok: false, reason: "too_short" };
  }
  if (trimmed.length > OPEN_LETTER_TOWN_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

/** Normalise a UK postcode; allows common spacing (e.g. NE30 4NT). */
export function sanitiseOpenLetterPostcode(raw: string | null | undefined):
  | { ok: true; value: string }
  | { ok: false; reason: "required" | "too_short" | "too_long" | "invalid" } {
  if (raw == null) return { ok: false, reason: "required" };
  const compact = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!compact) return { ok: false, reason: "required" };
  if (compact.length < OPEN_LETTER_POSTCODE_MIN) {
    return { ok: false, reason: "too_short" };
  }
  if (compact.length > OPEN_LETTER_POSTCODE_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (!/^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(compact)) {
    return { ok: false, reason: "invalid" };
  }
  const outward = compact.slice(0, compact.length - 3);
  const inward = compact.slice(-3);
  return { ok: true, value: `${outward} ${inward}` };
}

export function formatSupportTotal(count: number): string {
  return count.toLocaleString("en-GB");
}

export function formatSignedByLabel(count: number): string {
  return `Signed by ${formatSupportTotal(count)} members of the voluntary effort to respond to the Port of Tyne Nurdle Catastrophe`;
}
