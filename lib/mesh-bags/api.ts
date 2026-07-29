import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { mapMeshBagRow, type RpcMeshBagRow } from "@/lib/mesh-bags/map";
import type {
  CreateMeshBagRequestInput,
  MeshBagErrorCode,
  MeshBagMutationResult,
  MeshBagRequest,
} from "@/types/mesh-bags";

function errorFromMessage(message: string): {
  code: MeshBagErrorCode;
  message: string;
} {
  const lower = message.toLowerCase();
  if (lower.includes("invalid_beach")) {
    return { code: "invalid_beach", message: "That beach isn’t available." };
  }
  if (lower.includes("beach_disabled")) {
    return {
      code: "beach_disabled",
      message: "Mesh bag requests are paused for this beach.",
    };
  }
  if (lower.includes("invalid_quantity")) {
    return {
      code: "invalid_quantity",
      message: "Enter how many bags are needed (1–999).",
    };
  }
  if (lower.includes("invalid_needed")) {
    return {
      code: "invalid_needed",
      message: "Choose when the bags are needed.",
    };
  }
  if (lower.includes("invalid_name")) {
    return {
      code: "invalid_name",
      message: "Please use a short name only (letters, spaces, hyphens).",
    };
  }
  if (lower.includes("invalid_note")) {
    return {
      code: "invalid_note",
      message: "Notes need to be 500 characters or fewer.",
    };
  }
  if (lower.includes("not_found")) {
    return {
      code: "not_found",
      message: "We couldn’t find that mesh bag request.",
    };
  }
  return {
    code: "unknown",
    message: "Something went wrong. Please try again in a moment.",
  };
}

function fail(
  code: MeshBagErrorCode,
  message: string,
): MeshBagMutationResult {
  return { ok: false, error: code, message };
}

export async function fetchVisibleMeshBagRequests(): Promise<
  | { ok: true; requests: MeshBagRequest[] }
  | { ok: false; error: MeshBagErrorCode; message: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "not_configured",
      message:
        "Mesh bag requests aren’t connected yet. You can still browse the beaches below.",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc(
      "list_visible_mesh_bag_requests",
    );
    if (error) {
      return {
        ok: false,
        error: "network",
        message: "We couldn’t load mesh bag requests right now.",
      };
    }
    return {
      ok: true,
      requests: ((data ?? []) as RpcMeshBagRow[]).map(mapMeshBagRow),
    };
  } catch {
    return {
      ok: false,
      error: "network",
      message: "We couldn’t reach the mesh bag service. Please try again.",
    };
  }
}

export async function createMeshBagRequest(
  input: CreateMeshBagRequestInput,
): Promise<MeshBagMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Mesh bag requests aren’t connected yet. Please try again later.",
    );
  }

  try {
    const response = await fetch("/api/mesh-bag-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beachId: input.beachId,
        quantityRequested: input.quantityRequested,
        neededType: input.neededType,
        neededAt: input.neededAt ?? null,
        requesterName: input.requesterName ?? null,
        note: input.note ?? null,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { request?: RpcMeshBagRow; error?: string; message?: string }
      | null;

    if (!response.ok || !payload?.request) {
      const mapped = errorFromMessage(
        payload?.error ?? payload?.message ?? "unknown",
      );
      return fail(
        response.status === 503 ? "not_configured" : mapped.code,
        payload?.message ?? mapped.message,
      );
    }

    return { ok: true, request: mapMeshBagRow(payload.request) };
  } catch {
    return fail(
      "network",
      "We couldn’t submit your request. Please check your connection and try again.",
    );
  }
}

export async function markMeshBagDelivered(
  id: string,
): Promise<MeshBagMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Mesh bag requests aren’t connected yet. Please try again later.",
    );
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("mark_mesh_bag_delivered", {
      p_id: id,
    });
    if (error) {
      const mapped = errorFromMessage(error.message);
      return fail(mapped.code, mapped.message);
    }
    const rows = (data ?? []) as RpcMeshBagRow[];
    if (!rows[0]) {
      return fail("not_found", "We couldn’t find that mesh bag request.");
    }
    return { ok: true, request: mapMeshBagRow(rows[0]) };
  } catch {
    return fail(
      "network",
      "We couldn’t update that request. Please try again.",
    );
  }
}

export async function cancelMeshBagRequest(
  id: string,
): Promise<MeshBagMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Mesh bag requests aren’t connected yet. Please try again later.",
    );
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("cancel_mesh_bag_request", {
      p_id: id,
    });
    if (error) {
      const mapped = errorFromMessage(error.message);
      return fail(mapped.code, mapped.message);
    }
    const rows = (data ?? []) as RpcMeshBagRow[];
    if (!rows[0]) {
      return fail("not_found", "We couldn’t find that mesh bag request.");
    }
    return { ok: true, request: mapMeshBagRow(rows[0]) };
  } catch {
    return fail(
      "network",
      "We couldn’t cancel that request. Please try again.",
    );
  }
}
