export interface AdminTimeLog {
  id: string;
  workDate: string;
  durationMinutes: number;
  category: string;
  personName: string | null;
  notes: string | null;
  submittedAt: string;
}

export interface AdminTimeStats {
  totalDurationMinutes: number;
  submissionCount: number;
}

export type AdminTimeErrorCode =
  | "not_configured"
  | "invalid_date"
  | "invalid_duration"
  | "invalid_category"
  | "invalid_name"
  | "invalid_notes"
  | "network"
  | "unknown";

export type AdminTimeMutationResult =
  | { ok: true; log: AdminTimeLog }
  | { ok: false; error: AdminTimeErrorCode; message: string };

export interface CreateAdminTimeLogInput {
  workDate: string;
  durationMinutes: number;
  category: string;
  personName?: string | null;
  notes?: string | null;
  formOpenedAt: number;
  company?: string;
}
