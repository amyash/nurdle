"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CheckinBeach } from "@/data/checkin-beaches";
import type { CleanupAggregate } from "@/types/cleanup-log";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import "leaflet/dist/leaflet.css";

type LeafletModule = typeof import("leaflet");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function markerRadius(submissionCount: number): number {
  if (submissionCount <= 0) return 10;
  if (submissionCount < 5) return 12;
  if (submissionCount < 15) return 15;
  return 18;
}

function cleanupSummaryLabel(stats: CleanupAggregate | undefined): string {
  const count = stats?.submissionCount ?? 0;
  if (count === 0) return "No clean-ups logged yet";
  if (count === 1) return "1 clean-up logged";
  return `${count.toLocaleString("en-GB")} clean-ups logged`;
}

function waitForLayout(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

/** One-finger scroll keeps the page moving; two fingers pan the map. */
function setupTwoFingerPan(map: import("leaflet").Map) {
  const container = map.getContainer();
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  if (!coarse && !("ontouchstart" in window)) return;

  map.dragging.disable();
  container.style.touchAction = "pan-y";

  const syncDrag = (touchCount: number) => {
    if (touchCount >= 2) {
      map.dragging.enable();
      container.style.touchAction = "none";
    } else {
      map.dragging.disable();
      container.style.touchAction = "pan-y";
    }
  };

  const onStart = (event: TouchEvent) => syncDrag(event.touches.length);
  const onEnd = (event: TouchEvent) => syncDrag(event.touches.length);

  container.addEventListener("touchstart", onStart, { passive: true });
  container.addEventListener("touchend", onEnd, { passive: true });
  container.addEventListener("touchcancel", onEnd, { passive: true });
}

export function BeachCheckinMap({
  beaches,
  cleanupStatsById,
  onLogCleanupRequest,
}: {
  beaches: CheckinBeach[];
  cleanupStatsById: Record<string, CleanupAggregate | undefined>;
  onLogCleanupRequest: (beachId: string) => void;
}) {
  const mapId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const onLogCleanupRef = useRef(onLogCleanupRequest);
  const boundsRef = useRef<import("leaflet").LatLngExpression[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const closeExpanded = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    onLogCleanupRef.current = onLogCleanupRequest;
  }, [onLogCleanupRequest]);

  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeExpanded();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded, closeExpanded]);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      setMapReady(false);
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;

      await waitForLayout();
      if (cancelled || !containerRef.current) return;

      try {
        const L = await import("leaflet");
        if (cancelled || !containerRef.current) return;

        leafletRef.current = L;
        const map = L.map(containerRef.current, {
          scrollWheelZoom: expanded,
          attributionControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        setupTwoFingerPan(map);

        const layer = L.layerGroup().addTo(map);
        mapRef.current = map;
        layerRef.current = layer;
        setMapReady(true);
      } catch {
        if (!cancelled) {
          setMapError(
            "The map couldn’t load on this device. Use the beach list below to log a clean-up.",
          );
        }
      }
    }

    void initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [expanded]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    const L = leafletRef.current;
    if (!map || !layer || !L || !mapReady) return;

    layer.clearLayers();
    const bounds: import("leaflet").LatLngExpression[] = [];

    for (const beach of beaches) {
      const stats = cleanupStatsById[beach.id];
      const submissionCount = stats?.submissionCount ?? 0;
      const latLng: import("leaflet").LatLngExpression = [
        beach.latitude,
        beach.longitude,
      ];
      bounds.push(latLng);

      const radius = markerRadius(submissionCount);
      const marker = L.circleMarker(latLng, {
        radius,
        color: "#111827",
        weight: 2,
        fillColor: submissionCount > 0 ? "#0f766e" : "#ffffff",
        fillOpacity: submissionCount > 0 ? 0.85 : 0.95,
      });

      const popup = L.popup({ closeButton: true }).setContent(
        `<div style="min-width:10rem;font-family:system-ui,sans-serif">
          <p style="margin:0;font-weight:700">${escapeHtml(beach.name)}</p>
          <p style="margin:0.35rem 0 0;font-size:0.875rem">${escapeHtml(cleanupSummaryLabel(stats))}</p>
          <button
            type="button"
            data-beach-id="${escapeHtml(beach.id)}"
            style="margin-top:0.6rem;width:100%;border:0;border-radius:0.375rem;background:#0f766e;color:#fff;font-weight:700;font-size:0.875rem;padding:0.55rem 0.75rem;cursor:pointer"
          >
            Log your clean
          </button>
        </div>`,
      );

      marker.bindPopup(popup);
      marker.on("popupopen", () => {
        const button = document.querySelector(
          `button[data-beach-id="${beach.id}"]`,
        );
        if (button instanceof HTMLButtonElement) {
          button.onclick = () => {
            map.closePopup();
            onLogCleanupRef.current(beach.id);
          };
        }
      });

      marker.addTo(layer);
    }

    boundsRef.current = bounds;
    if (bounds.length > 0) {
      map.fitBounds(bounds as import("leaflet").LatLngBoundsExpression, {
        padding: expanded ? [48, 48] : [24, 24],
        maxZoom: expanded ? 14 : 15,
      });
    }

    map.invalidateSize();
  }, [beaches, cleanupStatsById, mapReady, expanded]);

  if (mapError) {
    return (
      <div
        role="status"
        className="border border-line bg-surface px-3 py-4 text-meta"
      >
        {mapError}
      </div>
    );
  }

  return (
    <>
      {expanded ? (
        <div
          className="h-64 w-full min-h-64 border border-line bg-paper sm:h-72"
          aria-hidden
        />
      ) : null}

      <div
        className={cn(
          "overflow-hidden border border-line bg-paper",
          expanded &&
            "fixed inset-0 z-50 flex h-[100dvh] max-h-[100dvh] flex-col border-0",
        )}
        role={expanded ? "dialog" : undefined}
        aria-modal={expanded || undefined}
        aria-label={expanded ? "Expanded beaches map" : undefined}
      >
        {expanded ? (
          <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-line bg-paper px-3 py-2">
            <h2 className="text-sm font-bold text-ink">Beaches map</h2>
            <IconButton label="Close map" onClick={closeExpanded}>
              ×
            </IconButton>
          </div>
        ) : null}

        <div className={cn("relative", expanded ? "min-h-0 flex-1" : "")}>
          {!mapReady ? (
            <p className="px-3 py-3 text-meta" role="status">
              Loading map…
            </p>
          ) : null}

          {!expanded && mapReady ? (
            <Button
              type="button"
              variant="secondary"
              className="absolute right-2 top-2 z-[1000] min-h-9 px-3 py-1.5 text-xs shadow-sm"
              onClick={() => setExpanded(true)}
            >
              Expand map
            </Button>
          ) : null}

          <div
            id={`checkin-map-${mapId}`}
            ref={containerRef}
            className={cn(
              "w-full",
              expanded ? "h-full min-h-[12rem]" : "h-64 min-h-64 sm:h-72",
            )}
            role="img"
            aria-label="Map of North Tyneside beaches used to log clean-ups. Full details are listed below."
          />
        </div>

        <p
          className={cn(
            "border-t border-line px-3 py-2 text-xs leading-snug text-mute sm:hidden",
            expanded && "relative z-10 shrink-0 bg-paper",
          )}
        >
          {expanded
            ? "Use two fingers to move the map."
            : "Use two fingers to move the map. One finger scrolls the page."}
        </p>
      </div>
    </>
  );
}
