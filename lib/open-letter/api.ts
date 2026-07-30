import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import {
  mapOpenLetterSignatureRow,
  mapOpenLetterStatsRow,
  type RpcOpenLetterSignatureRow,
  type RpcOpenLetterStatsRow,
} from "@/lib/open-letter/map";
import type {
  CreateOpenLetterSignatureInput,
  OpenLetterErrorCode,
  OpenLetterMutationResult,
  OpenLetterSignaturePublic,
  OpenLetterSignatureStats,
} from "@/types/open-letter";

function fail(
  code: OpenLetterErrorCode,
  message: string,
): OpenLetterMutationResult {
  return { ok: false, error: code, message };
}

export async function fetchOpenLetterData(): Promise<
  | {
      ok: true;
      signatures: OpenLetterSignaturePublic[];
      stats: OpenLetterSignatureStats;
    }
  | { ok: false; error: OpenLetterErrorCode; message: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "not_configured",
      message: "Open letter signing isn’t connected yet.",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const [listResult, statsResult] = await Promise.all([
      supabase.rpc("list_open_letter_signatures"),
      supabase.rpc("get_open_letter_signature_stats"),
    ]);

    if (listResult.error || statsResult.error) {
      return {
        ok: false,
        error: "network",
        message: "We couldn’t load signatures right now.",
      };
    }

    const signatures = (
      (listResult.data ?? []) as RpcOpenLetterSignatureRow[]
    ).map(mapOpenLetterSignatureRow);

    const statsRows = (statsResult.data ?? []) as RpcOpenLetterStatsRow[];

    return {
      ok: true,
      signatures,
      stats: mapOpenLetterStatsRow(statsRows[0]),
    };
  } catch {
    return {
      ok: false,
      error: "network",
      message: "We couldn’t load signatures right now.",
    };
  }
}

export async function createOpenLetterSignature(
  input: CreateOpenLetterSignatureInput,
): Promise<OpenLetterMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Open letter signing isn’t connected yet. Please try again later.",
    );
  }

  try {
    const response = await fetch("/api/open-letter-signatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: input.fullName,
        address: input.address,
        publishPublicly: input.publishPublicly,
        consentHeld: input.consentHeld,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          id?: string;
          signature?: OpenLetterSignaturePublic | null;
          error?: string;
          message?: string;
        }
      | null;

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
      signature: payload.signature ?? null,
    };
  } catch {
    return fail(
      "network",
      "We couldn’t save your signature just now. Please try again.",
    );
  }
}
