export interface OpenLetterSignaturePublic {
  id: string;
  fullName: string;
  town: string;
  signedAt: string;
}

export interface OpenLetterSignatureStats {
  signatureCount: number;
}

export type OpenLetterErrorCode =
  | "not_configured"
  | "invalid_name"
  | "invalid_town"
  | "invalid_address"
  | "invalid_email"
  | "consent_required"
  | "duplicate"
  | "network"
  | "unknown";

export type OpenLetterMutationResult =
  | { ok: true; id: string; signature: OpenLetterSignaturePublic | null }
  | { ok: false; error: OpenLetterErrorCode; message: string };

export interface CreateOpenLetterSignatureInput {
  fullName: string;
  town: string;
  address: string;
  email?: string | null;
  /** When true, name and town appear on the public signatories list. */
  publishPublicly: boolean;
  consentHeld: boolean;
}
