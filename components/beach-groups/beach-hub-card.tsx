"use client";

import type { CheckinBeach } from "@/data/checkin-beaches";
import { BeachCleanupStats } from "@/components/cleanup-logs/beach-cleanup-stats";
import {
  namedHelpingLabel,
  volunteerCountLabel,
} from "@/lib/check-in/format";
import type { CleanupAggregate } from "@/types/cleanup-log";
import type { BeachCheckinStats } from "@/types/check-in";

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
            {beach.name}
          </h3>
          {beach.whatsappUrl ? (
            <a
              href={beach.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-bold text-[var(--mark)] underline underline-offset-2"
            >
              Join WhatsApp
            </a>
          ) : (
            <p className="mt-1 text-sm italic text-[var(--mute)]">
              WhatsApp link soon
            </p>
          )}
        </div>
        {isCheckedInHere ? (
          <p className="shrink-0 rounded-md bg-[var(--mark)] px-2 py-1 text-xs font-bold text-white">
            You’re here
          </p>
        ) : null}
      </div>

      <BeachCleanupStats stats={cleanupStats} loading={cleanupStatsLoading} />

      <p className="mt-2 text-sm font-bold text-[var(--ink)]">
        <span aria-hidden="true">{count > 0 ? "🟢 " : ""}</span>
        {volunteerCountLabel(count)}
      </p>

      {named ? (
        <p className="mt-1 text-sm leading-snug text-[var(--mute)]">{named}</p>
      ) : null}

      {isCheckedInHere ? (
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            disabled={busy || cleanupDisabled}
            onClick={onLogCleanup}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-2 py-2.5 text-center text-sm font-bold text-white disabled:opacity-60"
          >
            Log your clean-up
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onCheckOut}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--ink)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--ink)] disabled:opacity-60"
          >
            I’ve finished — check me out
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onExtend}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--ink)] bg-white px-2 py-2.5 text-center text-sm font-bold text-[var(--ink)] disabled:opacity-60"
          >
            Extend my check-in
          </button>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            disabled={busy || cleanupDisabled}
            onClick={onLogCleanup}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-2 py-2.5 text-center text-sm font-bold text-white disabled:opacity-60"
          >
            Log your clean-up
          </button>
          <button
            type="button"
            disabled={busy || checkInDisabled}
            onClick={onCheckIn}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--ink)] bg-white px-2 py-2.5 text-center text-sm font-bold text-[var(--ink)] disabled:opacity-60"
          >
            Check in
          </button>
        </div>
      )}
    </article>
  );
}
