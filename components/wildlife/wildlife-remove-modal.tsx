"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { WildlifeReportPublic } from "@/types/wildlife";
import {
  conditionLabel,
  displaySpecies,
  formatObservedDate,
} from "@/lib/wildlife/format";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FieldError, FormField, Input } from "@/components/ui/form-field";

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
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const emailId = useId();
  const helpId = useId();
  const errorId = useId();
  const [localError, setLocalError] = useState<string | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setLocalError(null);
  }

  useEffect(() => {
    if (!open) return;
    formRef.current?.reset();
  }, [open]);

  if (!report) return null;

  const displayError = localError ?? error;
  const species = displaySpecies(report.animalType, report.species);

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title="Remove this report?"
      titleId={titleId}
      tabIndex={-1}
    >
      <form
        ref={formRef}
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
        <p className="text-sm leading-snug text-mute">
          {species} · {conditionLabel(report.condition)} ·{" "}
          {formatObservedDate(report.dateObserved)}
        </p>
        <p id={helpId} className="mt-3 text-sm leading-snug text-mute">
          To confirm you’re the person who submitted it, enter the email
          address used on the report. Your email is never shown publicly.
        </p>

        <FormField
          label="Email used on the report"
          htmlFor={emailId}
          className="mt-4"
        >
          <Input
            id={emailId}
            name="email"
            type="email"
            required
            disabled={busy}
            autoComplete="email"
            aria-describedby={helpId}
          />
        </FormField>

        <FieldError id={errorId}>{displayError}</FieldError>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Removing…" : "Remove report"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
