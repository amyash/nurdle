"use client";

import type { CollectionPoint } from "@/data/collection-points";
import { directionsUrl } from "@/data/collection-points";

export function CollectionPointCard({
  point,
  onViewOnMap,
}: {
  point: CollectionPoint;
  onViewOnMap: (id: string) => void;
}) {
  return (
    <article className="rounded-lg border border-[var(--line)] bg-white px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold leading-snug text-[var(--ink)]">
          {point.name}
        </h3>
        <p className="shrink-0 rounded-md bg-[var(--ink)] px-2 py-1 text-xs font-bold text-white">
          Official collection point
        </p>
      </div>

      <p className="mt-2 text-sm leading-snug text-[var(--mute)]">
        {point.description}
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onViewOnMap(point.id)}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-[var(--ink)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--ink)]"
        >
          View on map
        </button>
        <a
          href={directionsUrl(point)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white"
        >
          Get directions
          <span className="sr-only"> (opens Google Maps)</span>
        </a>
      </div>
    </article>
  );
}
