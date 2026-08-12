import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { checkinBeachById } from "@/data/checkin-beaches";
import { CLEANUP_LOG_MIN_DATE, todayDateStringLondon } from "@/data/spill";
import {
  CLEANUP_MAX_MINUTES,
  CLEANUP_MAX_VOLUNTEERS,
  CLEANUP_MIN_MINUTES,
  estimatedKgForVolume,
  sanitiseCleanupName,
  sanitiseCleanupNotes,
} from "@/lib/cleanup-logs/format";
import { postGoogleAppsScriptWebhook } from "@/lib/google-sheets-webhook";
import { rejectFormGateBot } from "@/lib/form-gate/api";
import { type RpcCleanupLogRow } from "@/lib/cleanup-logs/map";

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function formatDateTimeForSheet(iso: string): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return iso;
  return new Date(ms).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  });
}

async function appendToGoogleSheet(payload: Record<string, string | number | null>) {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhook) return;

  try {
    const result = await postGoogleAppsScriptWebhook(webhook, {
      type: "cleanup-log",
      ...payload,
    });
    if (!result.ok) {
      console.error(
        "[cleanup-logs] Google Sheets webhook failed",
        result.status,
        result.body,
      );
      return;
    }
    try {
      const parsed = JSON.parse(result.body) as {
        ok?: boolean;
        target?: string;
        version?: string;
        error?: string;
      };
      if (parsed.ok === false) {
        console.error("[cleanup-logs] Google Sheets webhook error body", parsed);
      } else {
        console.info(
          "[cleanup-logs] Google Sheets webhook ok",
          parsed.version ?? "unknown-version",
          parsed.target ?? "unknown-target",
        );
      }
    } catch {
      console.info(
        "[cleanup-logs] Google Sheets webhook responded",
        result.status,
        result.body.slice(0, 200),
      );
    }
  } catch (error) {
    console.error("[cleanup-logs] Google Sheets webhook error", error);
  }
}

export async function POST(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Clean-up logging isn’t connected yet. Please try again later.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "unknown", message: "Invalid request body." },
      { status: 400 },
    );
  }

  const record = body as Record<string, unknown>;
  const gateRejected = rejectFormGateBot(request, record);
  if (gateRejected) return gateRejected;

  if (record.confirmedEstimate !== true) {
    return NextResponse.json(
      {
        error: "confirmation_required",
        message: "Please confirm that these figures are your best estimate.",
      },
      { status: 400 },
    );
  }

  const beachId = String(record.beachId ?? "");
  const cleanupDate = String(record.cleanupDate ?? "");
  const durationMinutes = Number(record.durationMinutes);
  const volunteerCount = Number(record.volunteerCount);
  const volume = estimatedKgForVolume(
    record.collectedVolume == null ? "" : String(record.collectedVolume),
  );

  if (!checkinBeachById[beachId]) {
    return NextResponse.json(
      { error: "invalid_beach", message: "That beach isn’t available." },
      { status: 400 },
    );
  }

  const today = todayDateStringLondon();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanupDate)) {
    return NextResponse.json(
      {
        error: "invalid_date",
        message: "Choose a valid clean-up date.",
      },
      { status: 400 },
    );
  }
  if (cleanupDate > today) {
    return NextResponse.json(
      {
        error: "invalid_date",
        message: "Logged time is in the future",
      },
      { status: 400 },
    );
  }
  if (cleanupDate < CLEANUP_LOG_MIN_DATE) {
    return NextResponse.json(
      {
        error: "invalid_date",
        message: "Please log time after nurdle spill",
      },
      { status: 400 },
    );
  }

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes < CLEANUP_MIN_MINUTES ||
    durationMinutes > CLEANUP_MAX_MINUTES
  ) {
    return NextResponse.json(
      {
        error: "invalid_duration",
        message: "Time spent must be between 15 minutes and 12 hours.",
      },
      { status: 400 },
    );
  }

  if (
    !Number.isInteger(volunteerCount) ||
    volunteerCount < 1 ||
    volunteerCount > CLEANUP_MAX_VOLUNTEERS
  ) {
    return NextResponse.json(
      {
        error: "invalid_volunteers",
        message: "Enter how many people this clean-up included (1–100).",
      },
      { status: 400 },
    );
  }

  if (!volume.ok) {
    return NextResponse.json(
      {
        error: "invalid_volume",
        message: "Please choose how much you collected.",
      },
      { status: 400 },
    );
  }

  const nameResult = sanitiseCleanupName(
    record.volunteerName == null ? null : String(record.volunteerName),
  );
  if (!nameResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_name",
        message:
          nameResult.reason === "too_long"
            ? "Names need to be 40 characters or fewer."
            : "Please use a short name only (letters, spaces, hyphens).",
      },
      { status: 400 },
    );
  }

  const notesResult = sanitiseCleanupNotes(
    record.notes == null ? null : String(record.notes),
  );
  if (!notesResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_notes",
        message: "Notes need to be 300 characters or fewer.",
      },
      { status: 400 },
    );
  }

  const weightForDb = volume.kg;

  const { data, error } = await supabase.rpc("create_cleanup_log", {
    p_beach_id: beachId,
    p_cleanup_date: cleanupDate,
    p_duration_minutes: durationMinutes,
    p_volunteer_count: volunteerCount,
    p_estimated_weight_kg: weightForDb,
    p_volunteer_name: nameResult.value,
    p_notes: notesResult.value,
  });

  if (error) {
    const lower = error.message.toLowerCase();
    let code = "unknown";
    let message = "We couldn’t save your clean-up just now. Please try again.";
    if (lower.includes("invalid_beach")) {
      code = "invalid_beach";
      message = "That beach isn’t available.";
    } else if (lower.includes("beach_disabled")) {
      code = "beach_disabled";
      message = "Clean-up logging is paused for this beach.";
    } else if (lower.includes("invalid_date")) {
      code = "invalid_date";
      message = "Please log time after nurdle spill";
    } else if (lower.includes("invalid_duration")) {
      code = "invalid_duration";
      message = "Time spent must be between 15 minutes and 12 hours.";
    } else if (lower.includes("invalid_volunteers")) {
      code = "invalid_volunteers";
      message = "Enter how many people this clean-up included (1–100).";
    } else if (lower.includes("invalid_weight") || lower.includes("invalid_volume")) {
      code = "invalid_volume";
      message = "Please choose how much you collected.";
    } else if (lower.includes("invalid_name")) {
      code = "invalid_name";
      message = "Please use a short name only (letters, spaces, hyphens).";
    } else if (lower.includes("invalid_notes")) {
      code = "invalid_notes";
      message = "Notes need to be 300 characters or fewer.";
    }
    return NextResponse.json({ error: code, message }, { status: 400 });
  }

  const rows = (data ?? []) as RpcCleanupLogRow[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json(
      {
        error: "unknown",
        message: "We couldn’t save your clean-up just now. Please try again.",
      },
      { status: 500 },
    );
  }

  const beachName = checkinBeachById[beachId]?.name ?? beachId;

  void appendToGoogleSheet({
    id: row.id,
    submittedAt: formatDateTimeForSheet(row.submitted_at),
    cleanupDate: String(row.cleanup_date).slice(0, 10),
    beachId: row.beach_id,
    beachName,
    durationMinutes: row.duration_minutes,
    volunteerCount: row.volunteer_count,
    collectedVolume: volume.label,
    estimatedWeightKg: row.estimated_weight_kg,
    volunteerName: row.volunteer_name ?? "",
    notes: row.notes ?? "",
  });

  return NextResponse.json({ log: row });
}
