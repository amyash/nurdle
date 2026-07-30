export interface OpenLetterSignaturePublic {
  id: string;
  fullName: string;
  address: string;
  signedAt: string;
}

export interface OpenLetterSignatureStats {
  signatureCount: number;
}

export type OpenLetterErrorCode =
  | "not_configured"
  | "invalid_name"
  | "invalid_address"
  | "consent_required"
  | "duplicate"
  | "network"
  | "unknown";

export type OpenLetterMutationResult =
  | { ok: true; id: string; signature: OpenLetterSignaturePublic | null }
  | { ok: false; error: OpenLetterErrorCode; message: string };

export interface CreateOpenLetterSignatureInput {
  fullName: string;
  address: string;
  consentPublic: boolean;
}
