import { cn } from "@/lib/cn";
import {
  formatEstimatedWeight,
  formatVolunteerHours,
  formatVolunteerSessions,
} from "@/lib/cleanup-logs/format";
import type { CleanupAggregate } from "@/types/cleanup-log";

export function BeachCleanupStats({
  stats,
  loading,
  className,
}: {
  stats: CleanupAggregate | undefined;
  loading: boolean;
  className?: string;
  action?: React.ReactNode;
}) {
  if (loading) {
    return (
      <div
        className={cn("min-h-6", className ?? "mt-4")}
        aria-hidden="true"
      />
    );
  }

  if (!stats || stats.submissionCount === 0) {
    return (
      <p className={cn("text-meta", className ?? "mt-4")}>
        No clean-ups logged yet
      </p>
    );
  }

  return (
    <ul
      className={cn(
        "flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute",
        className ?? "mt-4",
      )}
    >
      <li>
        <span className="font-bold text-ink">
          {formatVolunteerHours(stats.totalVolunteerHours)}
        </span>
      </li>
      <li>{formatVolunteerSessions(stats.totalVolunteerSessions)}</li>
      <li>{formatEstimatedWeight(stats.totalEstimatedWeightKg)}</li>
    </ul>
  );
}
