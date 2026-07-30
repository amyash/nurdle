"use client";

import { useEffect, useId, useRef, useState } from "react";
import { todayDateStringLondon } from "@/data/spill";
import {
  ADMIN_TIME_CATEGORIES,
  ADMIN_TIME_MAX_MINUTES,
  ADMIN_TIME_MIN_DATE,
  ADMIN_TIME_NAME_MAX,
  ADMIN_TIME_NOTES_MAX,
  parseAdminDurationMinutes,
} from "@/lib/admin-time/format";

export function AdminTimeLogModal({
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
    workDate: string;
    durationMinutes: number;
    category: string;
    personName: string;
    notes: string;
  }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const dateId = useId();
  const hoursId = useId();
  const minutesId = useId();
  const categoryId = useId();
  const nameId = useId();
  const notesId = useId();
  const errorId = useId();
  const [localError, setLocalError] = useState<string | null>(null);
  const [maxDate, setMaxDate] = useState(() => todayDateStringLondon());

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const today = todayDateStringLondon();
      setMaxDate(today);
      setLocalError(null);
      formRef.current?.reset();
      const dateInput = formRef.current?.elements.namedItem(
        "workDate",
      ) as HTMLInputElement | null;
      if (dateInput) {
        dateInput.max = today;
        dateInput.value = today;
      }
      const hours = formRef.current?.elements.namedItem(
        "hours",
      ) as HTMLInputElement | null;
      if (hours) hours.value = "1";
      const minutes = formRef.current?.elements.namedItem(
        "minutes",
      ) as HTMLInputElement | null;
      if (minutes) minutes.value = "0";
      dialog.showModal();
      if (panelRef.current) panelRef.current.scrollTop = 0;
      dialog.focus({ preventScroll: true });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const displayError = localError ?? error;

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
            const workDate = String(data.get("workDate") ?? "");
            const today = todayDateStringLondon();
            if (!workDate) {
              setLocalError("Choose a date.");
              return;
            }
            if (workDate > today) {
              setLocalError("Logged time is in the future");
              return;
            }
            if (workDate < ADMIN_TIME_MIN_DATE) {
              setLocalError("Please log time on or after the spill date");
              return;
            }
            const duration = parseAdminDurationMinutes(
              Number(data.get("hours")),
              Number(data.get("minutes")),
            );
            if (!duration.ok) {
              setLocalError(
                "Time spent must be between 15 minutes and 12 hours.",
              );
              return;
            }
            const category = String(data.get("category") ?? "");
            if (!ADMIN_TIME_CATEGORIES.some((item) => item.id === category)) {
              setLocalError("Choose what this admin time was for.");
              return;
            }
            onSubmit({
              workDate,
              durationMinutes: duration.minutes,
              category,
              personName: String(data.get("personName") ?? ""),
              notes: String(data.get("notes") ?? ""),
            });
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id={titleId}
              className="min-w-0 flex-1 text-lg font-bold leading-snug"
            >
              Log admin time
            </h2>
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-2xl font-bold leading-none text-[var(--ink)] disabled:opacity-60"
            >
              ×
            </button>
          </div>

          <p className="mt-2 text-sm leading-snug text-[var(--mute)]">
            For organising, website work, communications, and other non-beach
            volunteer time.
          </p>

          <div className="mt-4 min-w-0">
            <label htmlFor={dateId} className="block text-sm font-bold">
              Date
            </label>
            <input
              id={dateId}
              key={maxDate}
              name="workDate"
              type="date"
              required
              disabled={busy}
              min={ADMIN_TIME_MIN_DATE}
              max={maxDate}
              defaultValue={maxDate}
              className="mt-1 box-border w-full min-w-0 max-w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base text-[var(--ink)]"
            />
          </div>

          <fieldset className="mt-4" disabled={busy}>
            <legend className="text-sm font-bold">Time spent</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label htmlFor={hoursId} className="block text-xs font-bold">
                  Hours
                </label>
                <input
                  id={hoursId}
                  name="hours"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={Math.floor(ADMIN_TIME_MAX_MINUTES / 60)}
                  defaultValue={1}
                  required
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
                />
              </div>
              <div>
                <label htmlFor={minutesId} className="block text-xs font-bold">
                  Minutes
                </label>
                <input
                  id={minutesId}
                  name="minutes"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  step={5}
                  defaultValue={0}
                  required
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
                />
              </div>
            </div>
          </fieldset>

          <label
            htmlFor={categoryId}
            className="mt-4 block text-sm font-bold text-[var(--ink)]"
          >
            What was this for?
          </label>
          <select
            id={categoryId}
            name="category"
            required
            disabled={busy}
            defaultValue=""
            className="mt-1 w-full min-w-0 rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          >
            <option value="" disabled>
              Choose a category
            </option>
            {ADMIN_TIME_CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <label
            htmlFor={nameId}
            className="mt-4 block text-sm font-bold text-[var(--ink)]"
          >
            Your name{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <input
            id={nameId}
            name="personName"
            type="text"
            maxLength={ADMIN_TIME_NAME_MAX}
            disabled={busy}
            autoComplete="given-name"
            className="mt-1 w-full min-w-0 rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
          />

          <label
            htmlFor={notesId}
            className="mt-4 block text-sm font-bold text-[var(--ink)]"
          >
            Notes{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <textarea
            id={notesId}
            name="notes"
            rows={3}
            maxLength={ADMIN_TIME_NOTES_MAX}
            disabled={busy}
            className="mt-1 w-full min-w-0 rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
            placeholder="e.g. Built the beaches map page"
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

          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? "Saving…" : "Log admin time"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
