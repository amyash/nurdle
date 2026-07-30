import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { postGoogleAppsScriptWebhook } from "@/lib/google-sheets-webhook";
import {
  sanitiseOpenLetterAddress,
  sanitiseOpenLetterName,
} from "@/lib/open-letter/format";

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
      type: "open-letter-signature",
      ...payload,
    });
    if (!result.ok) {
      console.error(
        "[open-letter-signatures] Google Sheets webhook failed",
        result.status,
        result.body,
      );
    }
  } catch (error) {
    console.error("[open-letter-signatures] Google Sheets webhook error", error);
  }
}

export async function POST(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Open letter signing isn’t connected yet. Please try again later.",
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
  const consentPublic = record.consentPublic === true;

  const nameResult = sanitiseOpenLetterName(
    record.fullName == null ? null : String(record.fullName),
  );
  if (!nameResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_name",
        message:
          nameResult.reason === "too_long"
            ? "Names need to be 80 characters or fewer."
            : nameResult.reason === "too_short"
              ? "Please enter your full name."
              : "Please enter a valid name.",
      },
      { status: 400 },
    );
  }

  const addressResult = sanitiseOpenLetterAddress(
    record.address == null ? null : String(record.address),
  );
  if (!addressResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_address",
        message:
          addressResult.reason === "too_long"
            ? "Addresses need to be 300 characters or fewer."
            : addressResult.reason === "too_short"
              ? "Please enter your full address."
              : "Please enter a valid address.",
      },
      { status: 400 },
    );
  }

  if (!consentPublic) {
    return NextResponse.json(
      {
        error: "consent_required",
        message:
          "Please confirm you understand your name and address will appear publicly on this letter.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("create_open_letter_signature", {
    p_full_name: nameResult.value,
    p_address: addressResult.value,
  });

  if (error) {
    const lower = error.message.toLowerCase();
    let code = "unknown";
    let message =
      "We couldn’t save your signature just now. Please try again.";
    if (lower.includes("invalid_name")) {
      code = "invalid_name";
      message = "Please enter a valid name.";
    } else if (lower.includes("invalid_address")) {
      code = "invalid_address";
      message = "Please enter a valid address.";
    } else if (lower.includes("duplicate")) {
      code = "duplicate";
      message = "This name and address have already signed the letter.";
    }
    return NextResponse.json({ error: code, message }, { status: 400 });
  }

  const rows = (
    Array.isArray(data) ? data : data ? [data] : []
  ) as {
    id: string;
    full_name: string;
    address: string;
    signed_at: string;
  }[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json(
      {
        error: "unknown",
        message: "We couldn’t save your signature just now. Please try again.",
      },
      { status: 500 },
    );
  }

  void appendToGoogleSheet({
    id: row.id,
    signedAt: formatDateTimeForSheet(row.signed_at),
    fullName: row.full_name,
    address: row.address,
  });

  return NextResponse.json({
    id: row.id,
    signature: {
      id: row.id,
      fullName: row.full_name,
      address: row.address,
      signedAt: row.signed_at,
    },
  });
}
