"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { WildlifeReportPublic } from "@/types/wildlife";
import {
  conditionLabel,
  displaySpecies,
  formatObservedDate,
} from "@/lib/wildlife/format";
import "leaflet/dist/leaflet.css";

type LeafletModule = typeof import("leaflet");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type BeachCluster = {
  beachId: string;
  beachName: string;
  latitude: number;
  longitude: number;
  reports: WildlifeReportPublic[];
};

function clusterByBeach(reports: WildlifeReportPublic[]): BeachCluster[] {
  const map = new Map<string, BeachCluster>();
  for (const report of reports) {
    const existing = map.get(report.beachId);
    if (existing) {
      existing.reports.push(report);
    } else {
      map.set(report.beachId, {
        beachId: report.beachId,
        beachName: report.beachName,
        latitude: report.latitude,
        longitude: report.longitude,
        reports: [report],
      });
    }
  }
  return Array.from(map.values());
}

function popupHtml(cluster: BeachCluster): string {
  const items = cluster.reports
    .slice(0, 5)
    .map((report) => {
      const species = escapeHtml(
        displaySpecies(report.animalType, report.species),
      );
      const condition = escapeHtml(conditionLabel(report.condition));
      const date = escapeHtml(formatObservedDate(report.dateObserved));
      const description = escapeHtml(
        report.description.length > 120
          ? `${report.description.slice(0, 117)}…`
          : report.description,
      );
      const evidence = report.hasSupportingEvidence
        ? `<p style="margin:0.35rem 0 0;font-size:0.75rem;font-weight:700">📷 Photo evidence available</p>`
        : "";
      return `<div style="margin-top:0.65rem;padding-top:0.55rem;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-weight:700">${species}</p>
        <p style="margin:0.2rem 0 0;font-size:0.8rem">${condition} · ${date}</p>
        <p style="margin:0.35rem 0 0;font-size:0.8rem;line-height:1.35">${description}</p>
        ${evidence}
      </div>`;
    })
    .join("");

  const more =
    cluster.reports.length > 5
      ? `<p style="margin:0.55rem 0 0;font-size:0.75rem;color:#6b7280">+${cluster.reports.length - 5} more at this beach</p>`
      : "";

  return `<div style="min-width:12rem;max-width:16rem;font-family:system-ui,sans-serif">
    <p style="margin:0;font-weight:700">${escapeHtml(cluster.beachName)}</p>
    <p style="margin:0.25rem 0 0;font-size:0.75rem;color:#6b7280">${cluster.reports.length} report${cluster.reports.length === 1 ? "" : "s"}</p>
    ${items}
    ${more}
  </div>`;
}

export function WildlifeImpactMap({
  reports,
}: {
  reports: WildlifeReportPublic[];
}) {
  const mapId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const clusters = useMemo(() => clusterByBeach(reports), [reports]);

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
        }).setView([55.04, -1.44], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const layer = L.layerGroup().addTo(map);
        layerRef.current = layer;
        mapRef.current = map;
        setMapReady(true);
      } catch {
        if (!cancelled) {
          setMapError("Map couldn’t load. The report list below still works.");
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
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer || !mapReady) return;

    layer.clearLayers();
    if (clusters.length === 0) return;

    const bounds: import("leaflet").LatLngExpression[] = [];
    for (const cluster of clusters) {
      const latLng: import("leaflet").LatLngExpression = [
        cluster.latitude,
        cluster.longitude,
      ];
      bounds.push(latLng);
      const radius = Math.min(14, 8 + cluster.reports.length * 1.5);
      const marker = L.circleMarker(latLng, {
        radius,
        color: "#111827",
        weight: 2,
        fillColor: "#0f766e",
        fillOpacity: 0.85,
      });
      marker.bindPopup(popupHtml(cluster), { maxWidth: 280 });
      marker.bindTooltip(
        `${cluster.beachName}: ${cluster.reports.length} report${cluster.reports.length === 1 ? "" : "s"}`,
      );
      marker.addTo(layer);
    }

    if (bounds.length === 1) {
      map.setView(bounds[0], 13);
    } else {
      map.fitBounds(L.latLngBounds(bounds).pad(0.2));
    }
  }, [clusters, mapReady]);

  if (mapError) {
    return (
      <p role="status" className="text-meta">
        {mapError}
      </p>
    );
  }

  return (
    <div
      id={`wildlife-map-${mapId}`}
      ref={containerRef}
      className="h-72 w-full overflow-hidden rounded-card border border-line bg-board sm:h-80"
      role="region"
      aria-label="Map of verified wildlife reports"
    />
  );
}
