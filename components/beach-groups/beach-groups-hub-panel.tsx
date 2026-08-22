"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminTimePanel } from "@/components/admin-time/admin-time-panel";
import { BeachHubCard } from "@/components/beach-groups/beach-hub-card";
import { RestOfUkBeachSection } from "@/components/beach-groups/rest-of-uk-beach-section";
import { CleanupLogModal } from "@/components/cleanup-logs/cleanup-log-modal";
import { CleanupLogSuccessModal } from "@/components/cleanup-logs/cleanup-log-success-modal";
import { CleanupOverallCallout } from "@/components/cleanup-logs/cleanup-overall-callout";
import { Button } from "@/components/ui/button";
import { useWhatsAppGate } from "@/components/whatsapp/whatsapp-gate";
import { Card } from "@/components/ui/card";
import {
  beachRegionLabels,
  beachRegionOrder,
  beachesInRegion,
  checkinBeaches,
  otherBeachWhatsappGroups,
} from "@/data/checkin-beaches";
import { fetchAdminTimeStats } from "@/lib/admin-time/api";
import {
  createCleanupLog,
  emptyCleanupStats,
  fetchCleanupStats,
} from "@/lib/cleanup-logs/api";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { whatsappLinkKeyForBeach } from "@/lib/whatsapp-gate/links";
import type { CleanupStatsResponse } from "@/types/cleanup-log";

const BeachCheckinMap = dynamic(
  () =>
    import("@/components/check-in/beach-checkin-map").then(
      (mod) => mod.BeachCheckinMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="border border-line bg-surface px-3 py-4 text-meta"
      >
        Loading map…
      </div>
    ),
  },
);

const POLL_MS = 25_000;

export function BeachGroupsHubPanel() {
  const configured = isSupabaseConfigured();
  const { openGate } = useWhatsAppGate();
  const [cleanupStats, setCleanupStats] = useState<CleanupStatsResponse | null>(
    null,
  );
  const [adminTotalMinutes, setAdminTotalMinutes] = useState(0);
  const [cleanupStatsLoading, setCleanupStatsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cleanupBeachId, setCleanupBeachId] = useState<string | null>(null);
  const [cleanupError, setCleanupError] = useState<string | null>(null);
  const [showCleanupSuccess, setShowCleanupSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const cleanupStatsById = useMemo(
    () => cleanupStats?.byBeach ?? {},
    [cleanupStats],
  );

  const refresh = useCallback(async () => {
    const [cleanupResult, adminResult] = await Promise.all([
      fetchCleanupStats(),
      fetchAdminTimeStats(),
    ]);

    if (cleanupResult.ok) {
      setCleanupStats(cleanupResult.stats);
    } else if (cleanupResult.error === "not_configured") {
      setCleanupStats(emptyCleanupStats());
    }

    if (adminResult.ok) {
      setAdminTotalMinutes(adminResult.stats.totalDurationMinutes);
    } else {
      setAdminTotalMinutes(0);
    }
    setCleanupStatsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();

    const poll = window.setInterval(() => {
      void refresh();
    }, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  function openCleanupLog(beachId: string) {
    if (!configured) {
      setActionError(
        "Clean-up logging isn’t connected yet. Please try again later.",
      );
      return;
    }
    setActionError(null);
    setCleanupError(null);
    setCleanupBeachId(beachId);
  }

  async function handleSubmitCleanupLog(input: {
    beachId: string;
    cleanupDate: string;
    durationMinutes: number;
    volunteerCount: number;
    collectedVolume: string;
    volunteerName: string;
    notes: string;
    confirmedEstimate: boolean;
    formOpenedAt: number;
    company: string;
  }) {
    if (!cleanupBeachId || busy) return;
    setBusy(true);
    setCleanupError(null);
    const result = await createCleanupLog(input);
    setBusy(false);

    if (!result.ok) {
      setCleanupError(result.message);
      return;
    }

    setCleanupBeachId(null);
    setShowCleanupSuccess(true);
    setStatusMessage("Clean-up logged.");
    await refresh();
  }

  return (
    <div>
      <div className="border-b border-line pb-8">
        <CleanupOverallCallout
          stats={cleanupStats}
          adminTotalMinutes={adminTotalMinutes}
          loading={cleanupStatsLoading}
          activeBeachCount={checkinBeaches.length}
          highlight
        />
      </div>

      {actionError ? (
        <p role="alert" className="mt-4 text-sm leading-snug text-red-800">
          {actionError}
        </p>
      ) : null}

      {statusMessage ? (
        <p className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}

      {!configured ? (
        <Card variant="warning" padding="sm" role="note" className="mt-6">
          Clean-up logging isn’t configured for this environment yet. You can
          still browse the beaches below. An organiser needs to add Supabase
          credentials before live features work.
        </Card>
      ) : null}

      <div className="mt-8">
        <BeachCheckinMap
          beaches={checkinBeaches}
          cleanupStatsById={cleanupStatsById}
          onLogCleanupRequest={openCleanupLog}
        />
      </div>

      <div className="mt-10 space-y-10">
        {beachRegionOrder.map((region) => {
          const beaches = beachesInRegion(region);
          if (beaches.length === 0) return null;
          return (
            <section key={region} aria-labelledby={`region-${region}`}>
              <h2
                id={`region-${region}`}
                className="text-eyebrow text-mark border-b border-line pb-3"
              >
                {beachRegionLabels[region]}
              </h2>
              <ul>
                {beaches.map((beach) => (
                  <li key={beach.id}>
                    <BeachHubCard
                      beach={beach}
                      cleanupStats={cleanupStats?.byBeach[beach.id]}
                      cleanupStatsLoading={cleanupStatsLoading}
                      cleanupDisabled={!configured}
                      busy={busy}
                      onLogCleanup={() => openCleanupLog(beach.id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-10">
        <RestOfUkBeachSection />
      </div>

      {otherBeachWhatsappGroups.length > 0 ? (
        <div className="mt-10 border-t border-line pt-8">
          <h3 className="text-eyebrow text-mute">Other WhatsApp groups</h3>
          <ul className="mt-4 space-y-3">
            {otherBeachWhatsappGroups.map((group) => (
              <li
                key={group.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3"
              >
                <p className="text-sm font-bold text-ink">{group.name}</p>
                <Button
                  type="button"
                  variant="whatsapp"
                  onClick={() =>
                    openGate({
                      linkKey: whatsappLinkKeyForBeach(group.id),
                      beachId: group.id,
                      label: group.name,
                    })
                  }
                >
                  Join WhatsApp
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-12 pt-2">
        <AdminTimePanel />
      </div>

      <CleanupLogModal
        beachId={cleanupBeachId ?? checkinBeaches[0]?.id ?? ""}
        open={cleanupBeachId != null}
        busy={busy}
        error={cleanupError}
        onClose={() => {
          if (!busy) setCleanupBeachId(null);
        }}
        onSubmit={(input) => void handleSubmitCleanupLog(input)}
      />

      <CleanupLogSuccessModal
        open={showCleanupSuccess}
        onClose={() => setShowCleanupSuccess(false)}
      />
    </div>
  );
}
