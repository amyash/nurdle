import {
  emptyCleanupAggregate,
  volunteerHoursForSubmission,
} from "@/lib/cleanup-logs/format";
import type {
  CleanupAggregate,
  CleanupLog,
  CleanupStatsResponse,
} from "@/types/cleanup-log";

export function aggregateCleanupLogs(
  logs: Pick<
    CleanupLog,
    | "beachId"
    | "durationMinutes"
    | "volunteerCount"
    | "estimatedWeightKg"
  >[],
): CleanupStatsResponse {
  const byBeach: Record<string, CleanupAggregate> = {};
  const overall = emptyCleanupAggregate();

  for (const log of logs) {
    const hours = volunteerHoursForSubmission(
      log.durationMinutes,
      log.volunteerCount,
    );
    const weight = log.estimatedWeightKg ?? 0;

    if (!byBeach[log.beachId]) {
      byBeach[log.beachId] = emptyCleanupAggregate();
    }
    const beach = byBeach[log.beachId];
    beach.totalDurationMinutes += log.durationMinutes;
    beach.totalVolunteerHours += hours;
    beach.totalVolunteerSessions += log.volunteerCount;
    beach.totalEstimatedWeightKg += weight;
    beach.submissionCount += 1;

    overall.totalDurationMinutes += log.durationMinutes;
    overall.totalVolunteerHours += hours;
    overall.totalVolunteerSessions += log.volunteerCount;
    overall.totalEstimatedWeightKg += weight;
    overall.submissionCount += 1;
  }

  return {
    overall,
    byBeach,
    beachCountWithActivity: Object.keys(byBeach).length,
  };
}
