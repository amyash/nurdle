import type { OpenLetterSignaturePublic } from "@/types/open-letter";

export type RpcOpenLetterSignatureRow = {
  id: string;
  full_name: string;
  address: string;
  signed_at: string;
};

export type RpcOpenLetterStatsRow = {
  signature_count: number | string;
};

export function mapOpenLetterSignatureRow(
  row: RpcOpenLetterSignatureRow,
): OpenLetterSignaturePublic {
  return {
    id: row.id,
    fullName: row.full_name,
    address: row.address,
    signedAt: row.signed_at,
  };
}

export function mapOpenLetterStatsRow(
  row: RpcOpenLetterStatsRow | null | undefined,
): { signatureCount: number } {
  return {
    signatureCount: Number(row?.signature_count ?? 0),
  };
}
