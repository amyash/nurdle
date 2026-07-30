import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import {
  mapMeshBagDropoffRow,
  type RpcMeshBagDropoffRow,
} from "@/lib/mesh-bags/dropoff-map";
import type {
  CreateMeshBagDropoffInput,
  MeshBagDropoff,
  MeshBagDropoffErrorCode,
  MeshBagDropoffMutationResult,
} from "@/types/mesh-bag-dropoffs";

function fail(
  code: MeshBagDropoffErrorCode,
  message: string,
): MeshBagDropoffMutationResult {
  return { ok: false, error: code, message };
}

export async function fetchRecentMeshBagDropoffs(): Promise<
  | { ok: true; dropoffs: MeshBagDropoff[] }
  | { ok: false; error: MeshBagDropoffErrorCode; message: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "not_configured",
      message: "Bag drop-offs aren’t connected yet.",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("list_recent_mesh_bag_dropoffs");
    if (error) {
      return {
        ok: false,
        error: "network",
        message: "We couldn’t load bag drop-offs right now.",
      };
    }
    return {
      ok: true,
      dropoffs: ((data ?? []) as RpcMeshBagDropoffRow[]).map(
        mapMeshBagDropoffRow,
      ),
    };
  } catch {
    return {
      ok: false,
      error: "network",
      message: "We couldn’t load bag drop-offs right now.",
    };
  }
}

export async function createMeshBagDropoff(
  input: CreateMeshBagDropoffInput,
): Promise<MeshBagDropoffMutationResult> {
  if (!isSupabaseConfigured()) {
    return fail(
      "not_configured",
      "Bag drop-offs aren’t connected yet. Please try again later.",
    );
  }

  try {
    const response = await fetch("/api/mesh-bag-dropoffs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity: input.quantity,
        locationId: input.locationId,
        locationLabel: input.locationLabel,
        locationOther: input.locationOther ?? null,
        droppedAt: input.droppedAt,
        makerName: input.makerName ?? null,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { dropoff?: RpcMeshBagDropoffRow; error?: string; message?: string }
      | null;

    if (!response.ok || !payload?.dropoff) {
      return fail(
        response.status === 503
          ? "not_configured"
          : ((payload?.error as MeshBagDropoffErrorCode) ?? "unknown"),
        payload?.message ??
          "We couldn’t save the bag drop-off just now. Please try again.",
      );
    }

    return { ok: true, dropoff: mapMeshBagDropoffRow(payload.dropoff) };
  } catch {
    return fail(
      "network",
      "We couldn’t save the bag drop-off just now. Please try again.",
    );
  }
}
