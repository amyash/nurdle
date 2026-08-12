import {
  FORM_GATE_RATE_LIMIT,
  FORM_GATE_RATE_WINDOW_MS,
} from "@/lib/form-gate/constants";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Returns true when the request should be allowed. */
export function checkFormSubmissionRateLimit(
  key: string,
  nowMs = Date.now(),
): boolean {
  const bucket = buckets.get(key);
  if (!bucket || nowMs >= bucket.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: nowMs + FORM_GATE_RATE_WINDOW_MS,
    });
    return true;
  }

  if (bucket.count >= FORM_GATE_RATE_LIMIT) {
    return false;
  }

  bucket.count += 1;
  return true;
}
