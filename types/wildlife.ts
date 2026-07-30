export type WildlifeAnimalType =
  | "bird"
  | "fish"
  | "seal"
  | "marine_mammal"
  | "crustacean"
  | "other"
  | "unknown";

export type WildlifeCondition =
  | "alive_distress"
  | "dead"
  | "interacting_nurdles"
  | "unsure";

export type WildlifeReportStatus = "pending" | "approved" | "rejected";

export type WildlifeFilter =
  | "all"
  | "distress"
  | "dead"
  | "nurdles";

/** Public-safe report (no email, name, or exact GPS). */
export interface WildlifeReportPublic {
  id: string;
  beachId: string;
  beachName: string;
  dateObserved: string;
  timeObserved: string | null;
  animalType: WildlifeAnimalType;
  species: string | null;
  count: number;
  condition: WildlifeCondition;
  description: string;
  hasSupportingEvidence: boolean;
  status: WildlifeReportStatus;
  verifiedAt: string | null;
  submittedAt: string;
  /** Beach-level map pin only (from beach catalogue, not GPS). */
  latitude: number;
  longitude: number;
}

export interface WildlifeImpactStats {
  verifiedReports: number;
  animalsReported: number;
  speciesRecorded: number;
  awaitingReview: number;
}

export type WildlifeErrorCode =
  | "not_configured"
  | "invalid_beach"
  | "invalid_date"
  | "invalid_animal"
  | "invalid_count"
  | "invalid_condition"
  | "invalid_description"
  | "invalid_evidence"
  | "invalid_email"
  | "invalid_name"
  | "consent_required"
  | "network"
  | "unknown";

export type WildlifeMutationResult =
  | { ok: true; id: string }
  | { ok: false; error: WildlifeErrorCode; message: string };

export interface CreateWildlifeReportInput {
  beachId: string;
  dateObserved: string;
  timeObserved?: string | null;
  animalType: WildlifeAnimalType;
  species?: string | null;
  count: number;
  condition: WildlifeCondition;
  description: string;
  hasSupportingEvidence: boolean;
  email: string;
  reporterName?: string | null;
  consentPublic: boolean;
}
