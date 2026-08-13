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
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FormField,
  Input,
  Select,
  Textarea,
} from "@/components/ui/form-field";
import { FormGateHoneypotField } from "@/components/form-gate/honeypot-field";
import { FORM_GATE_GENERIC_ERROR } from "@/lib/form-gate/constants";
import { validateFormGate } from "@/lib/form-gate/validate";

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
  const categoryId = useId();
  const nameId = useId();
  const notesId = useId();
  const honeypotId = useId();
  const errorId = useId();
  const [localError, setLocalError] = useState<string | null>(null);
  const maxDate = todayDateStringLondon();

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
    formRef.current?.closest("dialog")?.scrollTo({ top: 0 });
  }, [open]);

  const displayError = localError ?? error;

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title="Log admin time"
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
            workDate,
            durationMinutes: duration.minutes,
            category,
            personName: String(data.get("personName") ?? ""),
            notes: String(data.get("notes") ?? ""),
            formOpenedAt: openedAtRef.current,
            company,
          });
        }}
      >
        <FormGateHoneypotField id={honeypotId} />

        <p className="text-sm leading-snug text-mute">
          For organising, website work, communications, and other non-beach
          volunteer time.
        </p>

        <FormField label="Date" htmlFor={dateId} className="mt-4 min-w-0">
          <div className="min-w-0 overflow-hidden">
            <Input
              id={dateId}
              key={maxDate}
              name="workDate"
              type="date"
              required
              disabled={busy}
              min={ADMIN_TIME_MIN_DATE}
              max={maxDate}
              defaultValue={maxDate}
            />
          </div>
        </FormField>

        <fieldset className="mt-4 min-w-0" disabled={busy}>
          <legend className="text-sm font-bold">Time spent</legend>
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
                max={Math.floor(ADMIN_TIME_MAX_MINUTES / 60)}
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
          label="What was this for?"
          htmlFor={categoryId}
          className="mt-4 min-w-0"
        >
          <Select
            id={categoryId}
            name="category"
            required
            disabled={busy}
            defaultValue=""
            className="min-w-0"
          >
            <option value="" disabled>
              Choose a category
            </option>
            {ADMIN_TIME_CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Your name"
          htmlFor={nameId}
          optional
          className="mt-4"
        >
          <Input
            id={nameId}
            name="personName"
            type="text"
            maxLength={ADMIN_TIME_NAME_MAX}
            disabled={busy}
            autoComplete="given-name"
            className="min-w-0"
          />
        </FormField>

        <FormField label="Notes" htmlFor={notesId} optional className="mt-4">
          <Textarea
            id={notesId}
            name="notes"
            rows={3}
            maxLength={ADMIN_TIME_NOTES_MAX}
            disabled={busy}
            className="min-w-0"
            placeholder="e.g. Built the beaches map page"
          />
        </FormField>

        <FieldError id={errorId}>{displayError}</FieldError>

        <Button type="submit" fullWidth disabled={busy} className="mt-4">
          {busy ? "Saving…" : "Log admin time"}
        </Button>
      </form>
    </Modal>
  );
}
