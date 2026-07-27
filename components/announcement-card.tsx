import { formatWhen } from "@/lib/dates";
import type { Announcement, AnnouncementTextPart } from "@/types";

function RichText({ parts }: { parts: AnnouncementTextPart[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <strong key={index} className="font-bold">
            {part.bold}
          </strong>
        ),
      )}
    </>
  );
}

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

      {announcement.body && announcement.body.length > 0 && (
        <div className="mt-2 space-y-2 text-base leading-snug text-[var(--alert-ink)]">
          {announcement.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      {announcement.blocks && announcement.blocks.length > 0 && (
        <div className="mt-3 space-y-3 text-[var(--alert-ink)]">
          {announcement.blocks.map((block, index) => {
            if (block.type === "lg") {
              return (
                <p
                  key={index}
                  className="text-base font-bold leading-snug"
                >
                  <RichText parts={block.parts} />
                </p>
              );
            }
            if (block.type === "md") {
              return (
                <p key={index} className="text-base font-medium leading-snug">
                  <RichText parts={block.parts} />
                </p>
              );
            }
            if (block.type === "sm") {
              return (
                <p key={index} className="text-sm leading-snug">
                  <RichText parts={block.parts} />
                </p>
              );
            }
            if (block.type === "p") {
              return (
                <p key={index} className="text-sm leading-snug">
                  <RichText parts={block.parts} />
                </p>
              );
            }
            if (block.type === "divider") {
              return (
                <hr
                  key={index}
                  className="border-0 border-t border-[var(--alert-ink)]/30"
                />
              );
            }
            if (block.type === "bullets") {
              return (
                <div key={index} className="space-y-2">
                  {block.intro && (
                    <p className="text-sm font-bold leading-snug">
                      <RichText parts={block.intro} />
                    </p>
                  )}
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-snug">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <RichText parts={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div key={index} className="space-y-2">
                <ol className="list-decimal space-y-2 pl-5 text-sm leading-snug">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <RichText parts={item} />
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      )}

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
