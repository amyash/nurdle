"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { WildlifeReportPublic } from "@/types/wildlife";
import {
  conditionLabel,
  displaySpecies,
  formatObservedDate,
} from "@/lib/wildlife/format";

export function WildlifeReportCard({
  report,
  onRemove,
  removeDisabled,
}: {
  report: WildlifeReportPublic;
  onRemove: (report: WildlifeReportPublic) => void;
  removeDisabled?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (target && rootRef.current?.contains(target)) return;
      setMenuOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <article>
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-card-title">
          {displaySpecies(report.animalType, report.species)}
        </h3>

        <div ref={rootRef} className="relative shrink-0">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-control text-mute hover:bg-surface hover:text-ink"
            aria-label="Report actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            disabled={removeDisabled}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              <circle cx="12" cy="5" r="1.75" />
              <circle cx="12" cy="12" r="1.75" />
              <circle cx="12" cy="19" r="1.75" />
            </svg>
          </button>

          {menuOpen ? (
            <div
              id={menuId}
              role="menu"
              className="absolute right-0 top-full z-20 mt-1 min-w-36 border border-line bg-paper py-1"
            >
              <button
                type="button"
                role="menuitem"
                className="flex min-h-11 w-full items-center px-3 text-left text-sm font-bold text-red-800 hover:bg-surface"
                disabled={removeDisabled}
                onClick={() => {
                  setMenuOpen(false);
                  onRemove(report);
                }}
              >
                Remove report
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-1 text-sm font-bold text-ink">
        {conditionLabel(report.condition)}
      </p>
      <p className="mt-1 text-meta">
        {report.beachName} · {formatObservedDate(report.dateObserved)}
        {report.timeObserved ? ` · ${report.timeObserved}` : ""}
        {report.count > 1 ? ` · ${report.count} observed` : ""}
      </p>
      <p className="mt-2 text-sm leading-snug text-mute">{report.description}</p>
      {report.hasSupportingEvidence ? (
        <p className="mt-2 text-sm font-bold leading-snug text-ink">
          Photo evidence available
        </p>
      ) : null}
    </article>
  );
}
