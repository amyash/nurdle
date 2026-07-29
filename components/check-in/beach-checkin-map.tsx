"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CheckinBeach } from "@/data/checkin-beaches";
import type { BeachCheckinStats } from "@/types/check-in";
import { volunteerCountLabel } from "@/lib/check-in/format";
import "leaflet/dist/leaflet.css";

type LeafletModule = typeof import("leaflet");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function markerRadius(count: number): number {
  if (count <= 0) return 10;
  if (count < 5) return 12;
  if (count < 15) return 15;
  return 18;
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
  statsById,
  checkedInBeachId,
  onCheckInRequest,
}: {
  beaches: CheckinBeach[];
  statsById: Record<string, BeachCheckinStats | undefined>;
  checkedInBeachId: string | null;
  onCheckInRequest: (beachId: string) => void;
}) {
  const mapId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const onCheckInRef = useRef(onCheckInRequest);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    onCheckInRef.current = onCheckInRequest;
  }, [onCheckInRequest]);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;

      try {
        const L = await import("leaflet");
        if (cancelled || !containerRef.current) return;

        leafletRef.current = L;
        const map = L.map(containerRef.current, {
          scrollWheelZoom: false,
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
            "The map couldn’t load on this device. Use the beach list below to check in.",
          );
        }
      }
    }

    void initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    const L = leafletRef.current;
    if (!map || !layer || !L || !mapReady) return;

    layer.clearLayers();
    const bounds: import("leaflet").LatLngExpression[] = [];

    for (const beach of beaches) {
      const count = statsById[beach.id]?.volunteerCount ?? 0;
      const isHere = checkedInBeachId === beach.id;
      const latLng: import("leaflet").LatLngExpression = [
        beach.latitude,
        beach.longitude,
      ];
      bounds.push(latLng);

      const radius = markerRadius(count);
      const marker = L.circleMarker(latLng, {
        radius,
        color: isHere ? "#0f766e" : "#111827",
        weight: isHere ? 3 : 2,
        fillColor: count > 0 ? "#0f766e" : "#ffffff",
        fillOpacity: count > 0 ? 0.85 : 0.95,
      });

      const popup = L.popup({ closeButton: true }).setContent(
        `<div style="min-width:10rem;font-family:system-ui,sans-serif">
          <p style="margin:0;font-weight:700">${escapeHtml(beach.name)}</p>
          <p style="margin:0.35rem 0 0;font-size:0.875rem">${escapeHtml(volunteerCountLabel(count))}</p>
          <button
            type="button"
            data-beach-id="${escapeHtml(beach.id)}"
            style="margin-top:0.6rem;width:100%;border:0;border-radius:0.375rem;background:#0f766e;color:#fff;font-weight:700;font-size:0.875rem;padding:0.55rem 0.75rem;cursor:pointer"
          >
            Check in here
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
            onCheckInRef.current(beach.id);
          };
        }
      });

      marker.bindTooltip(
        `${beach.name}: ${count}`,
        { direction: "top", opacity: 0.95 },
      );

      marker.addTo(layer);
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds as import("leaflet").LatLngBoundsExpression, {
        padding: [24, 24],
        maxZoom: 15,
      });
      // One step closer so nearby beaches (e.g. Whitley Bay) stay distinct
      const zoom = map.getZoom();
      if (typeof zoom === "number") {
        map.setZoom(Math.min(zoom + 1, 15));
      }
    }

    map.invalidateSize();
  }, [beaches, statsById, checkedInBeachId, mapReady]);

  if (mapError) {
    return (
      <div
        role="status"
        className="rounded-lg border border-[var(--line)] bg-white px-3 py-4 text-sm leading-snug text-[var(--mute)]"
      >
        {mapError}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-white">
      {!mapReady ? (
        <p className="px-3 py-3 text-sm text-[var(--mute)]" role="status">
          Loading map…
        </p>
      ) : null}
      <div
        id={`checkin-map-${mapId}`}
        ref={containerRef}
        className="h-64 w-full min-h-[16rem] sm:h-72"
        role="img"
        aria-label="Map of North Tyneside beaches used for volunteer check-in. Full details are listed below."
      />
      <p className="border-t border-[var(--line)] px-3 py-2 text-xs leading-snug text-[var(--mute)] sm:hidden">
        Use two fingers to move the map. One finger scrolls the page.
      </p>
    </div>
  );
}
