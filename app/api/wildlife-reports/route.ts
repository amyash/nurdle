import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { checkinBeachById } from "@/data/checkin-beaches";
import { todayDateStringLondon } from "@/data/spill";
import { postGoogleAppsScriptWebhook } from "@/lib/google-sheets-webhook";
import { rejectFormGateBot } from "@/lib/form-gate/api";
import {
  WILDLIFE_COUNT_MAX,
  WILDLIFE_COUNT_MIN,
  WILDLIFE_MIN_DATE,
  animalTypeLabel,
  conditionLabel,
  isValidAnimalType,
  isValidCondition,
  isValidOptionalTime,
  isValidWildlifeDate,
  sanitiseDescription,
  sanitiseSpecies,
  sanitiseWildlifeEmail,
  sanitiseWildlifeName,
} from "@/lib/wildlife/format";

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
  payload: Record<string, string | number | boolean | null>,
) {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhook) return;

  try {
    const result = await postGoogleAppsScriptWebhook(webhook, {
      type: "wildlife-report",
      ...payload,
    });
    if (!result.ok) {
      console.error(
        "[wildlife-reports] Google Sheets webhook failed",
        result.status,
        result.body,
      );
    }
  } catch (error) {
    console.error("[wildlife-reports] Google Sheets webhook error", error);
  }
}

