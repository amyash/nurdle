"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BeachCheckinCard } from "@/components/check-in/beach-checkin-card";
import { CheckInModal } from "@/components/check-in/check-in-modal";
import { checkinBeaches } from "@/data/checkin-beaches";
import {
  checkInVolunteer,
  checkOutVolunteer,
  extendCheckin,
  fetchBeachCheckinStats,
  fetchMyActiveCheckin,
} from "@/lib/check-in/api";
import { summaryLabel } from "@/lib/check-in/format";
import { getOrCreateCheckinSessionId } from "@/lib/check-in/session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  ActiveSessionCheckin,
  BeachCheckinStats,
} from "@/types/check-in";

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

export function VolunteerCheckinPanel() {
  const configured = isSupabaseConfigured();
  const sessionIdRef = useRef<string | null>(null);
  const [stats, setStats] = useState<BeachCheckinStats[]>(emptyStats);
  const [myCheckin, setMyCheckin] = useState<ActiveSessionCheckin | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [modalBeachId, setModalBeachId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
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

  const modalBeach = modalBeachId
    ? checkinBeaches.find((beach) => beach.id === modalBeachId)
    : undefined;

  const refresh = useCallback(async (sid: string) => {
    const [statsResult, mineResult] = await Promise.all([
      fetchBeachCheckinStats(),
      fetchMyActiveCheckin(sid),
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

  return (
    <div className="space-y-4">
      <p className="text-sm leading-snug text-[var(--mute)]">
        See roughly where volunteers are currently helping across the coastline.
        Check in when you arrive and check out when you leave. Check-ins
        automatically expire after two hours.
      </p>

      <p
        className="text-sm font-bold leading-snug text-[var(--ink)]"
        aria-live="polite"
      >
        {loading ? "Loading volunteer numbers…" : summaryLabel(stats)}
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
          Check-in storage isn’t configured for this environment yet. You can
          still browse the beaches below. An organiser needs to add Supabase
          credentials before live counts work.
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
            <BeachCheckinCard
              beach={beach}
              stats={statsById[beach.id]}
              isCheckedInHere={myCheckin?.beachId === beach.id}
              checkInDisabled={!configured}
              busy={busy}
              nowMs={nowMs}
              onCheckIn={() => openCheckIn(beach.id)}
              onCheckOut={() => void handleCheckOut()}
              onExtend={() => void handleExtend()}
            />
          </li>
        ))}
      </ul>

      <p className="text-xs leading-snug text-[var(--mute)]">
        Check-ins are approximate, automatically expire after two hours and are
        only intended to help volunteers understand where people are currently
        helping.
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
    </div>
  );
}
