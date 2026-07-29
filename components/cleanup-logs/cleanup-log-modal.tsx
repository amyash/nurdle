"use client";

import { useEffect, useId, useRef, useState } from "react";
import { checkinBeachById } from "@/data/checkin-beaches";
import { SPILL_START_DATE, todayDateStringLondon } from "@/data/spill";
import {
  CLEANUP_MAX_VOLUNTEERS,
  CLEANUP_NAME_MAX,
  CLEANUP_NOTES_MAX,
  CLEANUP_VOLUME_OPTIONS,
  estimatedKgForVolume,
  parseDurationMinutes,
} from "@/lib/cleanup-logs/format";

export function CleanupLogModal({
  beachId,
  open,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  beachId: string;
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: {
    beachId: string;
    cleanupDate: string;
    durationMinutes: number;
    volunteerCount: number;
    collectedVolume: string;
    volunteerName: string;
    notes: string;
    confirmedEstimate: boolean;
  }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const dateId = useId();
  const hoursId = useId();
  const minutesId = useId();
  const volunteersId = useId();
  const volumeHelpId = useId();
  const nameId = useId();
  const nameHelpId = useId();
  const notesId = useId();
  const confirmId = useId();
  const communityId = useId();
  const errorId = useId();
  const [localError, setLocalError] = useState<string | null>(null);

  const beachName = checkinBeachById[beachId]?.name ?? "this beach";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setLocalError(null);
      formRef.current?.reset();
      const dateInput = formRef.current?.elements.namedItem(
        "cleanupDate",
      ) as HTMLInputElement | null;
      if (dateInput) dateInput.value = todayDateStringLondon();
      const volunteers = formRef.current?.elements.namedItem(
        "volunteerCount",
      ) as HTMLInputElement | null;
      if (volunteers) volunteers.value = "1";
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
      // Focus the dialog itself (not the title/inputs) so nothing gets a
      // focus ring and native date pickers don't open on show.
      dialog.focus({ preventScroll: true });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, beachId]);

  const displayError = localError ?? error;
  const maxDate = todayDateStringLondon();

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
        className="max-h-[90dvh] w-full max-w-sm overflow-y-auto overscroll-contain rounded-lg border border-[var(--line)] bg-white shadow-lg"
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
            const hours = Number(data.get("hours"));
            const minutes = Number(data.get("minutes"));
            const duration = parseDurationMinutes(hours, minutes);
            if (!duration.ok) {
              setLocalError(
                "Time spent must be between 15 minutes and 12 hours.",
              );
              return;
            }
            const volume = estimatedKgForVolume(
              String(data.get("collectedVolume") ?? ""),
            );
            if (!volume.ok) {
              setLocalError("Please choose how much you collected.");
              return;
            }
            if (data.get("confirmedEstimate") !== "on") {
              setLocalError(
                "Please confirm that these figures are your best estimate.",
              );
              return;
            }
            onSubmit({
              beachId,
              cleanupDate: String(data.get("cleanupDate") ?? ""),
              durationMinutes: duration.minutes,
              volunteerCount: Number(data.get("volunteerCount")),
              collectedVolume: volume.id,
              volunteerName: String(data.get("volunteerName") ?? ""),
              notes: String(data.get("notes") ?? ""),
              confirmedEstimate: true,
            });
          }}
        >
          <h2 id={titleId} className="text-lg font-bold leading-snug">
            Log your clean-up at {beachName}
          </h2>

        <div className="mt-4">
          <label htmlFor={dateId} className="block text-sm font-bold">
            Date of clean-up
          </label>
          <input
            id={dateId}
            name="cleanupDate"
            type="date"
            required
            disabled={busy}
            min={SPILL_START_DATE}
            max={maxDate}
            defaultValue={maxDate}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base text-[var(--ink)]"
          />
        </div>

        <fieldset className="mt-4" disabled={busy}>
          <legend className="text-sm font-bold">Time spent cleaning</legend>
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
                max={12}
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

        <div className="mt-4">
          <label htmlFor={volunteersId} className="block text-sm font-bold">
            How many people did this clean-up include?
          </label>
          <input
            id={volunteersId}
            name="volunteerCount"
            type="number"
            inputMode="numeric"
            min={1}
            max={CLEANUP_MAX_VOLUNTEERS}
            defaultValue={1}
            required
            disabled={busy}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          />
        </div>

        <fieldset
          className="mt-4"
          disabled={busy}
          aria-describedby={volumeHelpId}
        >
          <legend className="text-sm font-bold">How much did you collect?</legend>
          <div className="mt-2 space-y-1" role="radiogroup">
            {CLEANUP_VOLUME_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex min-h-10 items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="collectedVolume"
                  value={option.id}
                  required
                  className="h-4 w-4 shrink-0"
                />
                {option.label}
              </label>
            ))}
          </div>
          <p id={volumeHelpId} className="mt-2 text-sm text-[var(--mute)]">
            Estimated using 1 litre ≈ 550&nbsp;g of nurdles. Actual weight varies
            depending on debris and moisture.
          </p>
        </fieldset>

        <div className="mt-4">
          <label htmlFor={nameId} className="block text-sm font-bold">
            Your name{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <input
            id={nameId}
            name="volunteerName"
            type="text"
            maxLength={CLEANUP_NAME_MAX}
            disabled={busy}
            aria-describedby={nameHelpId}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          />
          <p id={nameHelpId} className="mt-1 text-sm text-[var(--mute)]">
            Optional. This will not be shown publicly.
          </p>
        </div>

        <div className="mt-4">
          <label htmlFor={notesId} className="block text-sm font-bold">
            Anything else to add?{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <textarea
            id={notesId}
            name="notes"
            rows={3}
            maxLength={CLEANUP_NOTES_MAX}
            disabled={busy}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          />
        </div>

        <p id={communityId} className="mt-4 text-sm leading-snug text-[var(--mute)]">
          These figures are community contributed and rely on volunteers
          providing their best estimate. They are intended to show the scale of
          the collective response.
        </p>

        <label className="mt-3 flex min-h-11 items-start gap-2 text-sm leading-snug">
          <input
            id={confirmId}
            name="confirmedEstimate"
            type="checkbox"
            required
            disabled={busy}
            className="mt-1 h-4 w-4 shrink-0"
          />
          <span>I confirm that these figures are my best estimate.</span>
        </label>

        {displayError ? (
          <p
            id={errorId}
            role="alert"
            className="mt-3 text-sm font-bold text-red-800"
          >
            {displayError}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? "Saving…" : "Submit clean-up"}
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
      </div>
    </dialog>
  );
}
