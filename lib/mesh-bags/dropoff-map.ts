import type { MeshBagDropoff } from "@/types/mesh-bag-dropoffs";

export type RpcMeshBagDropoffRow = {
  id: string;
  quantity: number;
  location_id: string;
  location_label: string;
  location_other: string | null;
  dropped_at: string;
  maker_name?: string | null;
  submitted_at: string;
};

export function mapMeshBagDropoffRow(
  row: RpcMeshBagDropoffRow,
): MeshBagDropoff {
  return {
    id: row.id,
    quantity: row.quantity,
    locationId: row.location_id,
    locationLabel: row.location_label,
    locationOther: row.location_other,
    droppedAt: row.dropped_at,
    submittedAt: row.submitted_at,
  };
}
