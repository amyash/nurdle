import type { MpLookup } from "@/types/write-to-mp";

export async function fetchMpByPostcode(postcode: string): Promise<
  | { ok: true; postcode: string; mp: MpLookup }
  | { ok: false; message: string }
> {
  try {
    const response = await fetch(
      `/api/mp-lookup?postcode=${encodeURIComponent(postcode)}`,
    );
    const data: unknown = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        message: messageFrom(data) ?? "We couldn’t look up that postcode just now. Try again.",
      };
    }
    if (!isRecord(data) || typeof data.postcode !== "string" || !isMpLookup(data.mp)) {
      return {
        ok: false,
        message: "We couldn’t look up that postcode just now. Try again.",
      };
    }
    return { ok: true, postcode: data.postcode, mp: data.mp };
  } catch {
    return {
      ok: false,
      message:
        "We couldn’t look up that postcode just now. Check your connection and try again.",
    };
  }
}

function messageFrom(data: unknown): string | null {
  if (!isRecord(data) || typeof data.message !== "string") return null;
  const message = data.message.trim();
  return message || null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isMpLookup(value: unknown): value is MpLookup {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "number" &&
    typeof value.nameDisplayAs === "string" &&
    typeof value.nameAddressAs === "string" &&
    typeof value.nameFullTitle === "string" &&
    typeof value.constituency === "string" &&
    (typeof value.party === "string" || value.party === null) &&
    (typeof value.email === "string" || value.email === null) &&
    typeof value.contactUrl === "string"
  );
}
