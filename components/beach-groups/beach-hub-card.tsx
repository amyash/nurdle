"use client";

import type { CheckinBeach } from "@/data/checkin-beaches";
import {
  collectionPointForBeach,
  collectionPointLabel,
} from "@/data/collection-points";
import { BeachCleanupStats } from "@/components/cleanup-logs/beach-cleanup-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclosure } from "@/components/ui/disclosure";
import { whatsappCommunity } from "@/data/content";
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
  const whatsappUrl = beach.whatsappUrl?.trim() || whatsappCommunity.url;

  return (
    <Card padding="sm">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 text-card-title">{beach.name}</h3>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp group"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-whatsapp hover:opacity-90"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-current"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </a>
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