export async function POST(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Wildlife reporting isn’t connected yet. Please try again later.",
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

  const beachId = String(record.beachId ?? "");
  const dateObserved = String(record.dateObserved ?? "");
  const timeRaw = record.timeObserved == null ? null : String(record.timeObserved);
  const animalType = String(record.animalType ?? "");
  const count = Number(record.count);
  const condition = String(record.condition ?? "");
  const consentPublic = record.consentPublic === true;

  if (!checkinBeachById[beachId]) {
    return NextResponse.json(
      { error: "invalid_beach", message: "Choose a beach." },
      { status: 400 },
    );
  }

  if (!isValidWildlifeDate(dateObserved)) {
    const today = todayDateStringLondon();
    return NextResponse.json(
      {
        error: "invalid_date",
        message:
          dateObserved > today
            ? "Observation date can’t be in the future."
            : `Please use a date on or after ${WILDLIFE_MIN_DATE}.`,
      },
      { status: 400 },
    );
  }

  const timeObserved = timeRaw?.trim() || null;
  if (!isValidOptionalTime(timeObserved)) {
    return NextResponse.json(
      {
        error: "invalid_date",
        message: "Approximate time must be in HH:MM format.",
      },
      { status: 400 },
    );
  }

  if (!isValidAnimalType(animalType)) {
    return NextResponse.json(
      { error: "invalid_animal", message: "Choose what type of animal you saw." },
      { status: 400 },
    );
  }

  const speciesResult = sanitiseSpecies(
    record.species == null ? null : String(record.species),
  );
  if (!speciesResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_animal",
        message: "Species needs to be 80 characters or fewer.",
      },
      { status: 400 },
    );
  }

  if (
    !Number.isInteger(count) ||
    count < WILDLIFE_COUNT_MIN ||
    count > WILDLIFE_COUNT_MAX
  ) {
    return NextResponse.json(
      {
        error: "invalid_count",
        message: "Enter how many animals you observed (1–100).",
      },
      { status: 400 },
    );
  }

  if (!isValidCondition(condition)) {
    return NextResponse.json(
      {
        error: "invalid_condition",
        message: "Choose the animal’s condition.",
      },
      { status: 400 },
    );
  }

  const descriptionResult = sanitiseDescription(
    record.description == null ? null : String(record.description),
  );
  if (!descriptionResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_description",
        message:
          descriptionResult.reason === "too_long"
            ? "Description needs to be 1000 characters or fewer."
            : "Please describe what you observed.",
      },
      { status: 400 },
    );
  }

  if (typeof record.hasSupportingEvidence !== "boolean") {
    return NextResponse.json(
      {
        error: "invalid_evidence",
        message: "Tell us whether you have photos or video.",
      },
      { status: 400 },
    );
  }

  const emailResult = sanitiseWildlifeEmail(
    record.email == null ? null : String(record.email),
  );
  if (!emailResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_email",
        message:
          emailResult.reason === "too_long"
            ? "Email needs to be 120 characters or fewer."
            : "Enter a valid email address.",
      },
      { status: 400 },
    );
  }

  const nameResult = sanitiseWildlifeName(
    record.reporterName == null ? null : String(record.reporterName),
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

  if (!consentPublic) {
    return NextResponse.json(
      {
        error: "consent_required",
        message:
          "Please confirm you understand this report may be shown publicly in anonymised form.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("create_wildlife_report", {
    p_beach_id: beachId,
    p_date_observed: dateObserved,
    p_time_observed: timeObserved,
    p_animal_type: animalType,
    p_species: speciesResult.value,
    p_animal_count: count,
    p_condition: condition,
    p_description: descriptionResult.value,
    p_has_supporting_evidence: record.hasSupportingEvidence,
    p_email: emailResult.value,
    p_reporter_name: nameResult.value,
  });

  if (error) {
    const lower = error.message.toLowerCase();
    let code = "unknown";
    let message =
      "We couldn’t save your report just now. Please try again.";
    if (lower.includes("invalid_beach")) {
      code = "invalid_beach";
      message = "Choose a beach.";
    } else if (lower.includes("invalid_date")) {
      code = "invalid_date";
      message = "Check the observation date and time.";
    } else if (lower.includes("invalid_animal")) {
      code = "invalid_animal";
      message = "Choose what type of animal you saw.";
    } else if (lower.includes("invalid_count")) {
      code = "invalid_count";
      message = "Enter how many animals you observed (1–100).";
    } else if (lower.includes("invalid_condition")) {
      code = "invalid_condition";
      message = "Choose the animal’s condition.";
    } else if (lower.includes("invalid_description")) {
      code = "invalid_description";
      message = "Please describe what you observed.";
    } else if (lower.includes("invalid_email")) {
      code = "invalid_email";
      message = "Enter a valid email address.";
    } else if (lower.includes("invalid_name")) {
      code = "invalid_name";
      message = "Please use a short name only (letters, spaces, hyphens).";
    }
    return NextResponse.json({ error: code, message }, { status: 400 });
  }

  const rows = (
    Array.isArray(data) ? data : data ? [data] : []
  ) as { id: string; status: string; submitted_at: string }[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json(
      {
        error: "unknown",
        message: "We couldn’t save your report just now. Please try again.",
      },
      { status: 500 },
    );
  }

  const beach = checkinBeachById[beachId];
  void appendToGoogleSheet({
    id: row.id,
    submittedAt: formatDateTimeForSheet(row.submitted_at),
    status: row.status,
    beachId,
    beachName: beach?.name ?? beachId,
    dateObserved,
    timeObserved: timeObserved ?? "",
    animalType,
    animalTypeLabel: animalTypeLabel(animalType),
    species: speciesResult.value ?? "",
    count,
    condition,
    conditionLabel: conditionLabel(condition),
    description: descriptionResult.value,
    hasSupportingEvidence: Boolean(record.hasSupportingEvidence),
    email: emailResult.value,
    reporterName: nameResult.value ?? "",
  });

  // Public payload for immediate UI update (no PII).
  return NextResponse.json({
    id: row.id,
    status: row.status,
    report: beach
      ? {
          id: row.id,
          beachId,
          beachName: beach.name,
          dateObserved,
          timeObserved,
          animalType,
          species: speciesResult.value,
          count,
          condition,
          description: descriptionResult.value,
          hasSupportingEvidence: Boolean(record.hasSupportingEvidence),
          // Show on the public board immediately even if the DB row is still
          // pending (auto-publish migration not applied yet).
          status: "approved",
          verifiedAt: row.submitted_at,
          submittedAt: row.submitted_at,
          latitude: beach.latitude,
          longitude: beach.longitude,
        }
      : null,
  });
}

export async function DELETE(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Wildlife reporting isn’t connected yet. Please try again later.",
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
  const id = String(record.id ?? "").trim();
  const emailResult = sanitiseWildlifeEmail(
    record.email == null ? null : String(record.email),
  );

  if (!id) {
    return NextResponse.json(
      {
        error: "not_found",
        message: "That report couldn’t be found.",
      },
      { status: 404 },
    );
  }

  if (!emailResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_email",
        message: "Enter the email address used on the original report.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("remove_wildlife_report", {
    p_id: id,
    p_email: emailResult.value,
  });

  if (error) {
    const lower = error.message.toLowerCase();
    if (lower.includes("email_mismatch")) {
      return NextResponse.json(
        {
          error: "email_mismatch",
          message:
            "That email doesn’t match this report. Use the address entered when it was submitted.",
        },
        { status: 403 },
      );
    }
    if (lower.includes("not_found")) {
      return NextResponse.json(
        {
          error: "not_found",
          message: "That report couldn’t be found (it may already be removed).",
        },
        { status: 404 },
      );
    }
    if (lower.includes("invalid_email")) {
      return NextResponse.json(
        {
          error: "invalid_email",
          message: "Enter the email address used on the original report.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: "unknown",
        message:
          "We couldn’t remove that report just now. Please try again.",
      },
      { status: 400 },
    );
  }

  const rows = (data ?? []) as { id: string; removed_at: string }[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json(
      {
        error: "not_found",
        message: "That report couldn’t be found (it may already be removed).",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ id: row.id });
}
