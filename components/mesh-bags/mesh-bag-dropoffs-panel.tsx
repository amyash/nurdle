"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MeshBagDropoffModal } from "@/components/mesh-bags/mesh-bag-dropoff-modal";
import { MeshBagDropoffSuccessModal } from "@/components/mesh-bags/mesh-bag-dropoff-success-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createMeshBagDropoff,
  fetchRecentMeshBagDropoffs,
  removeMeshBagDropoff,
} from "@/lib/mesh-bags/dropoff-api";
import { formatDropoffListItem } from "@/lib/mesh-bags/dropoff-format";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { MeshBagDropoff } from "@/types/mesh-bag-dropoffs";

const POLL_MS = 30_000;

export function MeshBagDropoffsPanel() {
  const configured = isSupabaseConfigured();
  const menuId = useId();
  const titleId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [dropoffs, setDropoffs] = useState<MeshBagDropoff[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const refresh = useCallback(async () => {
    if (!configured) {
      setDropoffs([]);
      setLoadError(null);
      setLoading(false);
      return;
    }

    const result = await fetchRecentMeshBagDropoffs();
    if (result.ok) {
      setDropoffs(result.dropoffs);
      setLoadError(null);
    } else if (result.error === "not_configured") {
      setDropoffs([]);
      setLoadError(null);
    } else {
      setLoadError(result.message);
    }
    setLoading(false);
  }, [configured]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      await refresh();
      if (cancelled) return;
    }

    void boot();
    const poll = window.setInterval(() => {
      void refresh();
    }, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  useEffect(() => {
    if (!menuOpen) return;

    const firstItem = menuRef.current?.querySelector<HTMLButtonElement>(
      '[role="menuitem"]',
    );
    firstItem?.focus();

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (menuRef.current?.contains(target)) return;
      if (menuButtonRef.current?.contains(target)) return;
      setMenuOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
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

  function openLogForm() {
    setMenuOpen(false);
    if (!configured) {
      setFormError(
        "Bag drop-offs aren’t connected yet. Please try again later.",
      );
      setFormOpen(true);
      return;
    }
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(input: {
    quantity: number;
    locationId: string;
    locationLabel: string;
    locationOther: string | null;
    droppedAt: string;
    makerName: string | null;
  }) {
    if (busy) return;
    setBusy(true);
    setFormError(null);
    const result = await createMeshBagDropoff(input);
    setBusy(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setDropoffs((prev) => {
      const next = [
        result.dropoff,
        ...prev.filter((item) => item.id !== result.dropoff.id),
      ];
      return next.sort(
        (a, b) => Date.parse(b.droppedAt) - Date.parse(a.droppedAt),
      );
    });
    setFormOpen(false);
    setShowSuccess(true);
  }

  async function handleRemove(dropoff: MeshBagDropoff) {
    if (busy || removingId) return;
    const label = formatDropoffListItem({
      quantity: dropoff.quantity,
      locationLabel: dropoff.locationLabel,
      locationOther: dropoff.locationOther,
      droppedAt: dropoff.droppedAt,
    });
    const confirmed = window.confirm(
      `Remove this drop-off from the list?\n\n${label}`,
    );
    if (!confirmed) return;

    setActionError(null);
    setRemovingId(dropoff.id);
    const result = await removeMeshBagDropoff(dropoff.id);
    setRemovingId(null);

    if (!result.ok) {
      setActionError(result.message);
      return;
    }

    setDropoffs((prev) => prev.filter((item) => item.id !== dropoff.id));
  }

  return (
    <>
      <Card className="mb-6" aria-labelledby={titleId}>
        <div className="relative flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-card-title">
            Mesh filter bags
          </h2>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-control text-lg font-bold text-mute hover:bg-board"
            aria-label="Mesh filter bags menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setMenuOpen(true);
              }
            }}
          >
            <span aria-hidden="true">⋯</span>
          </button>

          {menuOpen ? (
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-label="Mesh filter bags actions"
              className="absolute right-0 top-11 z-10 min-w-[12rem] rounded-control border border-line bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                className="flex min-h-11 w-full items-center px-3 text-left text-sm font-bold text-ink hover:bg-board"
                onClick={openLogForm}
              >
                Log a bag drop-off
              </button>
            </div>
          ) : null}
        </div>

        <h3 className="mt-3 text-eyebrow text-mute">Bags dropped off</h3>

        {!configured ? (
          <p className="mt-2 text-meta">
            Bag drop-offs aren’t connected for this environment yet.
          </p>
        ) : loading ? (
          <p className="mt-2 text-meta" role="status">
            Loading recent drop-offs…
          </p>
        ) : loadError ? (
          <p role="alert" className="mt-2 text-sm leading-snug text-red-800">
            {loadError}
          </p>
        ) : dropoffs.length === 0 ? (
          <p className="mt-2 text-meta">
            No bag drop-offs have been logged yet.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {dropoffs.map((dropoff) => {
              const label = formatDropoffListItem({
                quantity: dropoff.quantity,
                locationLabel: dropoff.locationLabel,
                locationOther: dropoff.locationOther,
                droppedAt: dropoff.droppedAt,
              });
              const isRemoving = removingId === dropoff.id;
              return (
                <li
                  key={dropoff.id}
                  className="flex items-start justify-between gap-3 text-body"
                >
                  <span className="min-w-0 flex-1">{label}</span>
                  <Button
                    type="button"
                    variant="quiet"
                    disabled={busy || removingId != null}
                    onClick={() => void handleRemove(dropoff)}
                    className="min-h-0 shrink-0 px-2 py-1 text-mute"
                    aria-label={`Remove drop-off: ${label}`}
                  >
                    {isRemoving ? "Removing…" : "Remove"}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}

        {actionError ? (
          <p role="alert" className="mt-2 text-sm leading-snug text-red-800">
            {actionError}
          </p>
        ) : null}

        <p className="mt-3 text-xs leading-snug text-mute">
          Availability may change quickly. Drop-offs are automatically removed
          after 24 hours. Use Remove when bags have been collected.
        </p>
      </Card>

      <MeshBagDropoffModal
        open={formOpen}
        busy={busy}
        error={formError}
        onClose={() => {
          if (!busy) setFormOpen(false);
        }}
        onSubmit={(input) => void handleSubmit(input)}
      />

      <MeshBagDropoffSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
