import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import {
  mapAdminTimeLogRow,
  mapAdminTimeStatsRow,
  type RpcAdminTimeLogRow,
  type RpcAdminTimeStatsRow,
} from "@/lib/admin-time/map";
import type {
  AdminTimeErrorCode,
  AdminTimeMutationResult,
  AdminTimeStats,
  CreateAdminTimeLogInput,
} from "@/types/admin-time";

function fail(
  code: AdminTimeErrorCode,
  message: string,
): AdminTimeMutationResult {
  return { ok: false, error: code, message };
}

export async function fetchAdminTimeStats(): Promise<
  | { ok: true; stats: AdminTimeStats }
  | { ok: false; error: AdminTimeErrorCode; message: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "not_configured",
      message: "Admin time logging isn’t connected yet.",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_admin_time_stats");
    if (error) {
      return {
        ok: false,
        error: "network",
        message: "We couldn’t load admin time totals right now.",
      };
    }
    const rows = (data ?? []) as RpcAdminTimeStatsRow[];
    return { ok: true, stats: mapAdminTimeStatsRow(rows[0]) };
  } catch {
    return {
      ok: false,
      error: "network",
      message: "We couldn’t load admin time totals right now.",
    };
  }
}

export async function createAdminTimeLog(
  input: CreateAdminTimeLogInput,
): Promise<AdminTimeMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Admin time logging isn’t connected yet. Please try again later.",
    );
  }

  try {
    const response = await fetch("/api/admin-time-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workDate: input.workDate,
        durationMinutes: input.durationMinutes,
        category: input.category,
        personName: input.personName ?? null,
        notes: input.notes ?? null,
        formOpenedAt: input.formOpenedAt,
        company: input.company ?? "",
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { log?: RpcAdminTimeLogRow; error?: string; message?: string }
      | null;

    if (!response.ok || !payload?.log) {
      return fail(
        response.status === 503
          ? "not_configured"
          : ((payload?.error as AdminTimeErrorCode) ?? "unknown"),
        payload?.message ??
          "We couldn’t save your admin time just now. Please try again.",
      );
    }

    return { ok: true, log: mapAdminTimeLogRow(payload.log) };
  } catch {
    return fail(
      "network",
      "We couldn’t save your admin time just now. Please try again.",
    );
  }
}
