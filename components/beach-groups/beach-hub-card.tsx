"use client";

import {
  NORTHUMBERLAND_DROPOFF_MAP_URL,
  NORTHUMBERLAND_NURDLE_COLLECTION_URL,
  type CheckinBeach,
} from "@/data/checkin-beaches";
import {
  collectionPointForBeach,
  collectionPointLabel,
} from "@/data/collection-points";
import { BeachCleanupStats } from "@/components/cleanup-logs/beach-cleanup-stats";
import { WhatsAppAccessButton } from "@/components/whatsapp/whatsapp-gate";
import { Button } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import type { CleanupAggregate } from "@/types/cleanup-log";

/** Turn markdown links and UK mobile numbers in NEST copy into anchors. */
function NestParagraphText({ text }: { text: string }) {
  const pattern =
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\[?(\d{5}\s\d{6}|\d{11})\]?/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let found = false;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    const label = match[1];
    const href = match[2];
    const phone = match[3];
    let before = text.slice(lastIndex, start);

    if (phone) before = before.replace(/\s+$/, " ");
    if (before) nodes.push(before);

    if (label && href) {
      nodes.push(
        <a
          key={`${href}-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-mark underline underline-offset-2"
        >
          {label}
        </a>,
      );
    } else if (phone) {
      nodes.push(
        <a
          key={`tel-${start}`}
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="font-bold text-mark underline underline-offset-2"
        >
          {phone}
        </a>,
      );
      const afterSpaces = text.slice(start + match[0].length).match(/^\s+/);
      if (afterSpaces) {
        nodes.push(" ");
        lastIndex = start + match[0].length + afterSpaces[0].length;
        found = true;
        continue;
      }
    }

    lastIndex = start + match[0].length;
    found = true;
  }

  if (!found) return text;

  const tail = text.slice(lastIndex);
  if (tail) nodes.push(tail);
  return <>{nodes}</>;
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

        {beach.councilDropoffs && beach.councilDropoffs.length > 0 ? (
          <div className="text-sm text-ink">
            <p>
              Northumberland Council nurdle collection. Leave collected nurdles
              at these drop-off points.{" "}
              <a
                href={NORTHUMBERLAND_NURDLE_COLLECTION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-mark underline underline-offset-2"
              >
                Council guidance ↗
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
              {beach.councilDropoffs.map((point) => (
                <li key={point.w3wUrl}>
                  {point.name}{" "}
                  <a
                    href={point.w3wUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-mark underline underline-offset-2"
                  >
                    what3words ↗
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-1.5">
              <a
                href={NORTHUMBERLAND_DROPOFF_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-mark underline underline-offset-2"
              >
                Map of drop-off points ↗
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
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
