"use client";

import { useEffect, useId, useRef } from "react";
import { FIRST_NAME_MAX_LENGTH } from "@/lib/check-in/format";

export function CheckInModal({
  beachName,
  open,
  busy,
  error,
  onClose,
  onConfirm,
}: {
  beachName: string;
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: (firstName: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const nameId = useId();
  const privacyId = useId();
  const errorId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      formRef.current?.reset();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="w-[calc(100%-2rem)] max-w-sm rounded-lg border border-[var(--line)] bg-white p-0 text-[var(--ink)] shadow-lg open:backdrop:bg-black/40"
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
          const firstName = String(data.get("firstName") ?? "");
          onConfirm(firstName);
        }}
      >
        <h2 id={titleId} className="text-lg font-bold leading-snug">
          Check in at {beachName}
        </h2>

        <div className="mt-4">
          <label htmlFor={nameId} className="block text-sm font-bold">
            First name{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <input
            id={nameId}
            name="firstName"
            type="text"
            autoComplete="given-name"
            maxLength={FIRST_NAME_MAX_LENGTH}
            disabled={busy}
            aria-describedby={`${privacyId}${error ? ` ${errorId}` : ""}`}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base text-[var(--ink)]"
          />
        </div>

        <p id={privacyId} className="mt-3 text-sm leading-snug text-[var(--mute)]">
          Your name is optional. We only use this check-in to calculate
          approximate volunteer numbers, and it will automatically expire after
          two hours.
        </p>

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
            {busy ? "Checking in…" : "Confirm check-in"}
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
