"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminTimePanel } from "@/components/admin-time/admin-time-panel";
import { BeachHubCard } from "@/components/beach-groups/beach-hub-card";
import { RestOfUkBeachSection } from "@/components/beach-groups/rest-of-uk-beach-section";
import { CheckInModal } from "@/components/check-in/check-in-modal";
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
import { showRestOfUkBeachSection } from "@/data/content";
import {
  checkInVolunteer,
  fetchBeachCheckinStats,
  fetchMyActiveCheckin,
} from "@/lib/check-in/api";
import { getOrCreateCheckinSessionId } from "@/lib/check-in/session";
import { fetchAdminTimeStats } from "@/lib/admin-time/api";
import {
  createCleanupLog,
  emptyCleanupStats,
  fetchCleanupStats,
} from "@/lib/cleanup-logs/api";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { whatsappLinkKeyForBeach } from "@/lib/whatsapp-gate/links";
import type {
  ActiveSessionCheckin,
  BeachCheckinStats,
} from "@/types/check-in";
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

function emptyStats(): BeachCheckinStats[] {
  return checkinBeaches.map((beach) => ({
    beachId: beach.id,
    volunteerCount: 0,
    latestCheckedInAt: null,
    sampleFirstName: null,
  }));
}

export function BeachGroupsHubPanel() {
  const configured = isSupabaseConfigured();
  const { openGate } = useWhatsAppGate();
  const sessionIdRef = useRef<string | null>(null);
  const [stats, setStats] = useState<BeachCheckinStats[]>(emptyStats);
  const [cleanupStats, setCleanupStats] = useState<CleanupStatsResponse | null>(
    null,
  );
  const [adminTotalMinutes, setAdminTotalMinutes] = useState(0);
  const [cleanupStatsLoading, setCleanupStatsLoading] = useState(true);
  const [myCheckin, setMyCheckin] = useState<ActiveSessionCheckin | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [modalBeachId, setModalBeachId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [cleanupBeachId, setCleanupBeachId] = useState<string | null>(null);
  const [cleanupError, setCleanupError] = useState<string | null>(null);
  const [showCleanupSuccess, setShowCleanupSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function ensureSessionId(): string {
    if (!sessionIdRef.current) {
      sessionIdRef.current = getOrCreateCheckinSessionId();
    }
    return sessionIdRef.current;
  }

  const statsById = useMemo(
    () => Object.fromEntries(stats.map((row) => [row.beachId, row])),
    [stats],
  );

  const modalBeach = modalBeachId
    ? checkinBeaches.find((beach) => beach.id === modalBeachId)
    : undefined;

  const refresh = useCallback(async (sid: string) => {
    const [statsResult, mineResult, cleanupResult, adminResult] =
      await Promise.all([
        fetchBeachCheckinStats(),
        fetchMyActiveCheckin(sid),
        fetchCleanupStats(),
        fetchAdminTimeStats(),
      ]);

    if (statsResult.ok) {
      const byId = Object.fromEntries(
        statsResult.stats.map((row) => [row.beachId, row]),
      );
      setStats(
        checkinBeaches.map(
          (beach) =>
            byId[beach.id] ?? {
              beachId: beach.id,
              volunteerCount: 0,
              latestCheckedInAt: null,
              sampleFirstName: null,
            },
        ),
      );
      setLoadError(null);
    } else if (statsResult.error === "not_configured") {
      setStats(emptyStats());
      setLoadError(statsResult.message);
    } else {
      setLoadError(statsResult.message);
    }

    if (mineResult.ok) {
      setMyCheckin(mineResult.checkin);
    }

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
    const sid = ensureSessionId();

    void refresh(sid);

    const poll = window.setInterval(() => {
      void refresh(sid);
    }, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void refresh(sid);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  async function handleConfirmCheckIn(firstName: string) {
    if (!modalBeachId) return;
    const sessionId = ensureSessionId();
    setBusy(true);
    setModalError(null);
    const result = await checkInVolunteer({
      beachId: modalBeachId,
      sessionId,
      firstName,
    });
    setBusy(false);

    if (!result.ok) {
      setModalError(result.message);
      return;
    }

    setMyCheckin(result.checkin);
    setModalBeachId(null);
    setStatusMessage(`Checked in at ${modalBeach?.name ?? "the beach"}.`);
    await refresh(sessionId);
  }

  function openCheckIn(beachId: string) {
    if (!configured) {
      setActionError(
        "Volunteer check-in isn’t connected yet. Please try again later.",
      );
      return;
    }
    setActionError(null);
    setModalError(null);
    setModalBeachId(beachId);
  }

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
    await refresh(ensureSessionId());
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

      {(loadError || actionError) && (
        <p role="alert" className="mt-4 text-sm leading-snug text-red-800">
          {actionError ?? loadError}
        </p>
      )}

      {statusMessage ? (
        <p className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}

      {!configured ? (
        <Card variant="warning" padding="sm" role="note" className="mt-6">
          Live check-in and clean-up logging isn’t configured for this
          environment yet. You can still browse the beaches below. An organiser
          needs to add Supabase credentials before live features work.
        </Card>
      ) : null}

      <div className="mt-8">
        <BeachCheckinMap
          beaches={checkinBeaches}
          statsById={statsById}
          checkedInBeachId={myCheckin?.beachId ?? null}
          onCheckInRequest={openCheckIn}
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

      {showRestOfUkBeachSection ? (
        <div className="mt-10">
          <RestOfUkBeachSection />
        </div>
      ) : null}

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

      <CheckInModal
        beachName={modalBeach?.name ?? "this beach"}
        open={modalBeachId != null}
        busy={busy}
        error={modalError}
        onClose={() => {
          if (!busy) setModalBeachId(null);
        }}
        onConfirm={(firstName) => void handleConfirmCheckIn(firstName)}
      />

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
