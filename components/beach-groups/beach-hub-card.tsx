"use client";

import type { CheckinBeach } from "@/data/checkin-beaches";
import { beachBagSummary } from "@/lib/mesh-bags/format";
import {
  namedHelpingLabel,
  volunteerCountLabel,
} from "@/lib/check-in/format";
import type { BeachCheckinStats } from "@/types/check-in";
import type { MeshBagRequest } from "@/types/mesh-bags";

export function BeachHubCard({
  beach,
  stats,
  bagRequests,
  isCheckedInHere,
  checkInDisabled,
  bagsDisabled,
  busy,
  nowMs,
  onCheckIn,
  onCheckOut,
  onExtend,
  onRequestBags,
  onOpenBagRequests,
}: {
  beach: CheckinBeach;
  stats: BeachCheckinStats | undefined;
  bagRequests: MeshBagRequest[];
  isCheckedInHere: boolean;
  checkInDisabled: boolean;
  bagsDisabled: boolean;
  busy: boolean;
  nowMs: number;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onExtend: () => void;
  onRequestBags: () => void;
  onOpenBagRequests: () => void;
}) {
  const count = stats?.volunteerCount ?? 0;
  const named = namedHelpingLabel(stats?.sampleFirstName ?? null, count);
  const bagSummary = beachBagSummary(bagRequests, nowMs);

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
        <div className="flex shrink-0 items-center gap-1">
          {isCheckedInHere ? (
            <p className="rounded-md bg-[var(--mark)] px-2 py-1 text-xs font-bold text-white">
              You’re here
            </p>
          ) : null}
          <button
            type="button"
            disabled={busy || bagsDisabled}
            onClick={onOpenBagRequests}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-lg font-bold text-[var(--mute)] hover:bg-[var(--board)] disabled:opacity-60"
            aria-label={`Mesh bag requests for ${beach.name}`}
          >
            <span aria-hidden="true">⋯</span>
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm font-bold text-[var(--ink)]">
        <span aria-hidden="true">{count > 0 ? "🟢 " : ""}</span>
        {volunteerCountLabel(count)}
      </p>

      {named ? (
        <p className="mt-1 text-sm leading-snug text-[var(--mute)]">{named}</p>
      ) : null}

      {bagSummary.primary ? (
        <button
          type="button"
          onClick={onOpenBagRequests}
          className="mt-2 block w-full rounded-md text-left text-sm font-bold leading-snug text-[var(--ink)] underline-offset-2 hover:underline"
        >
          <span aria-hidden="true">
            {bagSummary.tone === "delivered" ? "🟢 " : "🟠 "}
          </span>
          <span>{bagSummary.primary}</span>
          {bagSummary.detail ? (
            <span className="mt-0.5 block font-normal text-[var(--mute)] no-underline">
              {bagSummary.detail}
            </span>
          ) : null}
        </button>
      ) : (
        <p className="mt-2 text-sm text-[var(--mute)]">No mesh bags requested</p>
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
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onExtend}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--mark)] px-2 py-2.5 text-center text-sm font-bold text-white disabled:opacity-60"
            >
              Extend my check-in
            </button>
            <button
              type="button"
              disabled={busy || bagsDisabled}
              onClick={onRequestBags}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--ink)] bg-white px-2 py-2.5 text-center text-sm font-bold text-[var(--ink)] disabled:opacity-60"
            >
              Request mesh bags
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy || checkInDisabled}
            onClick={onCheckIn}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--mark)] px-2 py-2.5 text-center text-sm font-bold text-white disabled:opacity-60"
          >
            Check in
          </button>
          <button
            type="button"
            disabled={busy || bagsDisabled}
            onClick={onRequestBags}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--ink)] bg-white px-2 py-2.5 text-center text-sm font-bold text-[var(--ink)] disabled:opacity-60"
          >
            Request mesh bags
          </button>
        </div>
      )}
    </article>
  );
}
