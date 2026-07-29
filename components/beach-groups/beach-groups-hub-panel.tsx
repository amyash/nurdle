"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BeachHubCard } from "@/components/beach-groups/beach-hub-card";
import { CheckInModal } from "@/components/check-in/check-in-modal";
import { CleanupLogModal } from "@/components/cleanup-logs/cleanup-log-modal";
import { CleanupLogSuccessModal } from "@/components/cleanup-logs/cleanup-log-success-modal";
import { CleanupOverallCallout } from "@/components/cleanup-logs/cleanup-overall-callout";
import { MeshBagRequestModal } from "@/components/mesh-bags/mesh-bag-request-modal";
import { MeshBagRequestsModal } from "@/components/mesh-bags/mesh-bag-requests-modal";
import { MeshBagSuccessModal } from "@/components/mesh-bags/mesh-bag-success-modal";
import {
  checkinBeaches,
  otherBeachWhatsappGroups,
} from "@/data/checkin-beaches";
import {
  checkInVolunteer,
  checkOutVolunteer,
  extendCheckin,
  fetchBeachCheckinStats,
  fetchMyActiveCheckin,
} from "@/lib/check-in/api";
import { summaryLabel } from "@/lib/check-in/format";
import { getOrCreateCheckinSessionId } from "@/lib/check-in/session";
import {
  createCleanupLog,
  emptyCleanupStats,
  fetchCleanupStats,
} from "@/lib/cleanup-logs/api";
import {
  cancelMeshBagRequest,
  createMeshBagRequest,
  fetchVisibleMeshBagRequests,
  markMeshBagDelivered,
} from "@/lib/mesh-bags/api";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  ActiveSessionCheckin,
  BeachCheckinStats,
} from "@/types/check-in";
import type { CleanupStatsResponse } from "@/types/cleanup-log";
import type { MeshBagNeededType, MeshBagRequest } from "@/types/mesh-bags";

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
        className="rounded-lg border border-[var(--line)] bg-white px-3 py-4 text-sm text-[var(--mute)]"
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
  const sessionIdRef = useRef<string | null>(null);
  const [stats, setStats] = useState<BeachCheckinStats[]>(emptyStats);
  const [bagRequests, setBagRequests] = useState<MeshBagRequest[]>([]);
  const [cleanupStats, setCleanupStats] = useState<CleanupStatsResponse | null>(
    null,
  );
  const [cleanupStatsLoading, setCleanupStatsLoading] = useState(true);
  const [myCheckin, setMyCheckin] = useState<ActiveSessionCheckin | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [modalBeachId, setModalBeachId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [bagRequestBeachId, setBagRequestBeachId] = useState<string | null>(
    null,
  );
  const [bagRequestError, setBagRequestError] = useState<string | null>(null);
  const [bagListBeachId, setBagListBeachId] = useState<string | null>(null);
  const [showBagSuccess, setShowBagSuccess] = useState(false);
  const [cleanupBeachId, setCleanupBeachId] = useState<string | null>(null);
  const [cleanupError, setCleanupError] = useState<string | null>(null);
  const [showCleanupSuccess, setShowCleanupSuccess] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
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

  const bagsByBeachId = useMemo(() => {
    const map: Record<string, MeshBagRequest[]> = {};
    for (const beach of checkinBeaches) map[beach.id] = [];
    for (const request of bagRequests) {
      if (!map[request.beachId]) map[request.beachId] = [];
      map[request.beachId].push(request);
    }
    return map;
  }, [bagRequests]);

  const modalBeach = modalBeachId
    ? checkinBeaches.find((beach) => beach.id === modalBeachId)
    : undefined;
  const bagRequestBeach = bagRequestBeachId
    ? checkinBeaches.find((beach) => beach.id === bagRequestBeachId)
    : undefined;
  const bagListBeach = bagListBeachId
    ? checkinBeaches.find((beach) => beach.id === bagListBeachId)
    : undefined;

  const refresh = useCallback(async (sid: string) => {
    const [statsResult, mineResult, bagsResult, cleanupResult] =
      await Promise.all([
        fetchBeachCheckinStats(),
        fetchMyActiveCheckin(sid),
        fetchVisibleMeshBagRequests(),
        fetchCleanupStats(),
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

    if (bagsResult.ok) {
      setBagRequests(bagsResult.requests);
    } else if (bagsResult.error !== "not_configured") {
      setLoadError((prev) => prev ?? bagsResult.message);
    }

    if (cleanupResult.ok) {
      setCleanupStats(cleanupResult.stats);
    } else if (cleanupResult.error === "not_configured") {
      setCleanupStats(emptyCleanupStats());
    }
    // Clean-up stats failures must not block check-in / mesh bags
    setCleanupStatsLoading(false);
  }, []);

  useEffect(() => {
    const sid = ensureSessionId();
    let cancelled = false;

    async function boot() {
      await refresh(sid);
      if (!cancelled) setLoading(false);
    }

    void boot();

    const poll = window.setInterval(() => {
      void refresh(sid);
      setNowMs(Date.now());
    }, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void refresh(sid);
        setNowMs(Date.now());
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
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

  async function handleCheckOut() {
    const sessionId = ensureSessionId();
    setBusy(true);
    setActionError(null);
    const result = await checkOutVolunteer(sessionId);
    setBusy(false);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    setMyCheckin(null);
    setStatusMessage("You’re checked out. Thank you for helping.");
    await refresh(sessionId);
  }

  async function handleExtend() {
    const sessionId = ensureSessionId();
    setBusy(true);
    setActionError(null);
    const result = await extendCheckin(sessionId);
    setBusy(false);
    if (!result.ok) {
      setActionError(result.message);
      if (result.error === "expired") {
        setMyCheckin(null);
      }
      return;
    }
    setMyCheckin(result.checkin);
    setStatusMessage("Check-in extended for another two hours.");
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

  function openBagRequest(beachId: string) {
    if (!configured) {
      setActionError(
        "Mesh bag requests aren’t connected yet. Please try again later.",
      );
      return;
    }
    setActionError(null);
    setBagRequestError(null);
    setBagRequestBeachId(beachId);
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

  async function handleSubmitBagRequest(input: {
    quantityRequested: number;
    neededType: MeshBagNeededType;
    neededAt: string | null;
    requesterName: string;
    note: string;
  }) {
    if (!bagRequestBeachId || busy) return;
    setBusy(true);
    setBagRequestError(null);
    const result = await createMeshBagRequest({
      beachId: bagRequestBeachId,
      quantityRequested: input.quantityRequested,
      neededType: input.neededType,
      neededAt: input.neededAt,
      requesterName: input.requesterName,
      note: input.note,
    });
    setBusy(false);

    if (!result.ok) {
      setBagRequestError(result.message);
      return;
    }

    setBagRequestBeachId(null);
    setShowBagSuccess(true);
    setStatusMessage("Mesh bag request submitted.");
    await refresh(ensureSessionId());
  }

  async function handleDeliver(request: MeshBagRequest) {
    const confirmed = window.confirm(
      `Mark ${request.quantityRequested} ${request.quantityRequested === 1 ? "bag" : "bags"} as delivered?`,
    );
    if (!confirmed) return;
    setBusy(true);
    setActionError(null);
    const result = await markMeshBagDelivered(request.id);
    setBusy(false);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    setStatusMessage("Marked mesh bags as delivered.");
    await refresh(ensureSessionId());
  }

  async function handleCancelBag(request: MeshBagRequest) {
    const confirmed = window.confirm(
      `Cancel request for ${request.quantityRequested} ${request.quantityRequested === 1 ? "bag" : "bags"}?`,
    );
    if (!confirmed) return;
    setBusy(true);
    setActionError(null);
    const result = await cancelMeshBagRequest(request.id);
    setBusy(false);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    setStatusMessage("Mesh bag request cancelled.");
    await refresh(ensureSessionId());
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-snug text-[var(--mute)]">
        Check in when you arrive, join the beach WhatsApp group, and request
        mesh bags for the sewing team. Check-ins expire after two hours.
      </p>

      <CleanupOverallCallout
        stats={cleanupStats}
        loading={cleanupStatsLoading}
        activeBeachCount={checkinBeaches.length}
      />

      <p
        className="text-sm font-bold leading-snug text-[var(--ink)]"
        aria-live="polite"
      >
        {loading ? "Loading beach updates…" : summaryLabel(stats)}
      </p>

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
        <aside
          className="rounded-lg border border-amber-800/40 bg-amber-50 p-3 text-sm leading-snug text-amber-950"
          role="note"
        >
          Live check-in and mesh bag storage isn’t configured for this
          environment yet. You can still browse the beaches below. An organiser
          needs to add Supabase credentials before live features work.
        </aside>
      ) : null}

      <BeachCheckinMap
        beaches={checkinBeaches}
        statsById={statsById}
        checkedInBeachId={myCheckin?.beachId ?? null}
        onCheckInRequest={openCheckIn}
      />

      <ul className="space-y-3">
        {checkinBeaches.map((beach) => (
          <li key={beach.id}>
            <BeachHubCard
              beach={beach}
              stats={statsById[beach.id]}
              bagRequests={bagsByBeachId[beach.id] ?? []}
              cleanupStats={cleanupStats?.byBeach[beach.id]}
              cleanupStatsLoading={cleanupStatsLoading}
              isCheckedInHere={myCheckin?.beachId === beach.id}
              checkInDisabled={!configured}
              bagsDisabled={!configured}
              cleanupDisabled={!configured}
              busy={busy}
              nowMs={nowMs}
              onCheckIn={() => openCheckIn(beach.id)}
              onCheckOut={() => void handleCheckOut()}
              onExtend={() => void handleExtend()}
              onRequestBags={() => openBagRequest(beach.id)}
              onLogCleanup={() => openCleanupLog(beach.id)}
              onOpenBagRequests={() => setBagListBeachId(beach.id)}
            />
          </li>
        ))}
      </ul>

      <section className="rounded-lg border border-[var(--line)] bg-white px-3 py-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--mute)]">
          Other WhatsApp groups
        </h3>
        <ul className="mt-2 space-y-2">
          {otherBeachWhatsappGroups.map((group) => (
            <li key={group.id} className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-[var(--ink)]">{group.name}</p>
              {group.whatsappUrl ? (
                <a
                  href={group.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-md bg-[#25D366] px-3 py-2 text-sm font-bold text-white"
                >
                  Join WhatsApp
                </a>
              ) : (
                <p className="text-sm italic text-[var(--mute)]">
                  Link not yet added
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs leading-snug text-[var(--mute)]">
        Check-ins are approximate, automatically expire after two hours and are
        only intended to help volunteers understand where people are currently
        helping. Mesh bag requests are shared with the sewing team.
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

      <MeshBagRequestModal
        beachName={bagRequestBeach?.name ?? "this beach"}
        open={bagRequestBeachId != null}
        busy={busy}
        error={bagRequestError}
        onClose={() => {
          if (!busy) setBagRequestBeachId(null);
        }}
        onSubmit={(input) => void handleSubmitBagRequest(input)}
      />

      <MeshBagSuccessModal
        open={showBagSuccess}
        onClose={() => setShowBagSuccess(false)}
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

      <MeshBagRequestsModal
        beachName={bagListBeach?.name ?? "this beach"}
        requests={bagListBeachId ? (bagsByBeachId[bagListBeachId] ?? []) : []}
        open={bagListBeachId != null}
        busy={busy}
        nowMs={nowMs}
        onClose={() => {
          if (!busy) setBagListBeachId(null);
        }}
        onDeliver={(request) => void handleDeliver(request)}
        onCancel={(request) => void handleCancelBag(request)}
      />
    </div>
  );
}
