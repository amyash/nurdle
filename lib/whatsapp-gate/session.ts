const SESSION_KEY = "nurdle-wa-gate-passed";

export function hasPassedWhatsappGate(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWhatsappGatePassed(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Ignore storage failures — gate still works per click.
  }
}
