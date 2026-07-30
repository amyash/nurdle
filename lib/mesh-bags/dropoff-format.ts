import { checkinBeaches } from "@/data/checkin-beaches";
import { collectionPoints } from "@/data/collection-points";
import type { MeshBagDropoffLocationOption } from "@/types/mesh-bag-dropoffs";

export const MESH_BAG_DROPOFF_QUANTITY_MAX = 500;
export const MESH_BAG_DROPOFF_NAME_MAX = 40;
export const MESH_BAG_DROPOFF_OTHER_MAX = 80;
export const MESH_BAG_DROPOFF_VISIBLE_HOURS = 24;

export function meshBagDropoffLocations(): MeshBagDropoffLocationOption[] {
  const beaches = checkinBeaches.map((beach) => ({
    id: `beach:${beach.id}`,
    label: beach.name,
  }));
  const dropoffs = collectionPoints.map((point) => ({
    id: `dropoff:${point.id}`,
    label: point.description
      ? `${point.name} — ${point.description.replace(/\.$/, "")}`
      : point.name,
  }));
  return [
    ...beaches,
    ...dropoffs,
    { id: "other", label: "Other location" },
  ];
}

export function displayLocationLabel(
  locationLabel: string,
  locationOther: string | null,
): string {
  if (locationOther && locationOther.trim()) return locationOther.trim();
  return locationLabel;
}

export function formatDropoffTime(iso: string): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return iso;
  return new Date(ms).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  });
}

export function formatDropoffListItem(params: {
  quantity: number;
  locationLabel: string;
  locationOther: string | null;
  droppedAt: string;
}): string {
  const place = displayLocationLabel(
    params.locationLabel,
    params.locationOther,
  );
  const time = formatDropoffTime(params.droppedAt);
  const bags = params.quantity === 1 ? "bag" : "bags";
  return `${params.quantity} ${bags} at ${place} at ${time}`;
}

export function sanitiseMakerName(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long" | "invalid";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > MESH_BAG_DROPOFF_NAME_MAX) {
    return { ok: false, reason: "too_long" };
  }
  if (!/^[\p{L}][\p{L}\s'-]{0,39}$/u.test(trimmed)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, value: trimmed };
}

export function sanitiseOtherLocation(raw: string | null | undefined): {
  ok: true;
  value: string | null;
} | {
  ok: false;
  reason: "too_long" | "required";
} {
  if (raw == null) return { ok: true, value: null };
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > MESH_BAG_DROPOFF_OTHER_MAX) {
    return { ok: false, reason: "too_long" };
  }
  return { ok: true, value: trimmed };
}

export function localDateTimeInputValue(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** Parse datetime-local value (browser local wall time) → ISO. */
export function londonLocalInputToIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}
