"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { CollectionPointCard } from "@/components/collection-points/collection-point-card";
import {
  COUNCIL_GUIDANCE_URL,
  collectionPoints,
} from "@/data/collection-points";

const CollectionPointsMap = dynamic(
  () =>
    import("@/components/collection-points/collection-points-map").then(
      (mod) => mod.CollectionPointsMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="rounded-lg border border-[var(--line)] bg-white px-3 py-4 text-sm text-[var(--mute)]"
      >
        Loading collection-point map…
      </div>
    ),
  },
);

export function CollectionPointsPanel() {
  const [focusId, setFocusId] = useState<string | null>(null);

  const handleViewOnMap = useCallback((id: string) => {
    const mapEl = document.getElementById("collection-points-map");
    mapEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    setFocusId(id);
  }, []);

  const clearFocus = useCallback(() => {
    setFocusId(null);
  }, []);

  const points = [...collectionPoints].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="space-y-4">
      <p className="text-sm leading-snug text-[var(--mute)]">
        Take securely bagged nurdles and collected waste to one of the official
        collection points shown below. Remember to label bags.
      </p>

      <p>
        <a
          href={COUNCIL_GUIDANCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-[var(--mark)] underline underline-offset-2"
        >
          Council guidance
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>

      <CollectionPointsMap
        points={points}
        focusId={focusId}
        onFocusHandled={clearFocus}
      />

      <p className="text-xs leading-snug text-[var(--mute)]">
        Marker positions are approximate. Please follow any signs or
        instructions at the beach.
      </p>

      <ul className="space-y-3">
        {points.map((point) => (
          <li key={point.id}>
            <CollectionPointCard
              point={point}
              onViewOnMap={handleViewOnMap}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
