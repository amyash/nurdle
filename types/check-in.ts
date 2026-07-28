export interface BeachCheckinStats {
  beachId: string;
  volunteerCount: number;
  latestCheckedInAt: string | null;
  sampleFirstName: string | null;
}

export interface ActiveSessionCheckin {
  id: string;
  beachId: string;
  firstName: string | null;
  checkedInAt: string;
  expiresAt: string;
}

export type CheckinMutationResult =
  | { ok: true; checkin: ActiveSessionCheckin }
  | { ok: false; error: CheckinErrorCode; message: string };

export type CheckinErrorCode =
  | "not_configured"
  | "invalid_beach"
  | "beach_disabled"
  | "invalid_session"
  | "invalid_name"
  | "not_found"
  | "expired"
  | "network"
  | "unknown";
