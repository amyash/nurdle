"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  MESH_BAG_DROPOFF_NAME_MAX,
  MESH_BAG_DROPOFF_OTHER_MAX,
  MESH_BAG_DROPOFF_QUANTITY_MAX,
  localDateTimeInputValue,
  londonLocalInputToIso,
  meshBagDropoffLocations,
} from "@/lib/mesh-bags/dropoff-format";

export function MeshBagDropoffModal({
  open,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: {
    quantity: number;
    locationId: string;
    locationLabel: string;
    locationOther: string | null;
    droppedAt: string;
    makerName: string | null;
  }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const quantityId = useId();
  const locationId = useId();
  const otherId = useId();
  const timeId = useId();
  const nameId = useId();
  const nameHelpId = useId();
  const errorId = useId();
  const [localError, setLocalError] = useState<string | null>(null);
  const [locationValue, setLocationValue] = useState("");
  const locations = meshBagDropoffLocations();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setLocalError(null);
      setLocationValue("");
      formRef.current?.reset();
      const quantity = formRef.current?.elements.namedItem(
        "quantity",
      ) as HTMLInputElement | null;
      if (quantity) quantity.value = "1";
      const droppedAt = formRef.current?.elements.namedItem(
        "droppedAt",
      ) as HTMLInputElement | null;
      if (droppedAt) droppedAt.value = localDateTimeInputValue();
      dialog.showModal();
      if (panelRef.current) panelRef.current.scrollTop = 0;
      dialog.focus({ preventScroll: true });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const displayError = localError ?? error;
  const showOther = locationValue === "other";

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 m-0 hidden h-[100dvh] max-h-[100dvh] w-full max-w-none items-center justify-center overflow-hidden border-0 bg-transparent p-4 text-[var(--ink)] outline-none focus:outline-none focus-visible:outline-none open:flex open:backdrop:bg-black/40"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !busy) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="max-h-[90dvh] w-full min-w-0 max-w-sm overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-[var(--line)] bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <form
          ref={formRef}
          className="min-w-0 px-4 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (busy) return;
            setLocalError(null);
            const data = new FormData(event.currentTarget);
            const quantity = Number(data.get("quantity"));
            const selectedId = String(data.get("locationId") ?? "");
            const otherRaw = String(data.get("locationOther") ?? "").trim();
            const droppedRaw = String(data.get("droppedAt") ?? "");
            const nameRaw = String(data.get("makerName") ?? "").trim();

            if (
              !Number.isInteger(quantity) ||
              quantity < 1 ||
              quantity > MESH_BAG_DROPOFF_QUANTITY_MAX
            ) {
              setLocalError("Enter how many bags you dropped off (1–500).");
              return;
            }

            const selected = locations.find((item) => item.id === selectedId);
            if (!selected) {
              setLocalError("Choose where the bags were dropped off.");
              return;
            }

            if (selectedId === "other" && !otherRaw) {
              setLocalError("Enter the other location.");
              return;
            }
            if (otherRaw.length > MESH_BAG_DROPOFF_OTHER_MAX) {
              setLocalError(
                "Other location needs to be 80 characters or fewer.",
              );
              return;
            }

            const droppedAt = londonLocalInputToIso(droppedRaw);
            if (!droppedAt) {
              setLocalError("Choose when the bags were dropped off.");
              return;
            }

            if (nameRaw.length > MESH_BAG_DROPOFF_NAME_MAX) {
              setLocalError("Names need to be 40 characters or fewer.");
              return;
            }

            onSubmit({
              quantity,
              locationId: selectedId,
              locationLabel:
                selectedId === "other" ? otherRaw : selected.label,
              locationOther: selectedId === "other" ? otherRaw : null,
              droppedAt,
              makerName: nameRaw || null,
            });
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className="text-lg font-bold leading-snug">
              Log a bag drop-off
            </h2>
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-xl leading-none text-[var(--mute)] hover:bg-[var(--board)] disabled:opacity-60"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <p className="mt-2 text-sm leading-snug text-[var(--mute)]">
            Tell volunteers where bags are available. Entries disappear after 24
            hours.
          </p>

          <label
            htmlFor={quantityId}
            className="mt-4 block text-sm font-bold text-[var(--ink)]"
          >
            Number of bags
          </label>
          <input
            id={quantityId}
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={MESH_BAG_DROPOFF_QUANTITY_MAX}
            step={1}
            required
            defaultValue={1}
            disabled={busy}
            className="mt-1 w-full min-w-0 rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
          />

          <label
            htmlFor={locationId}
            className="mt-4 block text-sm font-bold text-[var(--ink)]"
          >
            Drop-off location
          </label>
          <select
            id={locationId}
            name="locationId"
            required
            disabled={busy}
            value={locationValue}
            onChange={(event) => setLocationValue(event.target.value)}
            className="mt-1 w-full min-w-0 rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          >
            <option value="" disabled>
              Choose a location
            </option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.label}
              </option>
            ))}
          </select>

          {showOther ? (
            <>
              <label
                htmlFor={otherId}
                className="mt-3 block text-sm font-bold text-[var(--ink)]"
              >
                Other location
              </label>
              <input
                id={otherId}
                name="locationOther"
                type="text"
                required
                maxLength={MESH_BAG_DROPOFF_OTHER_MAX}
                disabled={busy}
                autoComplete="off"
                className="mt-1 w-full min-w-0 rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
                placeholder="Where did you leave the bags?"
              />
            </>
          ) : (
            <input type="hidden" name="locationOther" value="" />
          )}

          <label
            htmlFor={timeId}
            className="mt-4 block text-sm font-bold text-[var(--ink)]"
          >
            Drop-off time
          </label>
          <input
            id={timeId}
            name="droppedAt"
            type="datetime-local"
            required
            disabled={busy}
            className="mt-1 w-full max-w-full min-w-0 rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
          />

          <label
            htmlFor={nameId}
            className="mt-4 block text-sm font-bold text-[var(--ink)]"
          >
            Your name{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <input
            id={nameId}
            name="makerName"
            type="text"
            maxLength={MESH_BAG_DROPOFF_NAME_MAX}
            disabled={busy}
            autoComplete="given-name"
            aria-describedby={nameHelpId}
            className="mt-1 w-full min-w-0 rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
          />
          <p id={nameHelpId} className="mt-1 text-xs leading-snug text-[var(--mute)]">
            Not shown publicly unless we decide to use it later.
          </p>

          {displayError ? (
            <p
              id={errorId}
              role="alert"
              className="mt-3 text-sm leading-snug text-red-800"
            >
              {displayError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? "Saving…" : "Log drop-off"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
