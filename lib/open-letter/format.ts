export const OPEN_LETTER_NAME_MAX = 80;
export const OPEN_LETTER_NAME_MIN = 2;
export const OPEN_LETTER_TOWN_MAX = 80;
export const OPEN_LETTER_TOWN_MIN = 2;
export const OPEN_LETTER_ADDRESS_MAX = 300;
export const OPEN_LETTER_ADDRESS_MIN = 5;
export const OPEN_LETTER_EMAIL_MAX = 120;

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

export function sanitiseOpenLetterAddress(raw: string | null | undefined):
  | { ok: true; value: string }
  | { ok: false; reason: "required" | "too_short" | "too_long" | "invalid" } {
  if (raw == null) return { ok: false, reason: "required" };
  const normalised = raw
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!normalised) return { ok: false, reason: "required" };
  if (normalised.length < OPEN_LETTER_ADDRESS_MIN) {
    return { ok: false, reason: "too_short" };
  }
  if (normalised.length > OPEN_LETTER_ADDRESS_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(normalised)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: normalised };
}

export function sanitiseOpenLetterEmail(raw: string | null | undefined):
  | { ok: true; value: string | null }
  | { ok: false; reason: "invalid" | "too_long" } {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > OPEN_LETTER_EMAIL_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

export function formatSignatureCount(count: number): string {
  if (count === 1) return "1 signature";
  return `${count.toLocaleString("en-GB")} signatures`;
}

export function formatSignatureCountHeadline(count: number): string {
  return count.toLocaleString("en-GB");
}
