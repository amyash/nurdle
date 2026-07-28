const STORAGE_KEY = "nurdle-checkin-session-id";

let memorySessionId: string | null = null;

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Anonymous browser/session ID for check-ins.
 * Prefer localStorage; fall back to in-memory if storage is unavailable.
 */
export function getOrCreateCheckinSessionId(): string {
  if (typeof window === "undefined") {
    return createSessionId();
  }

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length >= 8 && existing.length <= 64) {
      return existing;
    }
    const created = createSessionId();
    window.localStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    if (!memorySessionId) {
      memorySessionId = createSessionId();
    }
    return memorySessionId;
  }
}
