import { checkinBeachById } from "@/data/checkin-beaches";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { emptyCleanupAggregate } from "@/lib/cleanup-logs/format";
import {
  mapCleanupLogRow,
  mapStatsRows,
  type RpcCleanupLogRow,
  type RpcCleanupStatsRow,
} from "@/lib/cleanup-logs/map";
import type {
  CleanupLogErrorCode,
  CleanupLogMutationResult,
  CleanupStatsResponse,
  CreateCleanupLogInput,
} from "@/types/cleanup-log";

function errorFromMessage(message: string): {
  code: CleanupLogErrorCode;
  message: string;
} {
  const lower = message.toLowerCase();
  if (lower.includes("invalid_beach")) {
    return { code: "invalid_beach", message: "That beach isn’t available." };
  }
  if (lower.includes("beach_disabled")) {
    return {
      code: "beach_disabled",
      message: "Clean-up logging is paused for this beach.",
    };
  }
  if (lower.includes("invalid_date")) {
    return {
      code: "invalid_date",
      message: "Choose a clean-up date between the spill and today.",
    };
  }
  if (lower.includes("invalid_duration")) {
    return {
      code: "invalid_duration",
      message: "Time spent must be between 15 minutes and 12 hours.",
    };
  }
  if (lower.includes("invalid_volunteers")) {
    return {
      code: "invalid_volunteers",
      message: "Enter how many people this clean-up included (1–100).",
    };
  }
  if (lower.includes("invalid_weight")) {
    return {
      code: "invalid_weight",
      message: "Estimated weight must be between 0 and 1,000 kg.",
    };
  }
  if (lower.includes("invalid_name")) {
    return {
      code: "invalid_name",
      message: "Please use a short name only (letters, spaces, hyphens).",
    };
  }
  if (lower.includes("invalid_notes")) {
    return {
      code: "invalid_notes",
      message: "Notes need to be 300 characters or fewer.",
    };
  }
  return {
    code: "unknown",
    message: "We couldn’t save your clean-up just now. Please try again.",
  };
}

function fail(
  code: CleanupLogErrorCode,
  message: string,
): CleanupLogMutationResult {
  return { ok: false, error: code, message };
}

export async function fetchCleanupStats(): Promise<
  | { ok: true; stats: CleanupStatsResponse }
  | { ok: false; error: CleanupLogErrorCode; message: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "not_configured",
      message: "Clean-up logging isn’t connected yet.",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_cleanup_stats");
    if (error) {
      return {
        ok: false,
        error: "network",
        message: "We couldn’t load clean-up totals right now.",
      };
    }
    const mapped = mapStatsRows((data ?? []) as RpcCleanupStatsRow[]);
    return {
      ok: true,
      stats: {
        overall: mapped.overall,
        byBeach: mapped.byBeach,
        beachCountWithActivity: mapped.beachCountWithActivity,
      },
    };
  } catch {
    return {
      ok: false,
      error: "network",
      message: "We couldn’t load clean-up totals right now.",
    };
  }
}

export function emptyCleanupStats(): CleanupStatsResponse {
  return {
    overall: emptyCleanupAggregate(),
    byBeach: {},
    beachCountWithActivity: 0,
  };
}

export async function createCleanupLog(
  input: CreateCleanupLogInput,
): Promise<CleanupLogMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Clean-up logging isn’t connected yet. Please try again later.",
    );
  }

  if (!input.confirmedEstimate) {
    return fail(
      "confirmation_required",
      "Please confirm that these figures are your best estimate.",
    );
  }

  try {
    const response = await fetch("/api/cleanup-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beachId: input.beachId,
        cleanupDate: input.cleanupDate,
        durationMinutes: input.durationMinutes,
        volunteerCount: input.volunteerCount,
        estimatedWeightKg: input.estimatedWeightKg ?? null,
        volunteerName: input.volunteerName ?? null,
        notes: input.notes ?? null,
        confirmedEstimate: true,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { log?: RpcCleanupLogRow; error?: string; message?: string }
      | null;

    if (!response.ok || !payload?.log) {
      const mapped = errorFromMessage(
        payload?.error ?? payload?.message ?? "unknown",
      );
      return fail(
        response.status === 503 ? "not_configured" : mapped.code,
        payload?.message ?? mapped.message,
      );
    }

    const beachName =
      checkinBeachById[payload.log.beach_id]?.name ?? payload.log.beach_id;
    return { ok: true, log: mapCleanupLogRow(payload.log, beachName) };
  } catch {
    return fail(
      "network",
      "We couldn’t save your clean-up just now. Please try again.",
    );
  }
}
