"use client";

import { useEffect, useId, useRef } from "react";
import { FIRST_NAME_MAX_LENGTH } from "@/lib/check-in/format";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FieldError, FormField, Input } from "@/components/ui/form-field";

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
  const titleId = useId();
  const nameId = useId();
  const privacyId = useId();
  const errorId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    formRef.current?.reset();
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title={`Check in at ${beachName}`}
      titleId={titleId}
    >
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          if (busy) return;
          const data = new FormData(event.currentTarget);
          const firstName = String(data.get("firstName") ?? "");
          onConfirm(firstName);
        }}
      >
        <FormField
          label="First name"
          htmlFor={nameId}
          optional
        >
          <Input
            id={nameId}
            name="firstName"
            type="text"
            autoComplete="given-name"
            maxLength={FIRST_NAME_MAX_LENGTH}
            disabled={busy}
            aria-describedby={`${privacyId}${error ? ` ${errorId}` : ""}`}
          />
        </FormField>

        <p id={privacyId} className="mt-3 text-sm leading-snug text-mute">
          Your name is optional. We only use this check-in to calculate
          approximate volunteer numbers, and it will automatically expire after
          two hours.
        </p>

        <FieldError id={errorId}>{error}</FieldError>

        <div className="mt-4 flex flex-col gap-2">
          <Button type="submit" fullWidth disabled={busy}>
            {busy ? "Checking in…" : "Confirm check-in"}
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
