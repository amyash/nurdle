export interface MeshBagDropoff {
  id: string;
  quantity: number;
  locationId: string;
  locationLabel: string;
  locationOther: string | null;
  droppedAt: string;
  submittedAt: string;
}

export type MeshBagDropoffErrorCode =
  | "not_configured"
  | "invalid_quantity"
  | "invalid_location"
  | "invalid_dropped_at"
  | "invalid_name"
  | "not_found"
  | "network"
  | "unknown";

export type MeshBagDropoffMutationResult =
  | { ok: true; dropoff: MeshBagDropoff }
  | { ok: false; error: MeshBagDropoffErrorCode; message: string };

export interface CreateMeshBagDropoffInput {
  quantity: number;
  locationId: string;
  locationLabel: string;
  locationOther?: string | null;
  droppedAt: string;
  makerName?: string | null;
}

export interface MeshBagDropoffLocationOption {
  id: string;
  label: string;
}
