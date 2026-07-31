"use client";

import type { CheckinBeach } from "@/data/checkin-beaches";
import {
  collectionPointForBeach,
  collectionPointLabel,
} from "@/data/collection-points";
import { BeachCleanupStats } from "@/components/cleanup-logs/beach-cleanup-stats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclosure } from "@/components/ui/disclosure";
import { cn } from "@/lib/cn";
import {
  namedHelpingLabel,
  volunteerCountLabel,
} from "@/lib/check-in/format";
import type { CleanupAggregate } from "@/types/cleanup-log";
import type { BeachCheckinStats } from "@/types/check-in";

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

  return (
    <div className="mt-3">
      {!hasExpandableContent ? (
        <div>
          <p className="text-sm font-bold leading-snug text-ink">
            Nurdle Equipment Stations (NESTs) information:
          </p>
          <Badge quiet className="mt-1 block">
            Details coming soon
          </Badge>
        </div>
      ) : (
        <Disclosure
          summaryClassName="text-sm font-bold leading-snug text-ink"
          summary="Nurdle Equipment Stations (NESTs) information:"
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
      )}
    </div>
  );
}

export function BeachHubCard({
  beach,
  stats,
  cleanupStats,
  cleanupStatsLoading,
  isCheckedInHere,
  checkInDisabled,
  cleanupDisabled,
  busy,
  onCheckIn,
  onCheckOut,
  onExtend,
  onLogCleanup,
}: {
  beach: CheckinBeach;
  stats: BeachCheckinStats | undefined;
  cleanupStats: CleanupAggregate | undefined;
  cleanupStatsLoading: boolean;
  isCheckedInHere: boolean;
  checkInDisabled: boolean;
  cleanupDisabled: boolean;
  busy: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onExtend: () => void;
  onLogCleanup: () => void;
}) {
  const count = stats?.volunteerCount ?? 0;
  const named = namedHelpingLabel(stats?.sampleFirstName ?? null, count);
  const collectionPoint = collectionPointForBeach(beach.id);

  return (
    <Card
      padding="sm"
      className={cn(
        isCheckedInHere && "border-mark bg-mark/5 ring-2 ring-mark",
      )}
      aria-current={isCheckedInHere ? "true" : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-card-title">
            {beach.whatsappUrl ? (
              <a
                href={beach.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mark underline underline-offset-2"
              >
                {beach.name}
              </a>
            ) : (
              beach.name
            )}
          </h3>
          {!beach.whatsappUrl ? (
            <Badge quiet className="mt-1 block">
              WhatsApp link soon
            </Badge>
          ) : null}
          <p className="mt-2 text-sm font-bold text-ink">
            <span aria-hidden="true">{count > 0 ? "🟢 " : ""}</span>
            {volunteerCountLabel(count)}
          </p>
          {named ? <p className="mt-1 text-meta">{named}</p> : null}
          {collectionPoint ? (
            <p className="mt-2 text-sm leading-snug text-ink">
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
        </div>
        {isCheckedInHere ? (
          <p className="shrink-0 rounded-control bg-mark px-2 py-1 text-xs font-bold text-white">
            You’re here
          </p>
        ) : null}
      </div>

      <BeachNestSection beach={beach} />

      <BeachCleanupStats stats={cleanupStats} loading={cleanupStatsLoading} />

      {isCheckedInHere ? (
        <div className="mt-3 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={busy || cleanupDisabled}
              onClick={onLogCleanup}
              className="px-2"
            >
              Log your clean-up
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={onExtend}
              className="border-ink px-2"
            >
              Extend check-in
            </Button>
          </div>
          <Button
            variant="secondary"
            fullWidth
            disabled={busy}
            onClick={onCheckOut}
            className="border-ink"
          >
            I’ve finished — check me out
          </Button>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            disabled={busy || cleanupDisabled}
            onClick={onLogCleanup}
            className="border-ink px-2"
          >
            Log your clean-up
          </Button>
          <Button
            disabled={busy || checkInDisabled}
            onClick={onCheckIn}
            className="px-2"
          >
            Check in
          </Button>
        </div>
      )}
    </Card>
  );
}
