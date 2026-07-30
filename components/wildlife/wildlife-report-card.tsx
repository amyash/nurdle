"use client";

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
  return (
    <article className="rounded-lg border border-[var(--line)] bg-white px-3 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-bold leading-snug text-[var(--ink)]">
          {displaySpecies(report.animalType, report.species)}
        </h3>
        <button
          type="button"
          disabled={removeDisabled}
          onClick={() => onRemove(report)}
          className="shrink-0 rounded-md px-2 py-1 text-sm font-bold text-[var(--mute)] underline underline-offset-2 hover:text-[var(--ink)] disabled:opacity-60"
        >
          Remove
        </button>
      </div>
      <p className="mt-1 text-sm font-bold text-[var(--ink)]">
        {conditionLabel(report.condition)}
      </p>
      <p className="mt-1 text-sm leading-snug text-[var(--mute)]">
        {report.beachName} · {formatObservedDate(report.dateObserved)}
        {report.timeObserved ? ` · ${report.timeObserved}` : ""}
        {report.count > 1 ? ` · ${report.count} observed` : ""}
      </p>
      <p className="mt-2 text-sm leading-snug text-[var(--ink)]">
        {report.description}
      </p>
      {report.hasSupportingEvidence ? (
        <p className="mt-2 text-sm font-bold leading-snug text-[var(--ink)]">
          📷 Photo evidence available
        </p>
      ) : null}
    </article>
  );
}
