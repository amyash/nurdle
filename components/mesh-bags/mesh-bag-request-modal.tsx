"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  MESH_BAG_NAME_MAX,
  MESH_BAG_NOTE_MAX,
  MESH_BAG_QUANTITY_MAX,
} from "@/lib/mesh-bags/format";
import type { MeshBagNeededType } from "@/types/mesh-bags";

export function MeshBagRequestModal({
  beachName,
  open,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  beachName: string;
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: {
    quantityRequested: number;
    neededType: MeshBagNeededType;
    neededAt: string | null;
    requesterName: string;
    note: string;
  }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const quantityId = useId();
  const neededId = useId();
  const dateId = useId();
  const timeId = useId();
  const nameId = useId();
  const noteId = useId();
  const errorId = useId();
  const [neededType, setNeededType] = useState<MeshBagNeededType>("asap");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      formRef.current?.reset();
      setNeededType("asap");
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed left-1/2 top-1/2 z-50 m-0 max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[var(--line)] bg-white p-0 text-[var(--ink)] shadow-lg open:backdrop:bg-black/40"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !busy) onClose();
      }}
    >
      <form
        ref={formRef}
        className="px-4 py-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (busy) return;
          const data = new FormData(event.currentTarget);
          const quantityRequested = Number(data.get("quantity"));
          const type = String(data.get("neededType") ?? "asap") as MeshBagNeededType;
          const date = String(data.get("neededDate") ?? "");
          const time = String(data.get("neededTime") ?? "");
          let neededAt: string | null = null;
          if (type === "scheduled" && date && time) {
            neededAt = new Date(`${date}T${time}`).toISOString();
          }
          onSubmit({
            quantityRequested,
            neededType: type,
            neededAt,
            requesterName: String(data.get("requesterName") ?? ""),
            note: String(data.get("note") ?? ""),
          });
        }}
      >
        <h2 id={titleId} className="text-lg font-bold leading-snug">
          Request mesh bags for {beachName}
        </h2>

        <div className="mt-4">
          <label htmlFor={quantityId} className="block text-sm font-bold">
            How many bags are needed?
          </label>
          <input
            id={quantityId}
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={MESH_BAG_QUANTITY_MAX}
            required
            disabled={busy}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base text-[var(--ink)]"
          />
        </div>

        <fieldset className="mt-4" disabled={busy}>
          <legend id={neededId} className="text-sm font-bold">
            When are they needed?
          </legend>
          <div className="mt-2 space-y-2">
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="radio"
                name="neededType"
                value="asap"
                checked={neededType === "asap"}
                onChange={() => setNeededType("asap")}
              />
              ASAP
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="radio"
                name="neededType"
                value="scheduled"
                checked={neededType === "scheduled"}
                onChange={() => setNeededType("scheduled")}
              />
              Choose date &amp; time
            </label>
          </div>
        </fieldset>

        {neededType === "scheduled" ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={dateId} className="block text-sm font-bold">
                Date
              </label>
              <input
                id={dateId}
                name="neededDate"
                type="date"
                required
                disabled={busy}
                className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base text-[var(--ink)]"
              />
            </div>
            <div>
              <label htmlFor={timeId} className="block text-sm font-bold">
                Time
              </label>
              <input
                id={timeId}
                name="neededTime"
                type="time"
                required
                disabled={busy}
                className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base text-[var(--ink)]"
              />
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <label htmlFor={nameId} className="block text-sm font-bold">
            Your name{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <input
            id={nameId}
            name="requesterName"
            type="text"
            autoComplete="given-name"
            maxLength={MESH_BAG_NAME_MAX}
            disabled={busy}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base text-[var(--ink)]"
          />
        </div>

        <div className="mt-4">
          <label htmlFor={noteId} className="block text-sm font-bold">
            Additional notes{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <textarea
            id={noteId}
            name="note"
            rows={3}
            maxLength={MESH_BAG_NOTE_MAX}
            disabled={busy}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base text-[var(--ink)]"
          />
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="mt-3 text-sm font-bold text-red-800"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? "Submitting…" : "Submit request"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--ink)] disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
