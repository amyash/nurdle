import {
  formatEstimatedWeight,
  formatVolunteerHours,
  formatVolunteerSessions,
} from "@/lib/cleanup-logs/format";
import { formatAdminEffortHours } from "@/lib/admin-time/format";
import { Callout } from "@/components/ui/callout";
import type { CleanupStatsResponse } from "@/types/cleanup-log";

export function CleanupOverallCallout({
  stats,
  adminTotalMinutes = 0,
  loading,
  activeBeachCount,
}: {
  stats: CleanupStatsResponse | null;
  adminTotalMinutes?: number;
  loading: boolean;
  activeBeachCount: number;
}) {
  if (loading) {
    return (
      <div
        className="min-h-28 rounded-card border-2 border-alert-ink bg-alert px-4 py-4"
        aria-hidden="true"
      />
    );
  }

  const hasCleanup = Boolean(stats && stats.overall.submissionCount > 0);
  const hasAdmin = adminTotalMinutes > 0;

  if (!hasCleanup && !hasAdmin) {
    return (
      <Callout tone="alert">
        <h2 className="text-base font-bold uppercase tracking-wide text-alert-ink sm:text-lg">
          Community effort since the spill
        </h2>
        <p className="mt-2 text-sm leading-snug text-alert-ink">
          No clean-ups logged yet. Use <strong>Log your clean-up</strong> on a
          beach card to add time after you’ve finished.
        </p>
      </Callout>
    );
  }

  const overall = stats?.overall;
  const beaches = stats?.beachCountWithActivity || activeBeachCount;

  return (
    <Callout tone="alert">
      <h2 className="text-base font-bold uppercase tracking-wide text-alert-ink sm:text-lg">
        Community effort since the spill
      </h2>
      <ul className="mt-3 space-y-1 text-base font-bold leading-snug text-alert-ink">
        {overall && hasCleanup ? (
          <>
            <li>{formatVolunteerHours(overall.totalVolunteerHours)}</li>
            <li>{formatVolunteerSessions(overall.totalVolunteerSessions)}</li>
          </>
        ) : null}
        {hasAdmin ? (
          <li>{formatAdminEffortHours(adminTotalMinutes)}</li>
        ) : null}
        {overall && hasCleanup ? (
          <li>{formatEstimatedWeight(overall.totalEstimatedWeightKg)}</li>
        ) : null}
      </ul>
      {hasCleanup ? (
        <p className="mt-2 text-meta text-alert-ink/80">
          Across {beaches.toLocaleString("en-GB")} beach
          {beaches === 1 ? "" : "es"}
        </p>
      ) : null}
    </Callout>
  );
}
