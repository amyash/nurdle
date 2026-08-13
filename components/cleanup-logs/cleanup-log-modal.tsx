"use client";

import { useEffect, useId, useRef, useState } from "react";
import { checkinBeachById } from "@/data/checkin-beaches";
import { CLEANUP_LOG_MIN_DATE, todayDateStringLondon } from "@/data/spill";
import {
  CLEANUP_MAX_VOLUNTEERS,
  CLEANUP_NAME_MAX,
  CLEANUP_NOTES_MAX,
  CLEANUP_VOLUME_OPTIONS,
  estimatedKgForVolume,
  parseDurationMinutes,
} from "@/lib/cleanup-logs/format";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FormField,
  Input,
  Textarea,
} from "@/components/ui/form-field";
import { FormGateHoneypotField } from "@/components/form-gate/honeypot-field";
import { FORM_GATE_GENERIC_ERROR } from "@/lib/form-gate/constants";
import { validateFormGate } from "@/lib/form-gate/validate";

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
    formOpenedAt: number;
    company: string;
  }) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const openedAtRef = useRef<number>(0);
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
  const honeypotId = useId();
  const communityId = useId();
  const errorId = useId();
  const [localError, setLocalError] = useState<string | null>(null);
  const maxDate = todayDateStringLondon();
  const beachName = checkinBeachById[beachId]?.name ?? "this beach";

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setLocalError(null);
  }

  useEffect(() => {
    if (!open) return;
    openedAtRef.current = Date.now();
    const today = todayDateStringLondon();
    formRef.current?.reset();
    const dateInput = formRef.current?.elements.namedItem(
      "cleanupDate",
    ) as HTMLInputElement | null;
    if (dateInput) {
      dateInput.max = today;
      dateInput.value = today;
    }
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
    formRef.current?.closest("dialog")?.scrollTo({ top: 0 });
  }, [open, beachId]);

  const displayError = localError ?? error;

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title={`Log your clean-up at ${beachName}`}
      titleId={titleId}
      showClose
      tabIndex={-1}
    >
      <form
        ref={formRef}
        className="min-w-0"
        onSubmit={(event) => {
          event.preventDefault();
          if (busy) return;
          setLocalError(null);
          const data = new FormData(event.currentTarget);
          const cleanupDate = String(data.get("cleanupDate") ?? "");
          const today = todayDateStringLondon();
          if (!cleanupDate) {
            setLocalError("Choose a clean-up date.");
            return;
          }
          if (cleanupDate > today) {
            setLocalError("Logged time is in the future");
            return;
          }
          if (cleanupDate < CLEANUP_LOG_MIN_DATE) {
            setLocalError("Please log time after nurdle spill");
            return;
          }
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
          const company = String(data.get("company") ?? "");
          if (
            !validateFormGate({
              formOpenedAt: openedAtRef.current,
              honeypot: company,
            })
          ) {
            setLocalError(FORM_GATE_GENERIC_ERROR);
            return;
          }
          onSubmit({
            beachId,
            cleanupDate,
            durationMinutes: duration.minutes,
            volunteerCount: Number(data.get("volunteerCount")),
            collectedVolume: volume.id,
            volunteerName: String(data.get("volunteerName") ?? ""),
            notes: String(data.get("notes") ?? ""),
            confirmedEstimate: true,
            formOpenedAt: openedAtRef.current,
            company,
          });
        }}
      >
        <FormGateHoneypotField id={honeypotId} />

        <FormField label="Date of clean-up" htmlFor={dateId} className="min-w-0">
          <div className="min-w-0 overflow-hidden">
            <Input
              id={dateId}
              key={maxDate}
              name="cleanupDate"
              type="date"
              required
              disabled={busy}
              min={CLEANUP_LOG_MIN_DATE}
              max={maxDate}
              defaultValue={maxDate}
              onInvalid={(event) => {
                const input = event.currentTarget;
                if (input.validity.rangeOverflow) {
                  input.setCustomValidity("Logged time is in the future");
                } else if (input.validity.rangeUnderflow) {
                  input.setCustomValidity(
                    "Please log time after nurdle spill",
                  );
                } else if (input.validity.valueMissing) {
                  input.setCustomValidity("Choose a clean-up date.");
                } else {
                  input.setCustomValidity("");
                }
              }}
              onInput={(event) => {
                event.currentTarget.setCustomValidity("");
              }}
            />
          </div>
        </FormField>

        <fieldset className="mt-4 min-w-0" disabled={busy}>
          <legend className="text-sm font-bold">Time spent cleaning</legend>
          <div className="mt-2 grid min-w-0 grid-cols-2 gap-2">
            <div className="min-w-0">
              <label htmlFor={hoursId} className="block text-xs font-bold">
                Hours
              </label>
              <Input
                id={hoursId}
                name="hours"
                type="number"
                inputMode="numeric"
                min={0}
                max={12}
                defaultValue={1}
                required
              />
            </div>
            <div className="min-w-0">
              <label htmlFor={minutesId} className="block text-xs font-bold">
                Minutes
              </label>
              <Input
                id={minutesId}
                name="minutes"
                type="number"
                inputMode="numeric"
                min={0}
                max={59}
                step={5}
                defaultValue={0}
                required
              />
            </div>
          </div>
        </fieldset>

        <FormField
          label="How many people did this clean-up include?"
          htmlFor={volunteersId}
          className="mt-4 min-w-0"
        >
          <Input
            id={volunteersId}
            name="volunteerCount"
            type="number"
            inputMode="numeric"
            min={1}
            max={CLEANUP_MAX_VOLUNTEERS}
            defaultValue={1}
            required
            disabled={busy}
          />
        </FormField>

        <fieldset
          className="mt-4"
          disabled={busy}
          aria-describedby={volumeHelpId}
        >
          <legend className="text-sm font-bold">How much did you collect?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup">
            {CLEANUP_VOLUME_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex min-h-12 cursor-pointer items-center gap-3 border border-line bg-paper px-3 py-2.5 text-sm has-[:checked]:border-mark has-[:checked]:bg-surface-quiet"
              >
                <input
                  type="radio"
                  name="collectedVolume"
                  value={option.id}
                  required
                  className="h-4 w-4 shrink-0 accent-[var(--mark)]"
                />
                <span className="font-bold">{option.label}</span>
              </label>
            ))}
          </div>
          <p id={volumeHelpId} className="mt-2 text-sm text-mute">
            Estimated using 1 litre ≈ 550&nbsp;g of nurdles.
          </p>
        </fieldset>

        <FormField
          label="Your name"
          htmlFor={nameId}
          optional
          className="mt-4"
          description={
            <span id={nameHelpId}>
              Optional. This will not be shown publicly.
            </span>
          }
        >
          <Input
            id={nameId}
            name="volunteerName"
            type="text"
            maxLength={CLEANUP_NAME_MAX}
            disabled={busy}
            aria-describedby={nameHelpId}
          />
        </FormField>

        <FormField
          label="Anything else to add?"
          htmlFor={notesId}
          optional
          className="mt-4"
        >
          <Textarea
            id={notesId}
            name="notes"
            rows={3}
            maxLength={CLEANUP_NOTES_MAX}
            disabled={busy}
          />
        </FormField>

        <p id={communityId} className="mt-4 text-sm leading-snug text-mute">
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

        <FieldError id={errorId}>{displayError}</FieldError>

        <div className="mt-4 flex flex-col gap-2">
          <Button type="submit" fullWidth disabled={busy}>
            {busy ? "Saving…" : "Submit clean-up"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
