import { NextResponse } from "next/server";
import { FORM_GATE_GENERIC_ERROR } from "@/lib/form-gate/constants";
import {
  checkFormSubmissionRateLimit,
  clientIpFromRequest,
} from "@/lib/form-gate/rate-limit";
import {
  readFormGatePayload,
  validateFormGate,
} from "@/lib/form-gate/validate";

export function rejectFormGateBot(request: Request, record: Record<string, unknown>) {
  const ip = clientIpFromRequest(request);
  if (!checkFormSubmissionRateLimit(ip)) {
    return NextResponse.json(
      { error: "unknown", message: FORM_GATE_GENERIC_ERROR },
      { status: 400 },
    );
  }

  if (!validateFormGate(readFormGatePayload(record))) {
    return NextResponse.json(
      { error: "unknown", message: FORM_GATE_GENERIC_ERROR },
      { status: 400 },
    );
  }

  return null;
}
