"use client";

import type { WildlifeReportPublic } from "@/types/wildlife";
import {
  conditionLabel,
  displaySpecies,
  formatObservedDate,
  statusLabel,
} from "@/lib/wildlife/format";

export function WildlifeReportCard({
  report,
}: {
  report: WildlifeReportPublic;
}) {
  return (
    <article className="rounded-lg border border-[var(--line)] bg-white px-3 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-bold leading-snug text-[var(--ink)]">
          {displaySpecies(report.animalType, report.species)}
        </h3>
        <p className="rounded-md bg-[var(--board)] px-2 py-1 text-xs font-bold text-[var(--ink)]">
          {statusLabel(report.status)}
        </p>
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
