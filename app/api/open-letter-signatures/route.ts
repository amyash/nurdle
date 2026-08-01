import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { postGoogleAppsScriptWebhook } from "@/lib/google-sheets-webhook";
import {
  sanitiseOpenLetterName,
  sanitiseOpenLetterPostcode,
  sanitiseOpenLetterTown,
} from "@/lib/open-letter/format";

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function appendToGoogleSheet(payload: Record<string, string | number | boolean | null>) {
  // Dedicated open-letter webhook only (not cleanup / mesh-bag).
  const webhook = process.env.GOOGLE_SHEETS_OPEN_LETTER_WEBHOOK_URL?.trim();
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
      return;
    }
    try {
      const parsed = JSON.parse(result.body) as {
        ok?: boolean;
        error?: string;
      };
      if (parsed.ok === false) {
        console.error(
          "[open-letter-signatures] Google Sheets webhook error body",
          parsed,
        );
      }
    } catch {
      /* ignore non-JSON */
    }
  } catch (error) {
    console.error("[open-letter-signatures] Google Sheets webhook error", error);
  }
}

export async function GET() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json(
      { additiveCount: 0, error: "not_configured" },
      { status: 200 },
    );
  }

  const { data, error } = await supabase.rpc("get_open_letter_additive_count");
  if (error) {
    console.error("[open-letter-signatures] stats failed", error);
    return NextResponse.json(
      { additiveCount: 0, error: "network" },
      { status: 200 },
    );
  }

  const additiveCount = Number(data ?? 0) || 0;
  return NextResponse.json({ additiveCount });
}

export async function POST(request: Request) {
  const supabase = getServiceSupabase();
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
  const nameResult = sanitiseOpenLetterName(
    typeof record.fullName === "string" ? record.fullName : null,
  );
  if (!nameResult.ok) {
    return NextResponse.json(
      { error: "invalid_name", message: "Enter your name." },
      { status: 400 },
    );
  }

  const townResult = sanitiseOpenLetterTown(
    typeof record.town === "string" ? record.town : null,
  );
  if (!townResult.ok) {
    return NextResponse.json(
      { error: "invalid_town", message: "Enter your town." },
      { status: 400 },
    );
  }

  const postcodeResult = sanitiseOpenLetterPostcode(
    typeof record.postcode === "string" ? record.postcode : null,
  );
  if (!postcodeResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_postcode",
        message: "Enter a valid UK postcode.",
      },
      { status: 400 },
    );
  }

  const joinedWhatsapp = record.joinedWhatsapp === true;

  const { data, error } = await supabase.rpc("sign_open_letter_v2", {
    p_full_name: nameResult.value,
    p_town: townResult.value,
    p_postcode: postcodeResult.value,
    p_joined_whatsapp: joinedWhatsapp,
  });

  if (error) {
    const message = error.message ?? "";
    let code = "unknown";
    let userMessage =
      "We couldn’t save your signature just now. Please try again.";
    if (message.includes("invalid_name")) {
      code = "invalid_name";
      userMessage = "Enter your name.";
    } else if (message.includes("invalid_town")) {
      code = "invalid_town";
      userMessage = "Enter your town.";
    } else if (message.includes("invalid_postcode")) {
      code = "invalid_postcode";
      userMessage = "Enter a valid UK postcode.";
    } else if (message.includes("duplicate")) {
      code = "duplicate";
      userMessage =
        "It looks like you’ve already signed with this name and postcode.";
    }
    console.error("[open-letter-signatures] sign failed", error);
    return NextResponse.json(
      { error: code, message: userMessage },
      { status: 400 },
    );
  }

  const rows = (data ?? []) as {
    id: string;
    signed_at: string;
    joined_whatsapp: boolean;
    additive_count: number | string;
  }[];
  const row = rows[0];
  if (!row?.id) {
    return NextResponse.json(
      {
        error: "unknown",
        message: "We couldn’t save your signature just now. Please try again.",
      },
      { status: 500 },
    );
  }

  // Re-read additive count so WhatsApp-window signatures never inflate the total,
  // even if the insert-returning payload is odd-shaped.
  const { data: additiveData, error: additiveError } = await supabase.rpc(
    "get_open_letter_additive_count",
  );
  if (additiveError) {
    console.error(
      "[open-letter-signatures] additive recount failed",
      additiveError,
    );
  }
  const additiveCount =
    Number(additiveData ?? row.additive_count ?? 0) || 0;
  const signedAt = row.signed_at;

  // Must await — on Vercel, returning early kills the webhook fetch.
  await appendToGoogleSheet({
    id: row.id,
    signedAt,
    fullName: nameResult.value,
    town: townResult.value,
    postcode: postcodeResult.value,
    joinedWhatsapp: joinedWhatsapp ? "yes" : "no",
  });

  return NextResponse.json({
    id: row.id,
    countsTowardTotal: !joinedWhatsapp,
    additiveCount,
    signedAt,
  });
}
