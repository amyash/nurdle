import type {
  MeshBagNeededType,
  MeshBagRequest,
  MeshBagStatus,
} from "@/types/mesh-bags";

export type RpcMeshBagRow = {
  id: string;
  beach_id: string;
  quantity_requested: number;
  needed_type: string;
  needed_at: string | null;
  requester_name: string | null;
  note: string | null;
  status: string;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export function mapMeshBagRow(row: RpcMeshBagRow): MeshBagRequest {
  return {
    id: row.id,
    beachId: row.beach_id,
    quantityRequested: Number(row.quantity_requested) || 0,
    neededType: row.needed_type as MeshBagNeededType,
    neededAt: row.needed_at,
    requesterName: row.requester_name,
    note: row.note,
    status: row.status as MeshBagStatus,
    deliveredAt: row.delivered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
