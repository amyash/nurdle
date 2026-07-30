import type { OpenLetterSignaturePublic } from "@/types/open-letter";

export type RpcOpenLetterSignatureRow = {
  id: string;
  full_name: string;
  town: string;
  signed_at: string;
};

export type RpcOpenLetterStatsRow = {
  signature_count: number | string;
};

export function mapOpenLetterSignatureRow(
  row: RpcOpenLetterSignatureRow,
): OpenLetterSignaturePublic | null {
  if (!row.town) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    town: row.town,
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
