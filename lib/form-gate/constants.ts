/** Minimum time a volunteer should spend on a log form before submitting. */
export const FORM_GATE_MIN_MS = 3500;

/** Maximum age of formOpenedAt — rejects stale/replayed timestamps. */
export const FORM_GATE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const FORM_GATE_HONEYPOT_FIELD = "company";

/** Per-IP submission cap within the rate-limit window. */
export const FORM_GATE_RATE_LIMIT = 8;

/** Rate-limit window (1 hour). */
export const FORM_GATE_RATE_WINDOW_MS = 60 * 60 * 1000;

export const FORM_GATE_GENERIC_ERROR =
  "We couldn’t save that just now. Please try again.";
