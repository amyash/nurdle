import {
  formatEstimatedWeight,
  formatVolunteerHours,
  formatVolunteerSessions,
} from "@/lib/cleanup-logs/format";
import { Callout } from "@/components/ui/callout";
import type { CleanupStatsResponse } from "@/types/cleanup-log";

export function CleanupOverallCallout({
  stats,
  loading,
  activeBeachCount,
}: {
  stats: CleanupStatsResponse | null;
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

  if (!stats || stats.overall.submissionCount === 0) {
    return (
      <Callout tone="alert">
        <h2 className="text-page-title text-alert-ink">
          Community effort since the spill
        </h2>
        <p className="mt-2 text-sm leading-snug text-alert-ink">
          No clean-ups logged yet. Use <strong>Log your clean-up</strong> on a
          beach card to add time after you’ve finished.
        </p>
      </Callout>
    );
  }

  const { overall } = stats;
  const beaches = stats.beachCountWithActivity || activeBeachCount;

  return (
    <Callout tone="alert">
      <h2 className="text-page-title text-alert-ink">
        Community effort since the spill
      </h2>
      <ul className="mt-3 space-y-1 text-base font-bold leading-snug text-alert-ink">
        <li>{formatVolunteerHours(overall.totalVolunteerHours)}</li>
        <li>{formatVolunteerSessions(overall.totalVolunteerSessions)}</li>
        <li>{formatEstimatedWeight(overall.totalEstimatedWeightKg)}</li>
      </ul>
      <p className="mt-2 text-meta text-alert-ink/80">
        Across {beaches.toLocaleString("en-GB")} beach
        {beaches === 1 ? "" : "es"}
      </p>
    </Callout>
  );
}
