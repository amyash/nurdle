export interface CleanupLog {
  id: string;
  beachId: string;
  beachName: string;
  cleanupDate: string;
  durationMinutes: number;
  volunteerCount: number;
  estimatedWeightKg: number | null;
  volunteerName: string | null;
  notes: string | null;
  submittedAt: string;
}

export interface CleanupAggregate {
  totalDurationMinutes: number;
  totalVolunteerHours: number;
  totalVolunteerSessions: number;
  totalEstimatedWeightKg: number;
  submissionCount: number;
}

export interface CleanupStatsResponse {
  overall: CleanupAggregate;
  byBeach: Record<string, CleanupAggregate>;
  beachCountWithActivity: number;
}

export type CleanupLogErrorCode =
  | "not_configured"
  | "invalid_beach"
  | "beach_disabled"
  | "invalid_date"
  | "invalid_duration"
  | "invalid_volunteers"
  | "invalid_weight"
  | "invalid_name"
  | "invalid_notes"
  | "confirmation_required"
  | "network"
  | "unknown";

export type CleanupLogMutationResult =
  | { ok: true; log: CleanupLog }
  | { ok: false; error: CleanupLogErrorCode; message: string };

export interface CreateCleanupLogInput {
  beachId: string;
  cleanupDate: string;
  durationMinutes: number;
  volunteerCount: number;
  estimatedWeightKg?: number | null;
  volunteerName?: string | null;
  notes?: string | null;
  confirmedEstimate: boolean;
}
