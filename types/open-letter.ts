export interface OpenLetterSignaturePublic {
  id: string;
  fullName: string;
  town: string;
  signedAt: string;
}

export interface OpenLetterSignatureStats {
  /** Signatures that count toward the displayed total (not already in WhatsApp). */
  additiveCount: number;
}

export type OpenLetterErrorCode =
  | "not_configured"
  | "invalid_name"
  | "invalid_town"
  | "invalid_postcode"
  | "duplicate"
  | "network"
  | "unknown";

export type OpenLetterMutationResult =
  | {
      ok: true;
      id: string;
      countsTowardTotal: boolean;
      additiveCount: number;
    }
  | { ok: false; error: OpenLetterErrorCode; message: string };

export interface CreateOpenLetterSignatureInput {
  fullName: string;
  town: string;
  postcode: string;
  /** True if they already joined the WhatsApp group in the stated window. */
  joinedWhatsapp: boolean;
}
