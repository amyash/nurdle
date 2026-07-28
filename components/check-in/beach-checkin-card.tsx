"use client";

import type { CheckinBeach } from "@/data/checkin-beaches";
import {
  formatRelativeCheckinTime,
  namedHelpingLabel,
  volunteerCountLabel,
} from "@/lib/check-in/format";
import type { BeachCheckinStats } from "@/types/check-in";

export function BeachCheckinCard({
  beach,
  stats,
  isCheckedInHere,
  checkInDisabled,
  busy,
  nowMs,
  onCheckIn,
  onCheckOut,
  onExtend,
}: {
  beach: CheckinBeach;
  stats: BeachCheckinStats | undefined;
  isCheckedInHere: boolean;
  checkInDisabled: boolean;
  busy: boolean;
  nowMs: number;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onExtend: () => void;
}) {
  const count = stats?.volunteerCount ?? 0;
  const named = namedHelpingLabel(stats?.sampleFirstName ?? null, count);
  const recent = formatRelativeCheckinTime(
    stats?.latestCheckedInAt ?? null,
    nowMs,
  );

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
        <h3 className="font-bold leading-snug text-[var(--ink)]">
          {beach.name}
        </h3>
        {isCheckedInHere ? (
          <p className="shrink-0 rounded-md bg-[var(--mark)] px-2 py-1 text-xs font-bold text-white">
            You’re here
          </p>
        ) : null}
      </div>

      <p className="mt-2 text-sm font-bold text-[var(--ink)]">
        {volunteerCountLabel(count)}
      </p>

      {named ? (
        <p className="mt-1 text-sm leading-snug text-[var(--mute)]">{named}</p>
      ) : null}

      {recent ? (
        <p className="mt-1 text-sm text-[var(--mute)]">{recent}</p>
      ) : (
        <p className="mt-1 text-sm text-[var(--mute)]">
          No recent check-ins
        </p>
      )}

      {isCheckedInHere ? (
        <div className="mt-3 flex flex-col gap-2">
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
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            Extend my check-in
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy || checkInDisabled}
          onClick={onCheckIn}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          Check in here
        </button>
      )}
    </article>
  );
}
