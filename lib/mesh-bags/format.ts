import type { MeshBagRequest } from "@/types/mesh-bags";

export const MESH_BAG_NAME_MAX = 40;
export const MESH_BAG_NOTE_MAX = 500;
export const MESH_BAG_QUANTITY_MAX = 999;

function bagsWord(count: number): string {
  return count === 1 ? "bag" : "bags";
}

export function formatNeededShort(
  request: Pick<MeshBagRequest, "neededType" | "neededAt">,
  nowMs: number = Date.now(),
): string {
  if (request.neededType === "asap" || !request.neededAt) {
    return "ASAP";
  }

  const neededMs = Date.parse(request.neededAt);
  if (Number.isNaN(neededMs)) return "scheduled";

  const needed = new Date(neededMs);
  const now = new Date(nowMs);
  const time = needed.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/London",
  });

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfNeeded = new Date(needed);
  startOfNeeded.setHours(0, 0, 0, 0);
  const dayDiff = Math.round(
    (startOfNeeded.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  if (dayDiff === 0) return `today ${time}`;
  if (dayDiff === 1) return `tomorrow ${time}`;

  const date = needed.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  });
  return `${date} ${time}`;
}

export function formatDeliveredAt(iso: string | null): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
}

export function requesterLabel(name: string | null): string {
  return name?.trim() ? `Requested by ${name.trim()}` : "Requested anonymously";
}

/** Compact card summary lines for one beach (text + status words; not colour alone). */
export function beachBagSummary(requests: MeshBagRequest[], nowMs: number = Date.now()): {
  primary: string | null;
  detail: string | null;
  tone: "requested" | "delivered" | "none";
} {
  const active = requests.filter((r) => r.status === "requested");
  const delivered = requests.filter((r) => r.status === "delivered");

  if (active.length === 0) {
    if (delivered.length === 0) {
      return { primary: null, detail: null, tone: "none" };
    }
    const total = delivered.reduce((sum, r) => sum + r.quantityRequested, 0);
    const latest = delivered
      .map((r) => r.deliveredAt)
      .filter(Boolean)
      .sort()
      .at(-1);
    const time = formatDeliveredAt(latest ?? null);
    return {
      primary: time
        ? `${total} ${bagsWord(total)} delivered at ${time}`
        : `${total} ${bagsWord(total)} delivered`,
      detail: null,
      tone: "delivered",
    };
  }

  const total = active.reduce((sum, r) => sum + r.quantityRequested, 0);
  const asapTotal = active
    .filter((r) => r.neededType === "asap")
    .reduce((sum, r) => sum + r.quantityRequested, 0);
  const scheduled = active.filter((r) => r.neededType === "scheduled");

  if (asapTotal === total && scheduled.length === 0) {
    return {
      primary: `${total} ${bagsWord(total)} requested ASAP`,
      detail: null,
      tone: "requested",
    };
  }

  if (asapTotal === 0 && scheduled.length === 1) {
    const only = scheduled[0];
    return {
      primary: `${total} ${bagsWord(total)} requested`,
      detail: formatNeededShort(only, nowMs),
      tone: "requested",
    };
  }

  const parts: string[] = [];
  if (asapTotal > 0) parts.push(`${asapTotal} ASAP`);
  for (const row of scheduled) {
    parts.push(
      `${row.quantityRequested} ${formatNeededShort(row, nowMs)}`,
    );
  }

  return {
    primary: `${total} ${bagsWord(total)} requested`,
    detail: parts.join(" · "),
    tone: "requested",
  };
}

export function sanitiseMeshBagName(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long" | "invalid";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > MESH_BAG_NAME_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (!/^[\p{L}][\p{L}\s'-]{0,39}$/u.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

export function sanitiseMeshBagNote(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > MESH_BAG_NOTE_MAX) {
    return { ok: false, reason: "too_long" };
  }
  return { ok: true, value: trimmed };
}
