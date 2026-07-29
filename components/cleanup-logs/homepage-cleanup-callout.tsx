"use client";

import { useEffect, useState } from "react";
import { CleanupOverallCallout } from "@/components/cleanup-logs/cleanup-overall-callout";
import { checkinBeaches } from "@/data/checkin-beaches";
import {
  emptyCleanupStats,
  fetchCleanupStats,
} from "@/lib/cleanup-logs/api";
import type { CleanupStatsResponse } from "@/types/cleanup-log";

export function HomepageCleanupCallout() {
  const [stats, setStats] = useState<CleanupStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const result = await fetchCleanupStats();
      if (cancelled) return;
      if (result.ok) {
        setStats(result.stats);
      } else {
        setStats(emptyCleanupStats());
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CleanupOverallCallout
      stats={stats}
      loading={loading}
      activeBeachCount={checkinBeaches.length}
    />
  );
}
