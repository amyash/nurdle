"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { WildlifeRemoveModal } from "@/components/wildlife/wildlife-remove-modal";
import { WildlifeReportCard } from "@/components/wildlife/wildlife-report-card";
import { WildlifeReportModal } from "@/components/wildlife/wildlife-report-modal";
import { WildlifeSuccessModal } from "@/components/wildlife/wildlife-success-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/cn";
import {
  createWildlifeReport,
  fetchWildlifeImpactData,
  removeWildlifeReport,
} from "@/lib/wildlife/api";
import {
  WILDLIFE_FILTERS,
  isValidAnimalType,
  isValidCondition,
  matchesWildlifeFilter,
} from "@/lib/wildlife/format";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  CreateWildlifeReportInput,
  WildlifeFilter,
  WildlifeImpactStats,
  WildlifeReportPublic,
} from "@/types/wildlife";

const WildlifeImpactMap = dynamic(
  () =>
    import("@/components/wildlife/wildlife-impact-map").then(
      (mod) => mod.WildlifeImpactMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="flex h-72 items-center justify-center rounded-card border border-line bg-white text-meta sm:h-80"
      >
        Loading map…
      </div>
    ),
  },
);

function emptyStats(): WildlifeImpactStats {
  return {
    verifiedReports: 0,
    animalsReported: 0,
    speciesRecorded: 0,
  };
}

