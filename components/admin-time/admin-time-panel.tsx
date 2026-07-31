"use client";

import { useEffect, useId, useState } from "react";
import { AdminTimeLogModal } from "@/components/admin-time/admin-time-log-modal";
import { AdminTimeSuccessModal } from "@/components/admin-time/admin-time-success-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createAdminTimeLog,
  fetchAdminTimeStats,
} from "@/lib/admin-time/api";
import { formatAdminHours } from "@/lib/admin-time/format";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { AdminTimeStats } from "@/types/admin-time";

function emptyStats(): AdminTimeStats {
  return { totalDurationMinutes: 0, submissionCount: 0 };
}

export function AdminTimePanel() {
  const configured = isSupabaseConfigured();
  const titleId = useId();
  const [stats, setStats] = useState<AdminTimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setStats(emptyStats());
          setLoading(false);
        }
        return;
      }
      const result = await fetchAdminTimeStats();
      if (cancelled) return;
      if (result.ok) {
        setStats(result.stats);
      } else {
        setStats(emptyStats());
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function openForm() {
    setActionError(null);
    if (!configured) {
      setActionError(
        "Admin time logging isn’t connected yet. Please try again later.",
      );
      return;
    }
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(input: {
    workDate: string;
    durationMinutes: number;
    category: string;
    personName: string;
    notes: string;
  }) {
    if (busy) return;
    setBusy(true);
    setFormError(null);
    const result = await createAdminTimeLog({
      workDate: input.workDate,
      durationMinutes: input.durationMinutes,
      category: input.category,
      personName: input.personName || null,
      notes: input.notes || null,
    });
    setBusy(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    setFormOpen(false);
    setShowSuccess(true);
    const statsResult = await fetchAdminTimeStats();
    if (statsResult.ok) setStats(statsResult.stats);
  }

  return (
    <>
      <Card padding="sm" aria-labelledby={titleId}>
        <h3 id={titleId} className="text-eyebrow text-mute">
          Organising &amp; admin time
        </h3>
        <p className="mt-2 text-meta">
          Log non-beach volunteer hours — website work, coordination,
          communications, sewing supplies, and other organising.
        </p>

        <p className="mt-2 text-sm font-bold text-ink" role="status">
          {loading
            ? "Loading admin totals…"
            : formatAdminHours(stats?.totalDurationMinutes ?? 0)}
        </p>

        {actionError ? (
          <p role="alert" className="mt-2 text-sm leading-snug text-red-800">
            {actionError}
          </p>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={busy}
          onClick={openForm}
          className="mt-3 border-ink"
        >
          Log admin time
        </Button>
      </Card>

      <AdminTimeLogModal
        open={formOpen}
        busy={busy}
        error={formError}
        onClose={() => {
          if (!busy) setFormOpen(false);
        }}
        onSubmit={(input) => void handleSubmit(input)}
      />

      <AdminTimeSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
