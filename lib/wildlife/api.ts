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
  WildlifeDeleteResult,
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

function failDelete(
  code: WildlifeErrorCode,
  message: string,
): WildlifeDeleteResult {
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
        formOpenedAt: input.formOpenedAt,
        company: input.company ?? "",
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          id?: string;
          status?: string;
          report?: WildlifeReportPublic | null;
          error?: string;
          message?: string;
        }
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

    return {
      ok: true,
      id: payload.id,
      report: payload.report ?? null,
    };
  } catch {
    return fail(
      "network",
      "We couldn’t save your report just now. Please try again.",
    );
  }
}

export async function removeWildlifeReport(
  id: string,
  email: string,
): Promise<WildlifeDeleteResult> {
  if (!isSupabaseConfigured()) {
    return failDelete(
      "not_configured",
      "Wildlife reporting isn’t connected yet. Please try again later.",
    );
  }

  try {
    const response = await fetch("/api/wildlife-reports", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { id?: string; error?: string; message?: string }
      | null;

    if (!response.ok || !payload?.id) {
      return failDelete(
        response.status === 503
          ? "not_configured"
          : ((payload?.error as WildlifeErrorCode) ?? "unknown"),
        payload?.message ??
          "We couldn’t remove that report just now. Please try again.",
      );
    }

    return { ok: true, id: payload.id };
  } catch {
    return failDelete(
      "network",
      "We couldn’t remove that report just now. Please try again.",
    );
  }
}
