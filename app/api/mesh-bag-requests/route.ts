import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { checkinBeachById } from "@/data/checkin-beaches";
import {
  MESH_BAG_QUANTITY_MAX,
  sanitiseMeshBagName,
  sanitiseMeshBagNote,
} from "@/lib/mesh-bags/format";
import { mapMeshBagRow, type RpcMeshBagRow } from "@/lib/mesh-bags/map";

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

function formatNeededForSheet(params: {
  neededType: string;
  neededAt: string | null;
}): string {
  if (params.neededType === "asap" || !params.neededAt) return "ASAP";
  return formatDateTimeForSheet(params.neededAt);
}

async function appendToGoogleSheet(payload: Record<string, string>) {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhook) return;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(
        "[mesh-bag-requests] Google Sheets webhook failed",
        response.status,
        await response.text().catch(() => ""),
      );
    }
  } catch (error) {
    console.error("[mesh-bag-requests] Google Sheets webhook error", error);
  }
}

export async function POST(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Mesh bag requests aren’t connected yet. Please try again later.",
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
  const beachId = String(record.beachId ?? "");
  const quantityRequested = Number(record.quantityRequested);
  const neededType = String(record.neededType ?? "");
  const neededAtRaw = record.neededAt == null ? null : String(record.neededAt);
  const requesterNameRaw =
    record.requesterName == null ? null : String(record.requesterName);
  const noteRaw = record.note == null ? null : String(record.note);

  if (!checkinBeachById[beachId]) {
    return NextResponse.json(
      { error: "invalid_beach", message: "That beach isn’t available." },
      { status: 400 },
    );
  }

  if (
    !Number.isInteger(quantityRequested) ||
    quantityRequested < 1 ||
    quantityRequested > MESH_BAG_QUANTITY_MAX
  ) {
    return NextResponse.json(
      {
        error: "invalid_quantity",
        message: "Enter how many bags are needed (1–999).",
      },
      { status: 400 },
    );
  }

  if (neededType !== "asap" && neededType !== "scheduled") {
    return NextResponse.json(
      { error: "invalid_needed", message: "Choose when the bags are needed." },
      { status: 400 },
    );
  }

  let neededAt: string | null = null;
  if (neededType === "scheduled") {
    if (!neededAtRaw || Number.isNaN(Date.parse(neededAtRaw))) {
      return NextResponse.json(
        {
          error: "invalid_needed",
          message: "Choose a date and time for when bags are needed.",
        },
        { status: 400 },
      );
    }
    neededAt = new Date(neededAtRaw).toISOString();
  }

  const nameResult = sanitiseMeshBagName(requesterNameRaw);
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

  const noteResult = sanitiseMeshBagNote(noteRaw);
  if (!noteResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_note",
        message: "Notes need to be 500 characters or fewer.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("create_mesh_bag_request", {
    p_beach_id: beachId,
    p_quantity_requested: quantityRequested,
    p_needed_type: neededType,
    p_needed_at: neededAt,
    p_requester_name: nameResult.value,
    p_note: noteResult.value,
  });

  if (error) {
    const lower = error.message.toLowerCase();
    let code = "unknown";
    let message = "Something went wrong. Please try again in a moment.";
    if (lower.includes("invalid_beach")) {
      code = "invalid_beach";
      message = "That beach isn’t available.";
    } else if (lower.includes("beach_disabled")) {
      code = "beach_disabled";
      message = "Mesh bag requests are paused for this beach.";
    } else if (lower.includes("invalid_quantity")) {
      code = "invalid_quantity";
      message = "Enter how many bags are needed (1–999).";
    } else if (lower.includes("invalid_needed")) {
      code = "invalid_needed";
      message = "Choose when the bags are needed.";
    } else if (lower.includes("invalid_name")) {
      code = "invalid_name";
      message = "Please use a short name only (letters, spaces, hyphens).";
    } else if (lower.includes("invalid_note")) {
      code = "invalid_note";
      message = "Notes need to be 500 characters or fewer.";
    }
    return NextResponse.json({ error: code, message }, { status: 400 });
  }

  const rows = (data ?? []) as RpcMeshBagRow[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json(
      {
        error: "unknown",
        message: "Request didn’t complete. Please try again.",
      },
      { status: 500 },
    );
  }

  const beachName = checkinBeachById[beachId]?.name ?? beachId;
  const mapped = mapMeshBagRow(row);

  void appendToGoogleSheet({
    requestId: mapped.id,
    submitted: formatDateTimeForSheet(mapped.createdAt),
    beach: beachName,
    quantity: String(mapped.quantityRequested),
    needed: formatNeededForSheet({
      neededType: mapped.neededType,
      neededAt: mapped.neededAt,
    }),
    requester: mapped.requesterName ?? "",
    notes: mapped.note ?? "",
    status: mapped.status,
    claimedBy: "",
    eta: "",
    delivered: "",
  });

  return NextResponse.json({ request: row });
}
