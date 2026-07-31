import {
  formatEstimatedWeight,
  formatVolunteerHours,
  formatVolunteerSessions,
} from "@/lib/cleanup-logs/format";
import type { CleanupAggregate } from "@/types/cleanup-log";

export function BeachCleanupStats({
  stats,
  loading,
}: {
  stats: CleanupAggregate | undefined;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div
        className="mt-2 min-h-18 rounded-control bg-board px-2 py-2"
        aria-hidden="true"
      />
    );
  }

  if (!stats || stats.submissionCount === 0) {
    return <p className="mt-2 text-meta">No clean-ups logged yet</p>;
  }

  return (
    <div className="mt-2 rounded-control border border-line bg-board px-2.5 py-2">
      <p className="text-eyebrow text-mute">Community effort since the spill</p>
      <ul className="mt-1 space-y-0.5 text-sm font-bold leading-snug text-ink">
        <li>{formatVolunteerHours(stats.totalVolunteerHours)}</li>
        <li>{formatVolunteerSessions(stats.totalVolunteerSessions)}</li>
        <li>{formatEstimatedWeight(stats.totalEstimatedWeightKg)}</li>
      </ul>
    </div>
  );
}
