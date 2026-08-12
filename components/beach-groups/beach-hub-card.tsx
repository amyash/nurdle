"use client";

import type { CheckinBeach } from "@/data/checkin-beaches";
import {
  collectionPointForBeach,
  collectionPointLabel,
} from "@/data/collection-points";
import { BeachCleanupStats } from "@/components/cleanup-logs/beach-cleanup-stats";
import { WhatsAppAccessButton } from "@/components/whatsapp/whatsapp-gate";
import { Button } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import type { CleanupAggregate } from "@/types/cleanup-log";

/** Turn bracketed or spaced UK mobile numbers into tel: links. */
function NestParagraphText({ text }: { text: string }) {
  const match = text.match(/\[?(\d{5}\s\d{6}|\d{11})\]?/);
  if (!match || match.index == null) return text;

  const phoneDisplay = match[1];
  const phoneHref = `tel:${phoneDisplay.replace(/\s/g, "")}`;
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);
  const beforeClean = before.replace(/\s+$/, " ");
  const afterClean = after.replace(/^\s+/, " ");

  return (
    <>
      {beforeClean}
      <a
        href={phoneHref}
        className="font-bold text-mark underline underline-offset-2"
      >
        {phoneDisplay}
      </a>
      {afterClean}
    </>
  );
}

function BeachNestSection({ beach }: { beach: CheckinBeach }) {
  const nest = beach.nest;
  const paragraphs =
    nest?.paragraphs?.map((item) => item.trim()).filter(Boolean) ?? [];
  const equipment = nest?.equipment?.filter((item) => item.trim()) ?? [];
  const notes = nest?.notes?.map((item) => item.trim()).filter(Boolean) ?? [];
  const equipmentIntro = nest?.equipmentIntro?.trim() || null;
  const locationLinks =
    nest?.locationLinks && nest.locationLinks.length > 0
      ? nest.locationLinks
      : nest?.mapsUrl?.trim()
        ? [{ label: "Location", url: nest.mapsUrl.trim() }]
        : [];
  const hasExpandableContent = Boolean(
    paragraphs.length > 0 ||
      equipment.length > 0 ||
      notes.length > 0 ||
      equipmentIntro ||
      locationLinks.length > 0,
  );

  if (!hasExpandableContent) return null;

  return (
    <Disclosure
      summaryClassName="text-sm font-bold text-mark"
      summary="View NEST equipment details"
    >
      <div className="space-y-3 pb-1 text-sm leading-snug text-mute">
        {locationLinks.length > 0 ? (
          <ul className="space-y-1">
            {locationLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-mark underline underline-offset-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {paragraphs.map((paragraph) => (
          <p key={paragraph}>
            <NestParagraphText text={paragraph} />
          </p>
        ))}

        {(equipmentIntro || equipment.length > 0) && (
          <div>
            <p className="font-bold text-ink">Equipment</p>
            {equipmentIntro ? (
              <p className="mt-1">{equipmentIntro}</p>
            ) : null}
            {equipment.length > 0 ? (
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                {equipment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        )}

        {notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </Disclosure>
  );
}

export function BeachHubCard({
  beach,
  cleanupStats,
  cleanupStatsLoading,
  cleanupDisabled,
  busy,
  onLogCleanup,
}: {
  beach: CheckinBeach;
  cleanupStats: CleanupAggregate | undefined;
  cleanupStatsLoading: boolean;
  cleanupDisabled: boolean;
  busy: boolean;
  onLogCleanup: () => void;
}) {
  const collectionPoint = collectionPointForBeach(beach.id);

  return (
    <article className="border-b border-line py-5 sm:py-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            {beach.name}
          </h3>
        </div>
        <WhatsAppAccessButton
          beachId={beach.id}
          label={beach.name}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line text-whatsapp hover:bg-surface"
        />
      </div>

      <div className="mt-3 space-y-3">
        <BeachCleanupStats
          stats={cleanupStats}
          loading={cleanupStatsLoading}
          className="mt-0"
        />

        {collectionPoint ? (
          <p className="text-sm text-ink">
            Collection point{" "}
            {collectionPointLabel(collectionPoint).replace(/^By /, "by ")}{" "}
            <a
              href={collectionPoint.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-mark underline underline-offset-2"
            >
              View map ↗
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        ) : null}

        <BeachNestSection beach={beach} />

        <div className="sm:max-w-xs">
          <Button
            fullWidth
            disabled={busy || cleanupDisabled}
            onClick={onLogCleanup}
          >
            Log your clean
          </Button>
        </div>
      </div>
    </article>
  );
}
