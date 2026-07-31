import { formatWhen } from "@/lib/dates";
import { Callout } from "@/components/ui/callout";
import type { LatestUpdate } from "@/types";

export function LatestUpdateCard({ update }: { update: LatestUpdate }) {
  return (
    <Callout tone="alert" aria-labelledby="latest-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="latest-heading" className="text-eyebrow text-alert-ink">
          Latest update
        </h2>
        <p className="text-sm font-bold text-alert-ink">
          <time dateTime={update.datetime}>{formatWhen(update.datetime)}</time>
        </p>
      </div>
      <p className="mt-2 text-body text-alert-ink">{update.summary}</p>

      <p className="mt-4 text-base font-bold text-alert-ink">{update.window}</p>
      <div className="mt-2 space-y-2 text-sm leading-snug text-alert-ink">
        {update.whyThisWeek.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <p className="mt-4 text-base font-bold leading-snug text-alert-ink">
        {update.callToAction}
      </p>

      <p className="mt-4 text-eyebrow text-alert-ink">
        Important — method to focus on
      </p>
      <p className="mt-1 text-sm leading-snug text-alert-ink">
        {update.focusMethod}
      </p>

      <p className="mt-4 border-t border-alert-ink/30 pt-3 text-sm leading-snug text-alert-ink">
        {update.closing}
      </p>
    </Callout>
  );
}
