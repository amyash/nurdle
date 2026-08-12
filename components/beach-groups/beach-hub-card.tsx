"use client";

import type { CheckinBeach } from "@/data/checkin-beaches";
import {
  collectionPointForBeach,
  collectionPointLabel,
} from "@/data/collection-points";
import { BeachCleanupStats } from "@/components/cleanup-logs/beach-cleanup-stats";
import { WhatsAppAccessButton } from "@/components/whatsapp/whatsapp-gate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="mt-3">
      <Disclosure
        className="rounded-control border border-line bg-board px-3 open:bg-white"
        summaryClassName="text-sm font-bold leading-snug text-ink"
        summary={
          <>
            <span className="block">
              Nurdle Equipment Stations (NESTs) information
            </span>
            <span className="mt-0.5 block text-xs font-bold text-mark group-open:hidden">
              Tap to show location &amp; equipment
            </span>
            <span className="mt-0.5 hidden text-xs font-bold text-mute group-open:block">
              Tap to hide
            </span>
          </>
        }
      >
        <div className="space-y-3 text-sm leading-snug text-ink">
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
              <p className="font-bold">Equipment</p>
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
    </div>
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
    <Card padding="sm">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 text-card-title">{beach.name}</h3>
          <WhatsAppAccessButton
            beachId={beach.id}
            label={beach.name}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-whatsapp hover:opacity-90"
          />
        </div>
      </div>

      <BeachNestSection beach={beach} />

      {collectionPoint ? (
        <p className="mt-3 text-sm leading-snug text-ink">
          Council nurdle collection point:{" "}
          {collectionPointLabel(collectionPoint)}{" "}
          <a
            href={collectionPoint.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-mark underline underline-offset-2"
          >
            Google Maps
          </a>
        </p>
      ) : null}

      <BeachCleanupStats
        stats={cleanupStats}
        loading={cleanupStatsLoading}
        action={
          <Button
            fullWidth
            disabled={busy || cleanupDisabled}
            onClick={onLogCleanup}
          >
            Log your clean-up
          </Button>
        }
      />
    </Card>
  );
}
