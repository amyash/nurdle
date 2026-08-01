import type {
  CreateOpenLetterSignatureInput,
  OpenLetterErrorCode,
  OpenLetterMutationResult,
  OpenLetterSignatureStats,
} from "@/types/open-letter";

function fail(
  code: OpenLetterErrorCode,
  message: string,
): OpenLetterMutationResult {
  return { ok: false, error: code, message };
}

export async function fetchOpenLetterAdditiveCount(): Promise<
  | { ok: true; stats: OpenLetterSignatureStats }
  | { ok: false; error: OpenLetterErrorCode; message: string }
> {
  try {
    const response = await fetch("/api/open-letter-signatures", {
      method: "GET",
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as {
      additiveCount?: number;
    } | null;
    return {
      ok: true,
      stats: { additiveCount: Number(payload?.additiveCount) || 0 },
    };
  } catch {
    return {
      ok: false,
      error: "network",
      message: "We couldn’t load the signature total right now.",
    };
  }
}

export async function createOpenLetterSignature(
  input: CreateOpenLetterSignatureInput,
): Promise<OpenLetterMutationResult> {
  try {
    const response = await fetch("/api/open-letter-signatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: input.fullName,
        town: input.town,
        postcode: input.postcode,
        joinedWhatsapp: input.joinedWhatsapp,
      }),
    });

    const payload = (await response.json().catch(() => null)) as {
      id?: string;
      countsTowardTotal?: boolean;
      additiveCount?: number;
      error?: string;
      message?: string;
    } | null;

    if (!response.ok || !payload?.id) {
      return fail(
        response.status === 503
          ? "not_configured"
          : ((payload?.error as OpenLetterErrorCode) ?? "unknown"),
        payload?.message ??
          "We couldn’t save your signature just now. Please try again.",
      );
    }

    return {
      ok: true,
      id: payload.id,
      countsTowardTotal: payload.countsTowardTotal === true,
      additiveCount: Number(payload.additiveCount) || 0,
    };
  } catch {
    return fail(
      "network",
      "We couldn’t save your signature just now. Please try again.",
    );
  }
}
