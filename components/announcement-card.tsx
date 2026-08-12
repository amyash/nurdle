import Link from "next/link";
import { ContentLinkButton } from "@/components/whatsapp/content-link";
import { Disclosure } from "@/components/ui/disclosure";
import { formatWhen } from "@/lib/dates";
import type { Announcement, AnnouncementTextPart } from "@/types";

function AnnouncementHeadline({ announcement }: { announcement: Announcement }) {
  const className = "mt-2 text-card-title text-ink";

  if (announcement.headlineHref) {
    const isExternal = /^https?:\/\//.test(announcement.headlineHref);
    if (isExternal) {
      return (
        <h2 className={className}>
          <a
            href={announcement.headlineHref}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {announcement.headline}
          </a>
        </h2>
      );
    }
    return (
      <h2 className={className}>
        <Link
          href={announcement.headlineHref}
          className="underline underline-offset-2"
        >
          {announcement.headline}
        </Link>
      </h2>
    );
  }

  return <h2 className={className}>{announcement.headline}</h2>;
}

function RichText({ parts }: { parts: AnnouncementTextPart[] }) {
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <strong key={index} className="font-bold text-ink">
            {part.bold}
          </strong>
        ),
      )}
    </>
  );
}

function contentTypeLabel(announcement: Announcement): string {
  const source = announcement.sourceName?.toLowerCase() ?? "";
  if (source.includes("council") || source.includes("official")) {
    return "Official guidance";
  }
  if (source.includes("press")) return "Press";
  if (announcement.times && announcement.times.length > 0) return "Event";
  return "Community update";
}

function AnnouncementMeta({ announcement }: { announcement: Announcement }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <p className="text-eyebrow text-mark">{contentTypeLabel(announcement)}</p>
      <p className="text-meta">
        <time dateTime={announcement.datetime}>
          {formatWhen(announcement.datetime)}
        </time>
        {announcement.sourceName ? ` · ${announcement.sourceName}` : null}
      </p>
    </div>
  );
}

function AnnouncementBody({ announcement }: { announcement: Announcement }) {
  return (
    <>
      {announcement.body && announcement.body.length > 0 && (
        <div className="mt-3 space-y-3 reading-measure text-body text-mute">
          {announcement.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      {announcement.blocks && announcement.blocks.length > 0 && (
        <div className="mt-4 space-y-4 reading-measure text-mute">
          {announcement.blocks.map((block, index) => {
            if (block.type === "lg") {
              return (
                <p key={index} className="text-base font-bold leading-snug text-ink">
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
                <p key={index} className="text-body">
                  <RichText parts={block.parts} />
                </p>
              );
            }
            if (block.type === "divider") {
              return (
                <hr key={index} className="border-0 border-t border-line" />
              );
            }
            if (block.type === "bullets") {
              return (
                <div key={index} className="space-y-2">
                  {block.intro && (
                    <p className="text-sm font-bold leading-snug text-ink">
                      <RichText parts={block.intro} />
                    </p>
                  )}
                  <ul className="list-disc space-y-2 pl-5 text-body">
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
                <ol className="list-decimal space-y-2 pl-5 text-body">
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
        <ul className="mt-4 flex flex-wrap gap-2">
          {announcement.times.map((time) => (
            <li
              key={time}
              className="border border-line bg-surface px-3 py-1.5 text-sm font-bold text-ink"
            >
              {time}
            </li>
          ))}
        </ul>
      )}
      {announcement.link && (
        <p className="mt-5">
          <ContentLinkButton
            link={announcement.link}
            variant={
              "whatsappKey" in announcement.link ? "whatsapp" : "primary"
            }
          />
        </p>
      )}
    </>
  );
}

function previewText(announcement: Announcement): string | null {
  if (announcement.body?.[0]) return announcement.body[0];
  const block = announcement.blocks?.find(
    (item) => item.type === "p" || item.type === "md" || item.type === "sm",
  );
  if (block && "parts" in block) {
    return block.parts
      .map((part) => (typeof part === "string" ? part : part.bold))
      .join("");
  }
  return null;
}

export function AnnouncementCard({
  announcement,
  featured = false,
}: {
  announcement: Announcement;
  featured?: boolean;
}) {
  const preview = previewText(announcement);
  const shouldCollapse =
    announcement.expandable ||
    (!featured &&
      ((announcement.blocks?.length ?? 0) > 2 ||
        (announcement.body?.join(" ").length ?? 0) > 280));

  if (shouldCollapse) {
    return (
      <article className={featured ? "pb-2" : undefined}>
        <AnnouncementMeta announcement={announcement} />
        <AnnouncementHeadline announcement={announcement} />
        {preview && !featured ? (
          <p className="mt-3 reading-measure text-meta line-clamp-2">
            {preview}
          </p>
        ) : null}
        <Disclosure
          className="mt-3"
          summaryClassName="text-sm font-bold text-mark"
          summary="Read full update"
          defaultOpen={featured}
        >
          <AnnouncementBody announcement={announcement} />
        </Disclosure>
      </article>
    );
  }

  return (
    <article>
      <AnnouncementMeta announcement={announcement} />
      <AnnouncementHeadline announcement={announcement} />
      <AnnouncementBody announcement={announcement} />
    </article>
  );
}
