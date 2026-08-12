import Link from "next/link";
import { ContentLinkButton } from "@/components/whatsapp/content-link";
import { Callout } from "@/components/ui/callout";
import { Disclosure } from "@/components/ui/disclosure";
import { formatWhen } from "@/lib/dates";
import type { Announcement, AnnouncementTextPart } from "@/types";

function AnnouncementHeadline({ announcement }: { announcement: Announcement }) {
  const className = "mt-2 text-card-title text-alert-ink";

  if (announcement.headlineHref) {
    const isExternal = /^https?:\/\//.test(announcement.headlineHref);
    if (isExternal) {
      return (
        <h3 className={className}>
          <a
            href={announcement.headlineHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {announcement.headline}
          </a>
        </h3>
      );
    }
    return (
      <h3 className={className}>
        <Link
          href={announcement.headlineHref}
          className="underline underline-offset-2"
        >
          {announcement.headline}
        </Link>
      </h3>
    );
  }

  return <h3 className={className}>{announcement.headline}</h3>;
}

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

function AnnouncementMeta({ announcement }: { announcement: Announcement }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <p className="text-eyebrow text-alert-ink">
        {announcement.sourceName ?? "Announcement"}
      </p>
      <p className="text-sm font-bold text-alert-ink">
        <time dateTime={announcement.datetime}>
          {formatWhen(announcement.datetime)}
        </time>
      </p>
    </div>
  );
}

function AnnouncementBody({ announcement }: { announcement: Announcement }) {
  return (
    <>
      {announcement.body && announcement.body.length > 0 && (
        <div className="mt-2 space-y-2 text-body text-alert-ink">
          {announcement.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      {announcement.blocks && announcement.blocks.length > 0 && (
        <div className="mt-3 space-y-3 text-alert-ink">
          {announcement.blocks.map((block, index) => {
            if (block.type === "lg") {
              return (
                <p key={index} className="text-base font-bold leading-snug">
                  <RichText parts={block.parts} />
                </p>
              );
            }
            if (block.type === "md") {
              return (
                <p key={index} className="text-body">
                  <RichText parts={block.parts} />
                </p>
              );
            }
            if (block.type === "sm" || block.type === "p") {
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
                  className="border-0 border-t border-alert-ink/30"
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
              className="rounded-control border border-alert-ink/40 bg-white/50 px-3 py-1.5 text-sm font-bold text-alert-ink"
            >
              {time}
            </li>
          ))}
        </ul>
      )}
      {announcement.link && (
        <p className="mt-4">
          <ContentLinkButton
            link={announcement.link}
            variant={
              "whatsappKey" in announcement.link ? "whatsapp" : "primary"
            }
            fullWidth
          />
        </p>
      )}
    </>
  );
}

export function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  if (announcement.expandable) {
    return (
      <Callout tone="alert" padded={false} className="open:shadow-sm">
        <Disclosure
          summaryClassName="px-4 text-alert-ink"
          summary={
            <>
              <AnnouncementMeta announcement={announcement} />
              <AnnouncementHeadline announcement={announcement} />
              <span className="mt-1 block text-eyebrow text-alert-ink/70">
                Show full update
              </span>
            </>
          }
        >
          <div className="border-t border-alert-ink/20 px-4 pb-4">
            <AnnouncementBody announcement={announcement} />
          </div>
        </Disclosure>
      </Callout>
    );
  }

  return (
    <article>
      <Callout tone="alert">
        <AnnouncementMeta announcement={announcement} />
        <AnnouncementHeadline announcement={announcement} />
        <AnnouncementBody announcement={announcement} />
      </Callout>
    </article>
  );
}
