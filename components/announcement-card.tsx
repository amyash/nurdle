import { formatWhen } from "@/lib/dates";
import type { Announcement } from "@/types";

export function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <article className="rounded-lg border-2 border-[var(--alert-ink)] bg-[var(--alert)] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--alert-ink)]">
          {announcement.sourceName ?? "Announcement"}
        </p>
        <p className="text-sm font-bold text-[var(--alert-ink)]">
          <time dateTime={announcement.datetime}>
            {formatWhen(announcement.datetime)}
          </time>
        </p>
      </div>
      <h3 className="mt-2 text-lg font-bold leading-snug text-[var(--alert-ink)]">
        {announcement.headline}
      </h3>
      <div className="mt-2 space-y-2 text-base leading-snug text-[var(--alert-ink)]">
        {announcement.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {announcement.times && announcement.times.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {announcement.times.map((time) => (
            <li
              key={time}
              className="rounded-md border border-[var(--alert-ink)]/40 bg-white/50 px-3 py-1.5 text-sm font-bold text-[var(--alert-ink)]"
            >
              {time}
            </li>
          ))}
        </ul>
      )}
      {announcement.link && (
        <p className="mt-4">
          <a
            href={announcement.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-md bg-[#25D366] px-3 py-2.5 text-center text-sm font-bold text-white"
          >
            {announcement.link.label}
          </a>
        </p>
      )}
    </article>
  );
}
