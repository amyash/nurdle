"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CollectionPoint } from "@/data/collection-points";
import "leaflet/dist/leaflet.css";

type LeafletModule = typeof import("leaflet");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createDropOffIcon(L: LeafletModule) {
  return L.divIcon({
    className: "collection-point-marker",
    html: `<div style="
      width:28px;height:28px;border-radius:6px;
      background:#111827;border:2px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:14px;font-weight:700;line-height:1;
    " aria-hidden="true">▣</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

export function CollectionPointsMap({
  points,
  focusId,
  onFocusHandled,
}: {
  points: CollectionPoint[];
  focusId: string | null;
  onFocusHandled?: () => void;
}) {
  const mapId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const leafletRef = useRef<LeafletModule | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

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
          maxZoom: 19,
        }).addTo(map);

        const icon = createDropOffIcon(L);
        const bounds: import("leaflet").LatLngExpression[] = [];
        const markers = new Map<string, import("leaflet").Marker>();

        for (const point of points) {
          const latLng: import("leaflet").LatLngExpression = [
            point.latitude,
            point.longitude,
          ];
          bounds.push(latLng);
          const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${point.latitude},${point.longitude}`,
          )}`;

          const marker = L.marker(latLng, { icon }).bindPopup(
            `<div style="min-width:11rem;font-family:system-ui,sans-serif">
              <p style="margin:0;font-weight:700">${escapeHtml(point.name)}</p>
              <p style="margin:0.35rem 0 0;font-size:0.8rem;line-height:1.35">${escapeHtml(point.description)}</p>
              <p style="margin:0.45rem 0 0;font-size:0.75rem;font-weight:700">Official council collection point</p>
              <a href="${escapeHtml(directions)}" target="_blank" rel="noopener noreferrer"
                style="display:inline-block;margin-top:0.55rem;font-size:0.85rem;font-weight:700;color:#0f766e">
                Get directions (opens Google Maps)
              </a>
            </div>`,
            { maxWidth: 260 },
          );
          marker.addTo(map);
          markers.set(point.id, marker);
        }

        markersRef.current = markers;
        mapRef.current = map;

        if (bounds.length > 0) {
          map.fitBounds(bounds as import("leaflet").LatLngBoundsExpression, {
            padding: [40, 40],
            maxZoom: 14,
          });
        }

        setMapReady(true);
        map.invalidateSize();
      } catch {
        if (!cancelled) {
          setMapError(
            "The map couldn’t load on this device. Use the collection-point list below instead.",
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
      }
      markersRef.current.clear();
    };
  }, [points]);

  useEffect(() => {
    if (!focusId || !mapReady) return;
    const map = mapRef.current;
    const marker = markersRef.current.get(focusId);
    const point = points.find((p) => p.id === focusId);
    if (!map || !marker || !point) return;

    map.setView([point.latitude, point.longitude], 16, { animate: true });
    marker.openPopup();
    onFocusHandled?.();
  }, [focusId, mapReady, points, onFocusHandled]);

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
    <div id="collection-points-map" className="scroll-mt-24">
      <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-white">
        {!mapReady ? (
          <p className="px-3 py-3 text-sm text-[var(--mute)]" role="status">
            Loading collection-point map…
          </p>
        ) : null}
        <div
          id={`collection-map-${mapId}`}
          ref={containerRef}
          className="h-72 w-full min-h-[18rem]"
          role="img"
          aria-label="Map of official North Tyneside Council nurdle collection points. Full details are listed below."
        />
      </div>

      <div
        className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--mute)]"
        aria-label="Map legend"
      >
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] border-2 border-white bg-[var(--ink)] text-[10px] font-bold text-white shadow-sm"
            aria-hidden="true"
          >
            ▣
          </span>
          Official collection point
        </span>
      </div>
      <p className="sr-only">
        This map shows official collection points only. It does not show
        volunteer check-in locations.
      </p>
    </div>
  );
}
