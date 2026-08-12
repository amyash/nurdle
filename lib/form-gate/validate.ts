import {
  FORM_GATE_HONEYPOT_FIELD,
  FORM_GATE_MAX_AGE_MS,
  FORM_GATE_MIN_MS,
} from "@/lib/form-gate/constants";

export type FormGatePayload = {
  formOpenedAt: number;
  honeypot: string;
};

export function readFormGatePayload(
  record: Record<string, unknown>,
): FormGatePayload {
  return {
    formOpenedAt: Number(record.formOpenedAt),
    honeypot: String(record[FORM_GATE_HONEYPOT_FIELD] ?? ""),
  };
}

export function validateFormGate(
  payload: FormGatePayload,
  nowMs = Date.now(),
): boolean {
  if (payload.honeypot.trim().length > 0) {
    return false;
  }

  const { formOpenedAt } = payload;
  if (!Number.isFinite(formOpenedAt) || formOpenedAt <= 0) {
    return false;
  }

  if (formOpenedAt > nowMs + 5000) {
    return false;
  }

  const elapsed = nowMs - formOpenedAt;
  if (elapsed < FORM_GATE_MIN_MS || elapsed > FORM_GATE_MAX_AGE_MS) {
    return false;
  }

  return true;
}
