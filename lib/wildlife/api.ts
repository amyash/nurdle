import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import {
  mapWildlifeReportRow,
  mapWildlifeStatsRow,
  type RpcWildlifeReportRow,
  type RpcWildlifeStatsRow,
} from "@/lib/wildlife/map";
import type {
  CreateWildlifeReportInput,
  WildlifeErrorCode,
  WildlifeImpactStats,
  WildlifeMutationResult,
  WildlifeReportPublic,
} from "@/types/wildlife";

function fail(
  code: WildlifeErrorCode,
  message: string,
): WildlifeMutationResult {
  return { ok: false, error: code, message };
}

export async function fetchWildlifeImpactData(): Promise<
  | {
      ok: true;
      reports: WildlifeReportPublic[];
      stats: WildlifeImpactStats;
    }
  | { ok: false; error: WildlifeErrorCode; message: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "not_configured",
      message: "Wildlife impact isn’t connected yet.",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const [reportsResult, statsResult] = await Promise.all([
      supabase.rpc("list_approved_wildlife_reports"),
      supabase.rpc("get_wildlife_impact_stats"),
    ]);

    if (reportsResult.error || statsResult.error) {
      return {
        ok: false,
        error: "network",
        message: "We couldn’t load wildlife reports right now.",
      };
    }

    const reports = ((reportsResult.data ?? []) as RpcWildlifeReportRow[])
      .map(mapWildlifeReportRow)
      .filter((item): item is WildlifeReportPublic => item != null);

    const statsRows = (statsResult.data ?? []) as RpcWildlifeStatsRow[];

    return {
      ok: true,
      reports,
      stats: mapWildlifeStatsRow(statsRows[0]),
    };
  } catch {
    return {
      ok: false,
      error: "network",
      message: "We couldn’t load wildlife reports right now.",
    };
  }
}

export async function createWildlifeReport(
  input: CreateWildlifeReportInput,
): Promise<WildlifeMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Wildlife reporting isn’t connected yet. Please try again later.",
    );
  }

  try {
    const response = await fetch("/api/wildlife-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beachId: input.beachId,
        dateObserved: input.dateObserved,
        timeObserved: input.timeObserved ?? null,
        animalType: input.animalType,
        species: input.species ?? null,
        count: input.count,
        condition: input.condition,
        description: input.description,
        hasSupportingEvidence: input.hasSupportingEvidence,
        email: input.email,
        reporterName: input.reporterName ?? null,
        consentPublic: input.consentPublic,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { id?: string; error?: string; message?: string }
      | null;

    if (!response.ok || !payload?.id) {
      return fail(
        response.status === 503
          ? "not_configured"
          : ((payload?.error as WildlifeErrorCode) ?? "unknown"),
        payload?.message ??
          "We couldn’t save your report just now. Please try again.",
      );
    }

    return { ok: true, id: payload.id };
  } catch {
    return fail(
      "network",
      "We couldn’t save your report just now. Please try again.",
    );
  }
}
