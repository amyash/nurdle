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
    formOpenedAt: number;
    company: string;
  }) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const openedAtRef = useRef<number>(0);
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
    formRef.current?.closest("dialog")?.scrollTo({ top: 0 });
  }, [open]);

  const displayError = localError ?? error;

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title="Report a wildlife sighting"
      titleId={titleId}
      showClose
      size="md"
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
          const company = String(data.get("company") ?? "");

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
            formOpenedAt: openedAtRef.current,
            company,
          });
        }}
      >
        <FormGateHoneypotField id={honeypotId} />

        <p className="text-sm leading-snug text-mute">
          Reports appear on the map straight away. Your email is never shown
          publicly.
        </p>

        <FormField label="Beach" htmlFor={beachId} className="mt-4">
          <Select
            id={beachId}
            name="beachId"
            required
            disabled={busy}
            defaultValue=""
          >
            <option value="" disabled>
              Choose a beach
            </option>
            {checkinBeaches.map((beach) => (
              <option key={beach.id} value={beach.id}>
                {beach.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Date observed" htmlFor={dateId} className="mt-4">
          <Input
            id={dateId}
            key={maxDate}
            name="dateObserved"
            type="date"
            required
            disabled={busy}
            min={WILDLIFE_MIN_DATE}
            max={maxDate}
            defaultValue={maxDate}
            className="box-border min-w-0 max-w-full"
          />
        </FormField>

        <FormField
          label="Approximate time"
          htmlFor={timeId}
          optional
          className="mt-4"
        >
          <Input
            id={timeId}
            name="timeObserved"
            type="time"
            disabled={busy}
            className="box-border min-w-0 max-w-full"
          />
        </FormField>

        <FormField label="Animal" htmlFor={animalId} className="mt-4">
          <Select
            id={animalId}
            name="animalType"
            required
            disabled={busy}
            defaultValue=""
          >
            <option value="" disabled>
              Choose animal type
            </option>
            {WILDLIFE_ANIMAL_TYPES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label={
            <>
              Species{" "}
              <span className="font-normal text-mute">
                (optional, if known)
              </span>
            </>
          }
          htmlFor={speciesId}
          className="mt-4"
        >
          <Input
            id={speciesId}
            name="species"
            type="text"
            maxLength={WILDLIFE_SPECIES_MAX}
            disabled={busy}
            placeholder="e.g. Herring gull"
          />
        </FormField>

        <FormField label="Number observed" htmlFor={countId} className="mt-4">
          <Input
            id={countId}
            name="count"
            type="number"
            inputMode="numeric"
            min={WILDLIFE_COUNT_MIN}
            max={WILDLIFE_COUNT_MAX}
            defaultValue={1}
            required
            disabled={busy}
          />
        </FormField>

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

        <FormField label="Description" htmlFor={descriptionId} className="mt-4">
          <Textarea
            id={descriptionId}
            name="description"
            rows={4}
            required
            maxLength={WILDLIFE_DESCRIPTION_MAX}
            disabled={busy}
            placeholder="Describe what you observed, including any visible nurdles or contamination."
          />
        </FormField>

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
            className="mt-2 text-xs leading-snug text-mute"
          >
            Please keep any photos or videos as evidence.
            <br />
            <br />
            We cannot accept uploads through this website, but we may contact
            you by email to request them if they could support reporting or
            investigation.
          </p>
        </fieldset>

        <FormField
          label="Email address"
          htmlFor={emailId}
          className="mt-4"
          description={
            <span id={emailHelpId}>
              Your email address will never be displayed publicly. We will only
              use it if we need to contact you regarding this report or to
              request supporting evidence.
            </span>
          }
        >
          <Input
            id={emailId}
            name="email"
            type="email"
            required
            maxLength={WILDLIFE_EMAIL_MAX}
            disabled={busy}
            autoComplete="email"
            aria-describedby={emailHelpId}
          />
        </FormField>

        <FormField
          label="Your name"
          htmlFor={nameId}
          optional
          className="mt-4"
        >
          <Input
            id={nameId}
            name="reporterName"
            type="text"
            maxLength={WILDLIFE_NAME_MAX}
            disabled={busy}
            autoComplete="name"
          />
        </FormField>

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

        <FieldError id={errorId}>{displayError}</FieldError>

        <Button type="submit" fullWidth disabled={busy} className="mt-4">
          {busy ? "Submitting…" : "Submit report"}
        </Button>
      </form>
    </Modal>
  );
}
