"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminTimePanel } from "@/components/admin-time/admin-time-panel";
import { BeachHubCard } from "@/components/beach-groups/beach-hub-card";
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
        className="rounded-card border border-line bg-white px-3 py-4 text-meta"
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
    <div className="space-y-4">
      <p className="text-body">
        Find where volunteers are cleaning, join the beach WhatsApp group, and
        log your clean-up when you finish. Cards have information on equipment
        stations and council nurdle collection points where available.
      </p>

      <CleanupOverallCallout
        stats={cleanupStats}
        adminTotalMinutes={adminTotalMinutes}
        loading={cleanupStatsLoading}
        activeBeachCount={checkinBeaches.length}
      />

      {(loadError || actionError) && (
        <p role="alert" className="text-sm leading-snug text-red-800">
          {actionError ?? loadError}
        </p>
      )}

      {statusMessage ? (
        <p className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}

      {!configured ? (
        <Card variant="warning" padding="sm" role="note">
          Live check-in and clean-up logging isn’t configured for this
          environment yet. You can still browse the beaches below. An organiser
          needs to add Supabase credentials before live features work.
        </Card>
      ) : null}

      <BeachCheckinMap
        beaches={checkinBeaches}
        statsById={statsById}
        checkedInBeachId={myCheckin?.beachId ?? null}
        onCheckInRequest={openCheckIn}
      />

      <div className="space-y-8">
        {beachRegionOrder.map((region) => {
          const beaches = beachesInRegion(region);
          if (beaches.length === 0) return null;
          return (
            <section key={region} aria-label={beachRegionLabels[region]}>
              <h2 className="text-eyebrow text-mute">
                {beachRegionLabels[region]}
              </h2>
              <ul className="mt-3 space-y-3">
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

      {otherBeachWhatsappGroups.length > 0 ? (
        <Card padding="sm">
          <h3 className="text-eyebrow text-mute">Other WhatsApp groups</h3>
          <ul className="mt-2 space-y-2">
            {otherBeachWhatsappGroups.map((group) => (
              <li key={group.id} className="flex flex-wrap items-center gap-2">
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
        </Card>
      ) : null}

      <div className="my-6 border-t border-line pt-6" aria-hidden="true" />

      <AdminTimePanel />

      <p className="text-xs leading-snug text-mute">
        Check-ins are approximate, automatically expire after two hours and are
        only intended to help volunteers understand where people are currently
        helping. Mesh filter bags are listed on the How to clean page.
      </p>

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
