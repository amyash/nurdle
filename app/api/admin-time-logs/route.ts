import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { todayDateStringLondon } from "@/data/spill";
import {
  ADMIN_TIME_MAX_MINUTES,
  ADMIN_TIME_MIN_MINUTES,
  categoryLabel,
  isValidAdminTimeCategory,
  isValidAdminWorkDate,
  sanitiseAdminName,
  sanitiseAdminNotes,
} from "@/lib/admin-time/format";
import { type RpcAdminTimeLogRow } from "@/lib/admin-time/map";
import { postGoogleAppsScriptWebhook } from "@/lib/google-sheets-webhook";
import { rejectFormGateBot } from "@/lib/form-gate/api";

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

async function appendToGoogleSheet(
  payload: Record<string, string | number | null>,
) {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhook) return;

  try {
    const result = await postGoogleAppsScriptWebhook(webhook, {
      type: "admin-time-log",
      ...payload,
    });
    if (!result.ok) {
      console.error(
        "[admin-time-logs] Google Sheets webhook failed",
        result.status,
        result.body,
      );
    }
  } catch (error) {
    console.error("[admin-time-logs] Google Sheets webhook error", error);
  }
}

export async function POST(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Admin time logging isn’t connected yet. Please try again later.",
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

  const workDate = String(record.workDate ?? "");
  const durationMinutes = Number(record.durationMinutes);
  const category = String(record.category ?? "");

  if (!isValidAdminWorkDate(workDate)) {
    const today = todayDateStringLondon();
    return NextResponse.json(
      {
        error: "invalid_date",
        message:
          workDate > today
            ? "Logged time is in the future"
            : "Please log time on or after the spill date",
      },
      { status: 400 },
    );
  }

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes < ADMIN_TIME_MIN_MINUTES ||
    durationMinutes > ADMIN_TIME_MAX_MINUTES
  ) {
    return NextResponse.json(
      {
        error: "invalid_duration",
        message: "Time spent must be between 15 minutes and 12 hours.",
      },
      { status: 400 },
    );
  }

  if (!isValidAdminTimeCategory(category)) {
    return NextResponse.json(
      {
        error: "invalid_category",
        message: "Choose what this admin time was for.",
      },
      { status: 400 },
    );
  }

  const nameResult = sanitiseAdminName(
    record.personName == null ? null : String(record.personName),
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

  const notesResult = sanitiseAdminNotes(
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

  const { data, error } = await supabase.rpc("create_admin_time_log", {
    p_work_date: workDate,
    p_duration_minutes: durationMinutes,
    p_category: category,
    p_person_name: nameResult.value,
    p_notes: notesResult.value,
  });

  if (error) {
    const lower = error.message.toLowerCase();
    let code = "unknown";
    let message =
      "We couldn’t save your admin time just now. Please try again.";
    if (lower.includes("invalid_date")) {
      code = "invalid_date";
      message = "Please log time on or after the spill date";
    } else if (lower.includes("invalid_duration")) {
      code = "invalid_duration";
      message = "Time spent must be between 15 minutes and 12 hours.";
    } else if (lower.includes("invalid_category")) {
      code = "invalid_category";
      message = "Choose what this admin time was for.";
    } else if (lower.includes("invalid_name")) {
      code = "invalid_name";
      message = "Please use a short name only (letters, spaces, hyphens).";
    } else if (lower.includes("invalid_notes")) {
      code = "invalid_notes";
      message = "Notes need to be 300 characters or fewer.";
    }
    return NextResponse.json({ error: code, message }, { status: 400 });
  }

  const rows = (data ?? []) as RpcAdminTimeLogRow[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json(
      {
        error: "unknown",
        message:
          "We couldn’t save your admin time just now. Please try again.",
      },
      { status: 500 },
    );
  }

  void appendToGoogleSheet({
    id: row.id,
    submittedAt: formatDateTimeForSheet(row.submitted_at),
    workDate: row.work_date,
    durationMinutes: row.duration_minutes,
    category: row.category,
    categoryLabel: categoryLabel(row.category),
    personName: row.person_name ?? "",
    notes: row.notes ?? "",
  });

  return NextResponse.json({ log: row });
}
