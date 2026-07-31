"use client";

import { useEffect, useState } from "react";
import { CleanupOverallCallout } from "@/components/cleanup-logs/cleanup-overall-callout";
import { checkinBeaches } from "@/data/checkin-beaches";
import { fetchAdminTimeStats } from "@/lib/admin-time/api";
import {
  emptyCleanupStats,
  fetchCleanupStats,
} from "@/lib/cleanup-logs/api";
import type { CleanupStatsResponse } from "@/types/cleanup-log";

export function HomepageCleanupCallout() {
  const [stats, setStats] = useState<CleanupStatsResponse | null>(null);
  const [adminTotalMinutes, setAdminTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [cleanupResult, adminResult] = await Promise.all([
        fetchCleanupStats(),
        fetchAdminTimeStats(),
      ]);
      if (cancelled) return;
      if (cleanupResult.ok) {
        setStats(cleanupResult.stats);
      } else {
        setStats(emptyCleanupStats());
      }
      if (adminResult.ok) {
        setAdminTotalMinutes(adminResult.stats.totalDurationMinutes);
      } else {
        setAdminTotalMinutes(0);
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
      adminTotalMinutes={adminTotalMinutes}
      loading={loading}
      activeBeachCount={checkinBeaches.length}
    />
  );
}
