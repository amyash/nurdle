"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { WildlifeReportPublic } from "@/types/wildlife";
import {
  conditionLabel,
  displaySpecies,
  formatObservedDate,
} from "@/lib/wildlife/format";

export function WildlifeRemoveModal({
  report,
  open,
  busy,
  error,
  onClose,
  onConfirm,
}: {
  report: WildlifeReportPublic | null;
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: (email: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const emailId = useId();
  const helpId = useId();
  const errorId = useId();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setLocalError(null);
      formRef.current?.reset();
      dialog.showModal();
      dialog.focus({ preventScroll: true });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!report) return null;

  const displayError = localError ?? error;
  const species = displaySpecies(report.animalType, report.species);

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 m-0 hidden h-[100dvh] max-h-[100dvh] w-full max-w-none items-center justify-center overflow-hidden border-0 bg-transparent p-4 text-[var(--ink)] outline-none open:flex open:backdrop:bg-black/40"
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
        className="w-full max-w-sm rounded-lg border border-[var(--line)] bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <form
          ref={formRef}
          className="px-4 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (busy) return;
            setLocalError(null);
            const data = new FormData(event.currentTarget);
            const email = String(data.get("email") ?? "").trim();
            if (!email) {
              setLocalError(
                "Enter the email address used on the original report.",
              );
              return;
            }
            onConfirm(email);
          }}
        >
          <h2 id={titleId} className="text-lg font-bold leading-snug">
            Remove this report?
          </h2>
          <p className="mt-2 text-sm leading-snug text-[var(--mute)]">
            {species} · {conditionLabel(report.condition)} ·{" "}
            {formatObservedDate(report.dateObserved)}
          </p>
          <p id={helpId} className="mt-3 text-sm leading-snug text-[var(--mute)]">
            To confirm you’re the person who submitted it, enter the email
            address used on the report. Your email is never shown publicly.
          </p>

          <label htmlFor={emailId} className="mt-4 block text-sm font-bold">
            Email used on the report
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            disabled={busy}
            autoComplete="email"
            aria-describedby={helpId}
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
          />

          {displayError ? (
            <p
              id={errorId}
              role="alert"
              className="mt-3 text-sm leading-snug text-red-800"
            >
              {displayError}
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--ink)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--ink)] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {busy ? "Removing…" : "Remove report"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
