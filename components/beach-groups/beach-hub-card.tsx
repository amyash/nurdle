"use client";

import type { CheckinBeach } from "@/data/checkin-beaches";
import {
  collectionPointForBeach,
  collectionPointLabel,
} from "@/data/collection-points";
import { BeachCleanupStats } from "@/components/cleanup-logs/beach-cleanup-stats";
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
        className="font-bold text-[var(--mark)] underline underline-offset-2"
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
        <>
          <p className="text-sm font-bold leading-snug text-[var(--ink)]">
            Nurdle Equipment Stations (NESTs) information:
          </p>
          <p className="mt-1 text-sm italic leading-snug text-[var(--mute)]">
            Details coming soon
          </p>
        </>
      ) : (
        <details className="group">
          <summary className="cursor-pointer list-none py-1 text-sm font-bold leading-snug text-[var(--ink)] marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-2">
              <span>Nurdle Equipment Stations (NESTs) information:</span>
              <span
                className="shrink-0 text-lg font-bold leading-none transition group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </span>
          </summary>
          <div className="mt-2 space-y-3 text-sm leading-snug text-[var(--ink)]">
            {locationLinks.length > 0 ? (
              <ul className="space-y-1">
                {locationLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[var(--mark)] underline underline-offset-2"
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
        </details>
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
    <article
      className={`rounded-lg border px-3 py-3 ${
        isCheckedInHere
          ? "border-[var(--mark)] bg-[var(--mark)]/5 ring-2 ring-[var(--mark)]"
          : "border-[var(--line)] bg-white"
      }`}
      aria-current={isCheckedInHere ? "true" : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-snug text-[var(--ink)]">
            {beach.whatsappUrl ? (
              <a
                href={beach.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--mark)] underline underline-offset-2"
              >
                {beach.name}
              </a>
            ) : (
              beach.name
            )}
          </h3>
          {!beach.whatsappUrl ? (
            <p className="mt-1 text-sm italic text-[var(--mute)]">
              WhatsApp link soon
            </p>
          ) : null}
          <p className="mt-1 text-sm font-bold text-[var(--ink)]">
            <span aria-hidden="true">{count > 0 ? "🟢 " : ""}</span>
            {volunteerCountLabel(count)}
          </p>
          {named ? (
            <p className="mt-1 text-sm leading-snug text-[var(--mute)]">
              {named}
            </p>
          ) : null}
          {collectionPoint ? (
            <p className="mt-1 text-sm leading-snug text-[var(--ink)]">
              Council nurdle collection point:{" "}
              {collectionPointLabel(collectionPoint)}{" "}
              <a
                href={collectionPoint.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[var(--mark)] underline underline-offset-2"
              >
                Google Maps
              </a>
            </p>
          ) : null}
        </div>
        {isCheckedInHere ? (
          <p className="shrink-0 rounded-md bg-[var(--mark)] px-2 py-1 text-xs font-bold text-white">
            You’re here
          </p>
        ) : null}
      </div>

      <BeachNestSection beach={beach} />

      <BeachCleanupStats stats={cleanupStats} loading={cleanupStatsLoading} />

      {isCheckedInHere ? (
        <div className="mt-3 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy || cleanupDisabled}
              onClick={onLogCleanup}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--mark)] px-2 py-2.5 text-center text-sm font-bold text-white disabled:opacity-60"
            >
              Log your clean-up
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onExtend}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--ink)] bg-white px-2 py-2.5 text-center text-sm font-bold text-[var(--ink)] disabled:opacity-60"
            >
              Extend check-in
            </button>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onCheckOut}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--ink)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--ink)] disabled:opacity-60"
          >
            I’ve finished — check me out
          </button>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy || cleanupDisabled}
            onClick={onLogCleanup}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--mark)] px-2 py-2.5 text-center text-sm font-bold text-white disabled:opacity-60"
          >
            Log your clean-up
          </button>
          <button
            type="button"
            disabled={busy || checkInDisabled}
            onClick={onCheckIn}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--ink)] bg-white px-2 py-2.5 text-center text-sm font-bold text-[var(--ink)] disabled:opacity-60"
          >
            Check in
          </button>
        </div>
      )}
    </article>
  );
}
