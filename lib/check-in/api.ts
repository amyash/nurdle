import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { sanitiseFirstName } from "@/lib/check-in/format";
import { checkinBeachById } from "@/data/checkin-beaches";
import type {
  ActiveSessionCheckin,
  BeachCheckinStats,
  CheckinErrorCode,
  CheckinMutationResult,
} from "@/types/check-in";

type RpcCheckinRow = {
  id: string;
  beach_id: string;
  first_name: string | null;
  checked_in_at: string;
  expires_at: string;
};

type RpcStatsRow = {
  beach_id: string;
  volunteer_count: number | string;
  latest_checked_in_at: string | null;
  sample_first_name: string | null;
};

function mapCheckin(row: RpcCheckinRow): ActiveSessionCheckin {
  return {
    id: row.id,
    beachId: row.beach_id,
    firstName: row.first_name,
    checkedInAt: row.checked_in_at,
    expiresAt: row.expires_at,
  };
}

function mapStats(rows: RpcStatsRow[]): BeachCheckinStats[] {
  return rows.map((row) => ({
    beachId: row.beach_id,
    volunteerCount: Number(row.volunteer_count) || 0,
    latestCheckedInAt: row.latest_checked_in_at,
    sampleFirstName: row.sample_first_name,
  }));
}

function errorFromMessage(message: string): {
  code: CheckinErrorCode;
  message: string;
} {
  const lower = message.toLowerCase();
  if (lower.includes("invalid_beach")) {
    return { code: "invalid_beach", message: "That beach isn’t available." };
  }
  if (lower.includes("beach_disabled")) {
    return {
      code: "beach_disabled",
      message: "Check-in is temporarily paused for this beach.",
    };
  }
  if (lower.includes("invalid_session")) {
    return {
      code: "invalid_session",
      message: "We couldn’t start your check-in session. Please refresh and try again.",
    };
  }
  if (lower.includes("invalid_name")) {
    return {
      code: "invalid_name",
      message: "Please use a short first name only (letters, spaces, hyphens).",
    };
  }
  if (lower.includes("not_found")) {
    return {
      code: "not_found",
      message: "We couldn’t find an active check-in for this device.",
    };
  }
  if (lower.includes("expired")) {
    return {
      code: "expired",
      message: "Your check-in has already expired. You can check in again.",
    };
  }
  return {
    code: "unknown",
    message: "Something went wrong. Please try again in a moment.",
  };
}

function fail(
  code: CheckinErrorCode,
  message: string,
): CheckinMutationResult {
  return { ok: false, error: code, message };
}

export async function fetchBeachCheckinStats(): Promise<
  | { ok: true; stats: BeachCheckinStats[] }
  | { ok: false; error: CheckinErrorCode; message: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "not_configured",
      message:
        "Volunteer check-in isn’t connected yet. Beach list is still available below.",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_beach_checkin_stats");
    if (error) {
      return {
        ok: false,
        error: "network",
        message:
          "We couldn’t load volunteer numbers right now. You can still use the beach list.",
      };
    }
    return { ok: true, stats: mapStats((data ?? []) as RpcStatsRow[]) };
  } catch {
    return {
      ok: false,
      error: "network",
      message:
        "We couldn’t reach the check-in service. Please check your connection and try again.",
    };
  }
}

export async function fetchMyActiveCheckin(
  sessionId: string,
): Promise<
  | { ok: true; checkin: ActiveSessionCheckin | null }
  | { ok: false; error: CheckinErrorCode; message: string }
> {
  if (!isSupabaseConfigured()) {
    return { ok: true, checkin: null };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_active_checkin", {
      p_session_id: sessionId,
    });
    if (error) {
      return {
        ok: false,
        error: "network",
        message: "We couldn’t load your check-in status.",
      };
    }
    const rows = (data ?? []) as RpcCheckinRow[];
    return {
      ok: true,
      checkin: rows[0] ? mapCheckin(rows[0]) : null,
    };
  } catch {
    return {
      ok: false,
      error: "network",
      message: "We couldn’t load your check-in status.",
    };
  }
}

export async function checkInVolunteer(params: {
  beachId: string;
  sessionId: string;
  firstName?: string;
}): Promise<CheckinMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Volunteer check-in isn’t connected yet. Please try again later.",
    );
  }

  if (!checkinBeachById[params.beachId]) {
    return fail("invalid_beach", "That beach isn’t available.");
  }

  const nameResult = sanitiseFirstName(params.firstName);
  if (!nameResult.ok) {
    return fail(
      "invalid_name",
      nameResult.reason === "too_long"
        ? "First names need to be 40 characters or fewer."
        : "Please use a short first name only (letters, spaces, hyphens).",
    );
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("check_in_volunteer", {
      p_beach_id: params.beachId,
      p_session_id: params.sessionId,
      p_first_name: nameResult.value,
    });

    if (error) {
      const mapped = errorFromMessage(error.message);
      return fail(mapped.code, mapped.message);
    }

    const rows = (data ?? []) as RpcCheckinRow[];
    if (!rows[0]) {
      return fail("unknown", "Check-in didn’t complete. Please try again.");
    }
    return { ok: true, checkin: mapCheckin(rows[0]) };
  } catch {
    return fail(
      "network",
      "We couldn’t complete your check-in. Please check your connection and try again.",
    );
  }
}

export async function checkOutVolunteer(
  sessionId: string,
): Promise<CheckinMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Volunteer check-in isn’t connected yet. Please try again later.",
    );
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("check_out_volunteer", {
      p_session_id: sessionId,
    });
    if (error) {
      const mapped = errorFromMessage(error.message);
      return fail(mapped.code, mapped.message);
    }
    const rows = (data ?? []) as RpcCheckinRow[];
    if (!rows[0]) {
      return fail("not_found", "We couldn’t find an active check-in for this device.");
    }
    return { ok: true, checkin: mapCheckin(rows[0]) };
  } catch {
    return fail(
      "network",
      "We couldn’t check you out. Please check your connection and try again.",
    );
  }
}

export async function extendCheckin(
  sessionId: string,
): Promise<CheckinMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Volunteer check-in isn’t connected yet. Please try again later.",
    );
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("extend_checkin", {
      p_session_id: sessionId,
    });
    if (error) {
      const mapped = errorFromMessage(error.message);
      return fail(mapped.code, mapped.message);
    }
    const rows = (data ?? []) as RpcCheckinRow[];
    if (!rows[0]) {
      return fail("expired", "Your check-in has already expired. You can check in again.");
    }
    return { ok: true, checkin: mapCheckin(rows[0]) };
  } catch {
    return fail(
      "network",
      "We couldn’t extend your check-in. Please check your connection and try again.",
    );
  }
}
