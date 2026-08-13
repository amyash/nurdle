import {
  formatEstimatedWeight,
  formatVolunteerHours,
  formatVolunteerSessions,
} from "@/lib/cleanup-logs/format";
import { formatAdminEffortHours } from "@/lib/admin-time/format";
import { Stat } from "@/components/ui/stat";
import type { CleanupStatsResponse } from "@/types/cleanup-log";

function formatHoursNumber(hours: number): string {
  const rounded = Math.round(hours * 10) / 10;
  const display =
    Number.isInteger(rounded) || Math.abs(rounded - Math.round(rounded)) < 0.05
      ? String(Math.round(rounded))
      : rounded.toFixed(1);
  return Number(display).toLocaleString("en-GB");
}

export function CleanupOverallCallout({
  stats,
  adminTotalMinutes = 0,
  loading,
  activeBeachCount,
  highlight = false,
}: {
  stats: CleanupStatsResponse | null;
  adminTotalMinutes?: number;
  loading: boolean;
  activeBeachCount: number;
  /** Warm standout panel — used on the homepage. */
  highlight?: boolean;
}) {
  const panelClass = highlight
    ? "rounded-soft border border-urgent/30 bg-urgent-soft px-5 py-6 sm:px-7 sm:py-7"
    : undefined;

  if (loading) {
    return (
      <div
        className={
          highlight
            ? "min-h-28 rounded-soft border border-urgent/20 bg-urgent-soft/70"
            : "min-h-28 border-t border-line bg-surface/40"
        }
        aria-hidden="true"
      />
    );
  }

  const hasCleanup = Boolean(stats && stats.overall.submissionCount > 0);
  const hasAdmin = adminTotalMinutes > 0;

  if (!hasCleanup && !hasAdmin) {
    return (
      <div className={panelClass}>
        <p className="reading-measure text-body text-mute">
          No clean-ups logged yet. Use{" "}
          <strong className="text-ink">Log your clean-up</strong> on a beach to
          add time after you&apos;ve finished.
        </p>
      </div>
    );
  }

  const overall = stats?.overall;
  const beaches = stats?.beachCountWithActivity || activeBeachCount;
  const adminHours = adminTotalMinutes / 60;

  return (
    <div className={panelClass}>
      <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {overall && hasCleanup ? (
          <div>
            <Stat
              label="Clean-up hours"
              value={formatHoursNumber(overall.totalVolunteerHours)}
            />
            <p className="sr-only">
              {formatVolunteerHours(overall.totalVolunteerHours)}
            </p>
          </div>
        ) : null}
        {overall && hasCleanup ? (
          <div>
            <Stat
              label="Volunteer sessions"
              value={overall.totalVolunteerSessions.toLocaleString("en-GB")}
            />
            <p className="sr-only">
              {formatVolunteerSessions(overall.totalVolunteerSessions)}
            </p>
          </div>
        ) : null}
        {hasAdmin ? (
          <div>
            <Stat
              label="Organising hours"
              value={formatHoursNumber(adminHours)}
            />
            <p className="sr-only">
              {formatAdminEffortHours(adminTotalMinutes)}
            </p>
          </div>
        ) : null}
        {overall && hasCleanup ? (
          <Stat
            label="Collected (est.)"
            value={formatEstimatedWeight(overall.totalEstimatedWeightKg)
              .replace(" collected", "")
              .replace(/^~/, "~")}
          />
        ) : null}
      </dl>
      {hasCleanup ? (
        <p className="mt-6 text-meta text-urgent-ink/80">
          Across {beaches.toLocaleString("en-GB")} beach
          {beaches === 1 ? "" : "es"} with logged activity
        </p>
      ) : null}
    </div>
  );
}
