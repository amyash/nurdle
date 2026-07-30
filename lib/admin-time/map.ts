import type { AdminTimeLog, AdminTimeStats } from "@/types/admin-time";

export type RpcAdminTimeLogRow = {
  id: string;
  work_date: string;
  duration_minutes: number;
  category: string;
  person_name: string | null;
  notes: string | null;
  submitted_at: string;
};

export type RpcAdminTimeStatsRow = {
  total_duration_minutes: number | string;
  submission_count: number | string;
};

export function mapAdminTimeLogRow(row: RpcAdminTimeLogRow): AdminTimeLog {
  return {
    id: row.id,
    workDate: row.work_date,
    durationMinutes: row.duration_minutes,
    category: row.category,
    personName: row.person_name,
    notes: row.notes,
    submittedAt: row.submitted_at,
  };
}

export function mapAdminTimeStatsRow(
  row: RpcAdminTimeStatsRow | null | undefined,
): AdminTimeStats {
  return {
    totalDurationMinutes: Number(row?.total_duration_minutes ?? 0),
    submissionCount: Number(row?.submission_count ?? 0),
  };
}
