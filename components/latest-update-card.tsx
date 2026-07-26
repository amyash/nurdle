import { formatWhen } from "@/lib/dates";
import type { LatestUpdate } from "@/types";

export function LatestUpdateCard({ update }: { update: LatestUpdate }) {
  return (
    <section
      className="rounded-lg border-2 border-[var(--alert-ink)] bg-[var(--alert)] p-4"
      aria-labelledby="latest-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="latest-heading"
          className="text-sm font-bold uppercase tracking-wide text-[var(--alert-ink)]"
        >
          Latest update
        </h2>
        <p className="text-sm font-bold text-[var(--alert-ink)]">
          <time dateTime={update.datetime}>{formatWhen(update.datetime)}</time>
        </p>
      </div>
      <p className="mt-2 text-base font-medium leading-snug text-[var(--alert-ink)]">
        {update.summary}
      </p>

      <p className="mt-4 text-base font-bold text-[var(--alert-ink)]">
        {update.window}
      </p>
      <div className="mt-2 space-y-2 text-sm leading-snug text-[var(--alert-ink)]">
        {update.whyThisWeek.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <p className="mt-4 text-base font-bold leading-snug text-[var(--alert-ink)]">
        {update.callToAction}
      </p>

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[var(--alert-ink)]">
        Important — method to focus on
      </p>
      <p className="mt-1 text-sm font-medium leading-snug text-[var(--alert-ink)]">
        {update.focusMethod}
      </p>

      <p className="mt-4 border-t border-[var(--alert-ink)]/30 pt-3 text-sm font-medium leading-snug text-[var(--alert-ink)]">
        {update.closing}
      </p>
    </section>
  );
}