export function WildlifeImpactPanel() {
  const configured = isSupabaseConfigured();
  const [reports, setReports] = useState<WildlifeReportPublic[]>([]);
  const [stats, setStats] = useState<WildlifeImpactStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<WildlifeFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [removeReport, setRemoveReport] = useState<WildlifeReportPublic | null>(
    null,
  );
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setReports([]);
          setStats(emptyStats());
          setLoading(false);
        }
        return;
      }

      const result = await fetchWildlifeImpactData();
      if (cancelled) return;
      if (result.ok) {
        setReports(result.reports);
        setStats(result.stats);
        setLoadError(null);
      } else if (result.error === "not_configured") {
        setReports([]);
        setStats(emptyStats());
      } else {
        setLoadError(result.message);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      reports.filter((report) =>
        matchesWildlifeFilter(report.condition, filter),
      ),
    [reports, filter],
  );

  function openForm() {
    if (!configured) {
      setFormError(
        "Wildlife reporting isn’t connected yet. Please try again later.",
      );
      setFormOpen(true);
      return;
    }
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(raw: {
    beachId: string;
    dateObserved: string;
    timeObserved: string | null;
    animalType: string;
    species: string;
    count: number;
    condition: string;
    description: string;
    hasSupportingEvidence: boolean;
    email: string;
    reporterName: string;
    consentPublic: boolean;
  }) {
    if (busy) return;
    if (!isValidAnimalType(raw.animalType) || !isValidCondition(raw.condition)) {
      setFormError("Please check the animal type and condition.");
      return;
    }

    const input: CreateWildlifeReportInput = {
      beachId: raw.beachId,
      dateObserved: raw.dateObserved,
      timeObserved: raw.timeObserved,
      animalType: raw.animalType,
      species: raw.species || null,
      count: raw.count,
      condition: raw.condition,
      description: raw.description,
      hasSupportingEvidence: raw.hasSupportingEvidence,
      email: raw.email,
      reporterName: raw.reporterName || null,
      consentPublic: raw.consentPublic,
    };

    setBusy(true);
    setFormError(null);
    const result = await createWildlifeReport(input);
    setBusy(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setFormOpen(false);
    setShowSuccess(true);
    setFilter("all");

    if (result.report) {
      setReports((prev) => [
        result.report!,
        ...prev.filter((item) => item.id !== result.report!.id),
      ]);
      setStats((prev) => ({
        verifiedReports: prev.verifiedReports + 1,
        animalsReported: prev.animalsReported + result.report!.count,
        speciesRecorded: prev.speciesRecorded,
      }));
    }

    const refreshed = await fetchWildlifeImpactData();
    if (!refreshed.ok) return;

    const serverHasNew = refreshed.reports.some((item) => item.id === result.id);
    if (serverHasNew || !result.report) {
      setReports(refreshed.reports);
      setStats(refreshed.stats);
      return;
    }

    // DB may still be on pending-only create (migration 015 not applied).
    // Keep the just-submitted report visible and merge any other approved rows.
    setReports([
      result.report,
      ...refreshed.reports.filter((item) => item.id !== result.report!.id),
    ]);
    setStats({
      verifiedReports: Math.max(
        refreshed.stats.verifiedReports,
        refreshed.reports.length + 1,
      ),
      animalsReported: Math.max(
        refreshed.stats.animalsReported,
        refreshed.stats.animalsReported + result.report.count,
      ),
      speciesRecorded: refreshed.stats.speciesRecorded,
    });
  }

  async function handleRemove(email: string) {
    if (!removeReport || removing) return;
    setRemoving(true);
    setRemoveError(null);
    const result = await removeWildlifeReport(removeReport.id, email);
    setRemoving(false);

    if (!result.ok) {
      setRemoveError(result.message);
      return;
    }

    setReports((prev) => prev.filter((item) => item.id !== removeReport.id));
    setRemoveReport(null);
    const refreshed = await fetchWildlifeImpactData();
    if (refreshed.ok) setStats(refreshed.stats);
  }

  const statCards = [
    { label: "Reports", value: stats.verifiedReports },
    { label: "Animals reported", value: stats.animalsReported },
    { label: "Species recorded", value: stats.speciesRecorded },
  ];

  return (
    <div className="space-y-6">
      <p className="text-body">
        Help document wildlife possibly affected by the nurdle spill. Community
        reports build a shared picture of impact and let organisations follow up
        for evidence when needed — without uploading photos to this site.
      </p>

      <Button type="button" onClick={openForm} fullWidth>
        Report a wildlife sighting
      </Button>

      <section aria-label="Community statistics">
        <h2 className="text-eyebrow text-mute">Community statistics</h2>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {statCards.map((card) => (
            <li key={card.label}>
              <StatCard
                label={card.label}
                value={loading ? "…" : card.value.toLocaleString("en-GB")}
              />
            </li>
          ))}
        </ul>
      </section>

      {!configured ? (
        <Card variant="warning" padding="sm" role="note">
          Wildlife impact isn’t connected for this environment yet. Add Supabase
          credentials and run the wildlife SQL migrations to enable reporting.
        </Card>
      ) : null}

      {loadError ? (
        <p role="alert" className="text-sm leading-snug text-red-800">
          {loadError}
        </p>
      ) : null}

      <section aria-label="Wildlife reports map">
        <h2 className="text-eyebrow text-mute">Map of reports</h2>
        <p className="mt-1 text-meta">
          Pins show beach-level locations only (not exact GPS). Reports at the
          same beach are grouped together.
        </p>
        <div className="mt-3">
          <WildlifeImpactMap reports={filtered} />
        </div>
      </section>

      <section aria-label="Filter reports">
        <h2 className="text-eyebrow text-mute">Filter</h2>
        <div
          className="mt-2 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter wildlife reports"
        >
          {WILDLIFE_FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-control border px-3 text-sm font-bold",
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink",
                )}
                aria-pressed={active}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Latest wildlife reports">
        <h2 className="text-eyebrow text-mute">Latest reports</h2>
        {loading ? (
          <p className="mt-2 text-meta" role="status">
            Loading reports…
          </p>
        ) : filtered.length === 0 ? (
          <p className="mt-2 text-meta">No reports match this filter yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {filtered.map((report) => (
              <li key={report.id}>
                <WildlifeReportCard
                  report={report}
                  removeDisabled={removing}
                  onRemove={(item) => {
                    setRemoveError(null);
                    setRemoveReport(item);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <WildlifeReportModal
        open={formOpen}
        busy={busy}
        error={formError}
        onClose={() => {
          if (!busy) setFormOpen(false);
        }}
        onSubmit={(input) => void handleSubmit(input)}
      />

      <WildlifeSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <WildlifeRemoveModal
        report={removeReport}
        open={removeReport != null}
        busy={removing}
        error={removeError}
        onClose={() => {
          if (!removing) setRemoveReport(null);
        }}
        onConfirm={(email) => void handleRemove(email)}
      />
    </div>
  );
}
