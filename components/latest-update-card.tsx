import { formatWhen } from "@/lib/dates";
import type { LatestUpdate } from "@/types";

export function LatestUpdateCard({ update }: { update: LatestUpdate }) {
  return (
    <article aria-labelledby="latest-heading">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-eyebrow text-urgent">Earlier guidance</p>
        <p className="text-meta">
          <time dateTime={update.datetime}>{formatWhen(update.datetime)}</time>
          {update.source ? ` · ${update.source}` : null}
        </p>
      </div>
      <h2 id="latest-heading" className="mt-3 text-section">
        {update.window}
      </h2>
      <p className="mt-3 reading-measure text-body text-mute">{update.summary}</p>

      <div className="mt-5 space-y-3 reading-measure text-body text-mute">
        {update.whyThisWeek.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <p className="mt-5 reading-measure text-body font-bold text-ink">
        {update.callToAction}
      </p>

      <p className="mt-6 text-eyebrow text-mark">
        Important — method to focus on
      </p>
      <p className="mt-2 reading-measure text-body text-mute">
        {update.focusMethod}
      </p>

      <p className="mt-6 border-t border-line pt-4 reading-measure text-meta">
        {update.closing}
      </p>
    </article>
  );
}
