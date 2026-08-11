import type { ReactNode } from "react";
import {
  formatEstimatedWeight,
  formatVolunteerHours,
  formatVolunteerSessions,
} from "@/lib/cleanup-logs/format";
import type { CleanupAggregate } from "@/types/cleanup-log";

export function BeachCleanupStats({
  stats,
  loading,
  action,
}: {
  stats: CleanupAggregate | undefined;
  loading: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="mt-3 rounded-control border border-line bg-board px-2.5 py-2.5">
      <p className="text-eyebrow text-mute">Community effort since the spill</p>

      {loading ? (
        <div className="mt-1 min-h-14" aria-hidden="true" />
      ) : !stats || stats.submissionCount === 0 ? (
        <p className="mt-1 text-meta">No clean-ups logged yet</p>
      ) : (
        <ul className="mt-1 space-y-0.5 text-sm font-bold leading-snug text-ink">
          <li>{formatVolunteerHours(stats.totalVolunteerHours)}</li>
          <li>{formatVolunteerSessions(stats.totalVolunteerSessions)}</li>
          <li>{formatEstimatedWeight(stats.totalEstimatedWeightKg)}</li>
        </ul>
      )}

      {action ? <div className="mt-2.5">{action}</div> : null}
    </div>
  );
}
