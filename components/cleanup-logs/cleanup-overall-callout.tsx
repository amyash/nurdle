import {
  formatEstimatedWeight,
  formatVolunteerHours,
  formatVolunteerSessions,
} from "@/lib/cleanup-logs/format";
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
        className="min-h-[7rem] rounded-lg border border-[var(--line)] bg-white px-3 py-3"
        aria-hidden="true"
      />
    );
  }

  if (!stats || stats.overall.submissionCount === 0) {
    return (
      <aside className="rounded-lg border border-[var(--line)] bg-white px-3 py-3">
        <p className="text-sm font-bold uppercase tracking-wide text-[var(--mute)]">
          Community effort since the spill
        </p>
        <p className="mt-2 text-sm leading-snug text-[var(--mute)]">
          No clean-ups logged yet. Use <strong>Log your clean-up</strong> on a
          beach card to add time after you’ve finished.
        </p>
      </aside>
    );
  }

  const { overall } = stats;
  const beaches =
    stats.beachCountWithActivity || activeBeachCount;

  return (
    <aside className="rounded-lg border-2 border-[var(--ink)] bg-white px-3 py-3">
      <p className="text-sm font-bold uppercase tracking-wide text-[var(--mute)]">
        Community effort since the spill
      </p>
      <ul className="mt-2 space-y-1 text-base font-bold leading-snug text-[var(--ink)]">
        <li>{formatVolunteerHours(overall.totalVolunteerHours)}</li>
        <li>{formatVolunteerSessions(overall.totalVolunteerSessions)}</li>
        <li>{formatEstimatedWeight(overall.totalEstimatedWeightKg)}</li>
      </ul>
      <p className="mt-2 text-sm text-[var(--mute)]">
        Across {beaches.toLocaleString("en-GB")} beach
        {beaches === 1 ? "" : "es"}
      </p>
    </aside>
  );
}
