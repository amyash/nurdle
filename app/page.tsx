import Link from "next/link";
import Image from "next/image";
import { HomepageCleanupCallout } from "@/components/cleanup-logs/homepage-cleanup-callout";
import { HomepageTakeAction } from "@/components/home/homepage-take-action";
import { ScientificBriefingPanel } from "@/components/scientific-briefing";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
import {
  announcements,
  latestUpdate,
  organiserMessage,
  scientificBriefing,
} from "@/data/content";
import { formatWhen } from "@/lib/dates";

export const needLinks = [
  {
    href: "/open-letter",
    title: "Sign the open letter",
    body: "Call on the Port of Tyne to act at the source",
  },
  {
    href: "/beaches",
    title: "Find a beach clean",
    body: "Locations, volunteers, equipment and collection points",
  },
  {
    href: "/how-to-clean",
    title: "How to clean",
    body: "What to bring and safe collection methods",
  },
  {
    href: "/wildlife-impact",
    title: "Report",
    body: "Report nurdles or affected wildlife",
  },
] as const;

export default function HomePage() {
  const newest = announcements[0];

  return (
    <PageShell className="!pt-0">
      {/* Hero */}
      <section className="border-b border-line pb-10 pt-8 sm:pb-14 sm:pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-12">
          <div>
            <h1 className="text-display max-w-xl">
              The Port of Tyne
              <br />
              nurdle spill
            </h1>
            <p className="mt-5 reading-measure text-body text-mute">
              {organiserMessage.context[0]}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/beaches"
                className="inline-flex min-h-12 items-center justify-center rounded-control bg-mark px-5 text-base font-bold text-white hover:bg-mark-deep"
              >
                Find a beach clean
              </Link>
              <Link
                href="#how-to-help"
                className="inline-flex min-h-12 items-center justify-center rounded-control border border-line-strong bg-paper px-5 text-base font-bold text-ink hover:bg-surface"
              >
                How to help
              </Link>
            </div>
          </div>

          <figure className="relative aspect-[4/3] overflow-hidden bg-surface sm:aspect-[5/4]">
            <Image
              src="/nurdles-on-beach.webp"
              alt="Thousands of small white plastic pellets (nurdles) scattered across beach sand"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </figure>
        </div>
      </section>

      {/* Community response metrics */}
      <Section
        id="effort"
        title="Community response"
        showDivider={false}
        className="!pt-10"
      >
        <HomepageCleanupCallout />
      </Section>

      {/* How to help — primary site destinations */}
      <Section
        id="how-to-help"
        title="How to help"
        showDivider
        className="border-b border-line"
      >
        <ul className="grid gap-0 sm:grid-cols-2">
          {needLinks.map((item, index) => (
            <li key={item.href} className={cnNeedBorder(index)}>
              <Link
                href={item.href}
                className="group flex min-h-[7.5rem] flex-col justify-between gap-4 p-5 transition-colors hover:bg-surface sm:p-6"
              >
                <span className="text-eyebrow text-mark">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-card-title group-hover:text-mark">
                    {item.title}
                  </span>
                  <span className="mt-2 block text-meta">{item.body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Take action — campaigning */}
      <Section
        id="take-action"
        title="Take action"
        lead="Campaigning and accountability — separate from beach clean guidance."
        showDivider={false}
        className="!pt-10"
      >
        <HomepageTakeAction message={organiserMessage} />
      </Section>

      {/* Current status */}
      <section
        aria-labelledby="latest-update-heading"
        className="border-y border-line py-8 sm:py-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0 flex-1">
            <p className="text-eyebrow text-urgent">Update</p>
            <p className="mt-2 text-meta">
              <time dateTime={newest?.datetime ?? latestUpdate.datetime}>
                {formatWhen(newest?.datetime ?? latestUpdate.datetime)}
              </time>
              {newest?.sourceName ? ` · ${newest.sourceName}` : null}
            </p>
            <h2
              id="latest-update-heading"
              className="mt-2 text-section max-w-2xl"
            >
              {newest?.headline ?? latestUpdate.summary}
            </h2>
            <p className="mt-3 reading-measure text-body text-mute">
              {excerptFromAnnouncement(newest) ?? latestUpdate.summary}
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex min-h-11 shrink-0 items-center justify-center border-b border-ink pb-0.5 text-sm font-bold text-ink"
          >
            Read latest updates
          </Link>
        </div>
      </section>

      <Section id="briefing" showDivider>
        <ScientificBriefingPanel briefing={scientificBriefing} />
      </Section>
    </PageShell>
  );
}

function excerptFromAnnouncement(
  announcement: (typeof announcements)[number] | undefined,
): string | null {
  if (!announcement) return null;
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

function cnNeedBorder(index: number) {
  const borders = [
    "border border-line sm:border-r-0",
    "border border-line",
    "border border-line border-t-0 sm:border-r-0 sm:border-t-0",
    "border border-line border-t-0 sm:border-t-0",
  ];
  return borders[index] ?? "border border-line";
}
