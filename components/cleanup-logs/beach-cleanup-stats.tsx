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
  const panelClass = cn(
    "rounded-soft border border-urgent/30 bg-urgent-soft px-4 py-3",
    className ?? "mt-4",
  );

  if (loading) {
    return (
      <div
        className={cn(panelClass, "min-h-12 border-urgent/20 bg-urgent-soft/70")}
        aria-hidden="true"
      />
    );
  }

  if (!stats || stats.submissionCount === 0) {
    return <p className={cn("text-meta", panelClass)}>No clean-ups logged yet</p>;
  }

  return (
    <ul
      className={cn(
        panelClass,
        "flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute",
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
