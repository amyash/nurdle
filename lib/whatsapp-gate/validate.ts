export const WHATSAPP_GATE_MIN_MS = 1500;

export const WHATSAPP_CLEARING_QUESTION = {
  id: "clearing",
  label: "What are volunteers clearing off the beaches?",
  options: [
    { value: "seaweed", label: "Seaweed" },
    { value: "nurdles", label: "Nurdles — tiny plastic pellets" },
    { value: "driftwood", label: "Driftwood" },
  ],
  correctValue: "nurdles",
} as const;

export const WHATSAPP_REFERRAL_QUESTION = {
  id: "referral",
  label: "How did you hear about the nurdles?",
  options: [
    { value: "news", label: "News or press" },
    { value: "friend", label: "A friend told me" },
    { value: "social", label: "Social media" },
    { value: "beach", label: "Saw people on the beach" },
  ],
} as const;

export type WhatsappGateFormValues = {
  clearing: string;
  beachId: string;
  referral: string;
  honeypot: string;
};

export type WhatsappGateValidationResult =
  | { ok: true }
  | { ok: false; reason: "bot" | "human-check" };

export function validateWhatsappGateSubmission(
  values: WhatsappGateFormValues,
  openedAtMs: number,
  nowMs = Date.now(),
): WhatsappGateValidationResult {
  if (values.honeypot.trim().length > 0) {
    return { ok: false, reason: "bot" };
  }

  if (nowMs - openedAtMs < WHATSAPP_GATE_MIN_MS) {
    return { ok: false, reason: "bot" };
  }

  if (values.clearing !== WHATSAPP_CLEARING_QUESTION.correctValue) {
    return { ok: false, reason: "human-check" };
  }

  if (!values.beachId.trim() || !values.referral.trim()) {
    return { ok: false, reason: "human-check" };
  }

  return { ok: true };
}
