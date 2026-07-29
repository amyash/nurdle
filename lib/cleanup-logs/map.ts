import type { CleanupAggregate, CleanupLog } from "@/types/cleanup-log";
import { emptyCleanupAggregate } from "@/lib/cleanup-logs/format";

export type RpcCleanupLogRow = {
  id: string;
  beach_id: string;
  cleanup_date: string;
  duration_minutes: number;
  volunteer_count: number;
  estimated_weight_kg: number | string | null;
  volunteer_name: string | null;
  notes: string | null;
  submitted_at: string;
};

export type RpcCleanupStatsRow = {
  beach_id: string;
  total_duration_minutes: number | string;
  total_volunteer_hours: number | string;
  total_volunteer_sessions: number | string;
  total_estimated_weight_kg: number | string;
  submission_count: number | string;
};

export function mapCleanupLogRow(
  row: RpcCleanupLogRow,
  beachName: string,
): CleanupLog {
  return {
    id: row.id,
    beachId: row.beach_id,
    beachName,
    cleanupDate: String(row.cleanup_date).slice(0, 10),
    durationMinutes: Number(row.duration_minutes) || 0,
    volunteerCount: Number(row.volunteer_count) || 0,
    estimatedWeightKg:
      row.estimated_weight_kg == null
        ? null
        : Number(row.estimated_weight_kg),
    volunteerName: row.volunteer_name,
    notes: row.notes,
    submittedAt: row.submitted_at,
  };
}

export function mapStatsRows(rows: RpcCleanupStatsRow[]): {
  overall: CleanupAggregate;
  byBeach: Record<string, CleanupAggregate>;
  beachCountWithActivity: number;
} {
  const byBeach: Record<string, CleanupAggregate> = {};
  let overall = emptyCleanupAggregate();

  for (const row of rows) {
    const aggregate: CleanupAggregate = {
      totalDurationMinutes: Number(row.total_duration_minutes) || 0,
      totalVolunteerHours: Number(row.total_volunteer_hours) || 0,
      totalVolunteerSessions: Number(row.total_volunteer_sessions) || 0,
      totalEstimatedWeightKg: Number(row.total_estimated_weight_kg) || 0,
      submissionCount: Number(row.submission_count) || 0,
    };
    if (!row.beach_id) {
      overall = aggregate;
    } else {
      byBeach[row.beach_id] = aggregate;
    }
  }

  return {
    overall,
    byBeach,
    beachCountWithActivity: Object.keys(byBeach).length,
  };
}
