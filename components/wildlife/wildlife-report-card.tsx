"use client";

import type { WildlifeReportPublic } from "@/types/wildlife";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <Card padding="sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-card-title">{displaySpecies(report.animalType, report.species)}</h3>
        <Button
          type="button"
          variant="quiet"
          disabled={removeDisabled}
          onClick={() => onRemove(report)}
          className="min-h-0 shrink-0 px-2 py-1 text-mute"
        >
          Remove
        </Button>
      </div>
      <p className="mt-1 text-sm font-bold text-ink">
        {conditionLabel(report.condition)}
      </p>
      <p className="mt-1 text-meta">
        {report.beachName} · {formatObservedDate(report.dateObserved)}
        {report.timeObserved ? ` · ${report.timeObserved}` : ""}
        {report.count > 1 ? ` · ${report.count} observed` : ""}
      </p>
      <p className="mt-2 text-sm leading-snug text-ink">{report.description}</p>
      {report.hasSupportingEvidence ? (
        <p className="mt-2 text-sm font-bold leading-snug text-ink">
          📷 Photo evidence available
        </p>
      ) : null}
    </Card>
  );
}
