export type MeshBagNeededType = "asap" | "scheduled";
export type MeshBagStatus = "requested" | "delivered" | "cancelled";

export interface MeshBagRequest {
  id: string;
  beachId: string;
  quantityRequested: number;
  neededType: MeshBagNeededType;
  neededAt: string | null;
  requesterName: string | null;
  note: string | null;
  status: MeshBagStatus;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MeshBagErrorCode =
  | "not_configured"
  | "invalid_beach"
  | "beach_disabled"
  | "invalid_quantity"
  | "invalid_needed"
  | "invalid_name"
  | "invalid_note"
  | "not_found"
  | "network"
  | "unknown";

export type MeshBagMutationResult =
  | { ok: true; request: MeshBagRequest }
  | { ok: false; error: MeshBagErrorCode; message: string };

export interface CreateMeshBagRequestInput {
  beachId: string;
  quantityRequested: number;
  neededType: MeshBagNeededType;
  neededAt?: string | null;
  requesterName?: string | null;
  note?: string | null;
}
