import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { postGoogleAppsScriptWebhook } from "@/lib/google-sheets-webhook";
import {
  MESH_BAG_DROPOFF_QUANTITY_MAX,
  meshBagDropoffLocations,
  sanitiseMakerName,
  sanitiseOtherLocation,
} from "@/lib/mesh-bags/dropoff-format";
import { type RpcMeshBagDropoffRow } from "@/lib/mesh-bags/dropoff-map";

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
      type: "mesh-bag-dropoff",
      ...payload,
    });
    if (!result.ok) {
      console.error(
        "[mesh-bag-dropoffs] Google Sheets webhook failed",
        result.status,
        result.body,
      );
    }
  } catch (error) {
    console.error("[mesh-bag-dropoffs] Google Sheets webhook error", error);
  }
}

export async function POST(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Bag drop-offs aren’t connected yet. Please try again later.",
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
  const quantity = Number(record.quantity);
  const locationId = String(record.locationId ?? "");
  const locationLabelRaw = String(record.locationLabel ?? "");
  const droppedAtRaw = String(record.droppedAt ?? "");

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MESH_BAG_DROPOFF_QUANTITY_MAX
  ) {
    return NextResponse.json(
      {
        error: "invalid_quantity",
        message: "Enter how many bags you dropped off (1–500).",
      },
      { status: 400 },
    );
  }

  const locations = meshBagDropoffLocations();
  const selected = locations.find((item) => item.id === locationId);
  if (!selected) {
    return NextResponse.json(
      {
        error: "invalid_location",
        message: "Choose where the bags were dropped off.",
      },
      { status: 400 },
    );
  }

  const otherResult = sanitiseOtherLocation(
    record.locationOther == null ? null : String(record.locationOther),
  );
  if (!otherResult.ok) {
    return NextResponse.json(
      {
        error: "invalid_location",
        message:
          otherResult.reason === "too_long"
            ? "Other location needs to be 80 characters or fewer."
            : "Enter the other location.",
      },
      { status: 400 },
    );
  }

  if (locationId === "other" && !otherResult.value) {
    return NextResponse.json(
      {
        error: "invalid_location",
        message: "Enter the other location.",
      },
      { status: 400 },
    );
  }

  const locationLabel =
    locationId === "other"
      ? otherResult.value!
      : locationLabelRaw.trim() || selected.label;

  const droppedMs = Date.parse(droppedAtRaw);
  if (Number.isNaN(droppedMs)) {
    return NextResponse.json(
      {
        error: "invalid_dropped_at",
        message: "Choose when the bags were dropped off.",
      },
      { status: 400 },
    );
  }
  const now = Date.now();
  if (droppedMs > now + 5 * 60 * 1000) {
    return NextResponse.json(
      {
        error: "invalid_dropped_at",
        message: "Drop-off time can’t be in the future.",
      },
      { status: 400 },
    );
  }
  if (droppedMs < now - 7 * 24 * 60 * 60 * 1000) {
    return NextResponse.json(
      {
        error: "invalid_dropped_at",
        message: "Drop-off time can’t be more than 7 days ago.",
      },
      { status: 400 },
    );
  }

  const nameResult = sanitiseMakerName(
    record.makerName == null ? null : String(record.makerName),
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

  const { data, error } = await supabase.rpc("create_mesh_bag_dropoff", {
    p_quantity: quantity,
    p_location_id: locationId,
    p_location_label: locationLabel,
    p_location_other: locationId === "other" ? otherResult.value : null,
    p_dropped_at: new Date(droppedMs).toISOString(),
    p_maker_name: nameResult.value,
  });

  if (error) {
    const lower = error.message.toLowerCase();
    let code = "unknown";
    let message =
      "We couldn’t save the bag drop-off just now. Please try again.";
    if (lower.includes("invalid_quantity")) {
      code = "invalid_quantity";
      message = "Enter how many bags you dropped off (1–500).";
    } else if (lower.includes("invalid_location")) {
      code = "invalid_location";
      message = "Choose where the bags were dropped off.";
    } else if (lower.includes("invalid_dropped_at")) {
      code = "invalid_dropped_at";
      message = "Choose when the bags were dropped off.";
    } else if (lower.includes("invalid_name")) {
      code = "invalid_name";
      message = "Please use a short name only (letters, spaces, hyphens).";
    }
    return NextResponse.json({ error: code, message }, { status: 400 });
  }

  const rows = (data ?? []) as RpcMeshBagDropoffRow[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json(
      {
        error: "unknown",
        message:
          "We couldn’t save the bag drop-off just now. Please try again.",
      },
      { status: 500 },
    );
  }

  void appendToGoogleSheet({
    id: row.id,
    submittedAt: formatDateTimeForSheet(row.submitted_at),
    quantity: row.quantity,
    locationId: row.location_id,
    locationLabel: row.location_label,
    locationOther: row.location_other ?? "",
    droppedAt: formatDateTimeForSheet(row.dropped_at),
    makerName: row.maker_name ?? "",
  });

  return NextResponse.json({ dropoff: row });
}

export async function DELETE(request: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Bag drop-offs aren’t connected yet. Please try again later.",
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

  const id = String((body as Record<string, unknown>).id ?? "").trim();
  if (!id) {
    return NextResponse.json(
      {
        error: "not_found",
        message: "That bag drop-off couldn’t be found.",
      },
      { status: 404 },
    );
  }

  const { data, error } = await supabase.rpc("remove_mesh_bag_dropoff", {
    p_id: id,
  });

  if (error) {
    const lower = error.message.toLowerCase();
    if (lower.includes("not_found")) {
      return NextResponse.json(
        {
          error: "not_found",
          message: "That bag drop-off couldn’t be found (it may already be gone).",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        error: "unknown",
        message:
          "We couldn’t remove that bag drop-off just now. Please try again.",
      },
      { status: 400 },
    );
  }

  const rows = (data ?? []) as RpcMeshBagDropoffRow[];
  const row = rows[0];
  if (!row) {
    return NextResponse.json(
      {
        error: "not_found",
        message: "That bag drop-off couldn’t be found (it may already be gone).",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ dropoff: row });
}
