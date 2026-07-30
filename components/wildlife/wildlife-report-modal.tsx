"use client";

import { useEffect, useId, useRef, useState } from "react";
import { checkinBeaches } from "@/data/checkin-beaches";
import { todayDateStringLondon } from "@/data/spill";
import {
  WILDLIFE_ANIMAL_TYPES,
  WILDLIFE_CONDITIONS,
  WILDLIFE_COUNT_MAX,
  WILDLIFE_COUNT_MIN,
  WILDLIFE_DESCRIPTION_MAX,
  WILDLIFE_EMAIL_MAX,
  WILDLIFE_MIN_DATE,
  WILDLIFE_NAME_MAX,
  WILDLIFE_SPECIES_MAX,
  isValidAnimalType,
  isValidCondition,
} from "@/lib/wildlife/format";

export function WildlifeReportModal({
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
    beachId: string;
    dateObserved: string;
    timeObserved: string | null;
    animalType: string;
    species: string;
    count: number;
    condition: string;
    description: string;
    hasSupportingEvidence: boolean;
    email: string;
    reporterName: string;
    consentPublic: boolean;
  }) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const beachId = useId();
  const dateId = useId();
  const timeId = useId();
  const animalId = useId();
  const speciesId = useId();
  const countId = useId();
  const descriptionId = useId();
  const emailId = useId();
  const emailHelpId = useId();
  const nameId = useId();
  const consentId = useId();
  const evidenceHelpId = useId();
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
        "dateObserved",
      ) as HTMLInputElement | null;
      if (dateInput) {
        dateInput.max = today;
        dateInput.value = today;
      }
      const countInput = formRef.current?.elements.namedItem(
        "count",
      ) as HTMLInputElement | null;
      if (countInput) countInput.value = "1";
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
            const selectedBeach = String(data.get("beachId") ?? "");
            const dateObserved = String(data.get("dateObserved") ?? "");
            const timeObserved = String(data.get("timeObserved") ?? "").trim();
            const animalType = String(data.get("animalType") ?? "");
            const count = Number(data.get("count"));
            const condition = String(data.get("condition") ?? "");
            const description = String(data.get("description") ?? "");
            const evidence = String(data.get("hasSupportingEvidence") ?? "");
            const email = String(data.get("email") ?? "");
            const consentPublic = data.get("consentPublic") === "on";

            if (!selectedBeach) {
              setLocalError("Choose a beach.");
              return;
            }
            if (!dateObserved) {
              setLocalError("Choose the date you observed this.");
              return;
            }
            if (!isValidAnimalType(animalType)) {
              setLocalError("Choose what type of animal you saw.");
              return;
            }
            if (
              !Number.isInteger(count) ||
              count < WILDLIFE_COUNT_MIN ||
              count > WILDLIFE_COUNT_MAX
            ) {
              setLocalError("Enter how many animals you observed (1–100).");
              return;
            }
            if (!isValidCondition(condition)) {
              setLocalError("Choose the animal’s condition.");
              return;
            }
            if (!description.trim()) {
              setLocalError("Please describe what you observed.");
              return;
            }
            if (evidence !== "yes" && evidence !== "no") {
              setLocalError("Tell us whether you have photos or video.");
              return;
            }
            if (!email.trim()) {
              setLocalError("Enter a valid email address.");
              return;
            }
            if (!consentPublic) {
              setLocalError(
                "Please confirm you understand this report may be shown publicly in anonymised form.",
              );
              return;
            }

            onSubmit({
              beachId: selectedBeach,
              dateObserved,
              timeObserved: timeObserved || null,
              animalType,
              species: String(data.get("species") ?? ""),
              count,
              condition,
              description,
              hasSupportingEvidence: evidence === "yes",
              email,
              reporterName: String(data.get("reporterName") ?? ""),
              consentPublic: true,
            });
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id={titleId}
              className="min-w-0 flex-1 text-lg font-bold leading-snug"
            >
              Report a wildlife sighting
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
            Reports are reviewed before appearing publicly. Your email is never
            shown.
          </p>

          <label htmlFor={beachId} className="mt-4 block text-sm font-bold">
            Beach
          </label>
          <select
            id={beachId}
            name="beachId"
            required
            disabled={busy}
            defaultValue=""
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          >
            <option value="" disabled>
              Choose a beach
            </option>
            {checkinBeaches.map((beach) => (
              <option key={beach.id} value={beach.id}>
                {beach.name}
              </option>
            ))}
          </select>

          <label htmlFor={dateId} className="mt-4 block text-sm font-bold">
            Date observed
          </label>
          <input
            id={dateId}
            key={maxDate}
            name="dateObserved"
            type="date"
            required
            disabled={busy}
            min={WILDLIFE_MIN_DATE}
            max={maxDate}
            defaultValue={maxDate}
            className="mt-1 box-border w-full min-w-0 max-w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          />

          <label htmlFor={timeId} className="mt-4 block text-sm font-bold">
            Approximate time{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <input
            id={timeId}
            name="timeObserved"
            type="time"
            disabled={busy}
            className="mt-1 box-border w-full min-w-0 max-w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          />

          <label htmlFor={animalId} className="mt-4 block text-sm font-bold">
            Animal
          </label>
          <select
            id={animalId}
            name="animalType"
            required
            disabled={busy}
            defaultValue=""
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base"
          >
            <option value="" disabled>
              Choose animal type
            </option>
            {WILDLIFE_ANIMAL_TYPES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <label htmlFor={speciesId} className="mt-4 block text-sm font-bold">
            Species{" "}
            <span className="font-normal text-[var(--mute)]">
              (optional, if known)
            </span>
          </label>
          <input
            id={speciesId}
            name="species"
            type="text"
            maxLength={WILDLIFE_SPECIES_MAX}
            disabled={busy}
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
            placeholder="e.g. Herring gull"
          />

          <label htmlFor={countId} className="mt-4 block text-sm font-bold">
            Number observed
          </label>
          <input
            id={countId}
            name="count"
            type="number"
            inputMode="numeric"
            min={WILDLIFE_COUNT_MIN}
            max={WILDLIFE_COUNT_MAX}
            defaultValue={1}
            required
            disabled={busy}
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
          />

          <fieldset className="mt-4" disabled={busy}>
            <legend className="text-sm font-bold">Condition</legend>
            <div className="mt-2 space-y-1">
              {WILDLIFE_CONDITIONS.map((item) => (
                <label
                  key={item.id}
                  className="flex min-h-10 items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="condition"
                    value={item.id}
                    required
                    className="h-4 w-4"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor={descriptionId}
            className="mt-4 block text-sm font-bold"
          >
            Description
          </label>
          <textarea
            id={descriptionId}
            name="description"
            rows={4}
            required
            maxLength={WILDLIFE_DESCRIPTION_MAX}
            disabled={busy}
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
            placeholder="Describe what you observed, including any visible nurdles or contamination."
          />

          <fieldset
            className="mt-4"
            disabled={busy}
            aria-describedby={evidenceHelpId}
          >
            <legend className="text-sm font-bold">
              Do you have photos or video?
            </legend>
            <div className="mt-2 space-y-1">
              <label className="flex min-h-10 items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="hasSupportingEvidence"
                  value="yes"
                  required
                  className="h-4 w-4"
                />
                Yes
              </label>
              <label className="flex min-h-10 items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="hasSupportingEvidence"
                  value="no"
                  required
                  className="h-4 w-4"
                />
                No
              </label>
            </div>
            <p
              id={evidenceHelpId}
              className="mt-2 text-xs leading-snug text-[var(--mute)]"
            >
              Please keep any photos or videos as evidence.
              <br />
              <br />
              We cannot accept uploads through this website, but we may contact
              you by email to request them if they could support reporting or
              investigation.
            </p>
          </fieldset>

          <label htmlFor={emailId} className="mt-4 block text-sm font-bold">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            maxLength={WILDLIFE_EMAIL_MAX}
            disabled={busy}
            autoComplete="email"
            aria-describedby={emailHelpId}
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
          />
          <p id={emailHelpId} className="mt-1 text-xs leading-snug text-[var(--mute)]">
            Your email address will never be displayed publicly. We will only
            use it if we need to contact you regarding this report or to request
            supporting evidence.
          </p>

          <label htmlFor={nameId} className="mt-4 block text-sm font-bold">
            Your name{" "}
            <span className="font-normal text-[var(--mute)]">(optional)</span>
          </label>
          <input
            id={nameId}
            name="reporterName"
            type="text"
            maxLength={WILDLIFE_NAME_MAX}
            disabled={busy}
            autoComplete="name"
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2.5 text-base"
          />

          <label className="mt-4 flex items-start gap-2 text-sm leading-snug">
            <input
              id={consentId}
              name="consentPublic"
              type="checkbox"
              required
              disabled={busy}
              className="mt-1 h-4 w-4 shrink-0"
            />
            <span>
              I understand this report may be displayed publicly in an
              anonymised form.
            </span>
          </label>

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
            {busy ? "Submitting…" : "Submit report"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
