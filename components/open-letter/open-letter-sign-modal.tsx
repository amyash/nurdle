"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, FormField, Input } from "@/components/ui/form-field";
import { Modal, SuccessDialog } from "@/components/ui/modal";
import {
  sanitiseOpenLetterName,
  sanitiseOpenLetterPostcode,
  sanitiseOpenLetterTown,
} from "@/lib/open-letter/format";
import type { CreateOpenLetterSignatureInput } from "@/types/open-letter";

export function OpenLetterSignModal({
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
  onSubmit: (input: CreateOpenLetterSignatureInput) => void;
}) {
  const titleId = useId();
  const nameId = useId();
  const townId = useId();
  const postcodeId = useId();
  const whatsappId = useId();
  const errorId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [joinedWhatsapp, setJoinedWhatsapp] = useState(false);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setLocalError(null);
      setJoinedWhatsapp(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    formRef.current?.reset();
    setJoinedWhatsapp(false);
  }, [open]);

  const displayError = localError ?? error;

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title="Sign the open letter"
      titleId={titleId}
      showClose
      size="md"
    >
      <form
        ref={formRef}
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (busy) return;
          setLocalError(null);
          const data = new FormData(event.currentTarget);
          const fullName = String(data.get("fullName") ?? "");
          const town = String(data.get("town") ?? "");
          const postcode = String(data.get("postcode") ?? "");

          const nameResult = sanitiseOpenLetterName(fullName);
          if (!nameResult.ok) {
            setLocalError("Enter your name.");
            return;
          }
          const townResult = sanitiseOpenLetterTown(town);
          if (!townResult.ok) {
            setLocalError("Enter your town.");
            return;
          }
          const postcodeResult = sanitiseOpenLetterPostcode(postcode);
          if (!postcodeResult.ok) {
            setLocalError("Enter a valid UK postcode.");
            return;
          }

          onSubmit({
            fullName: nameResult.value,
            town: townResult.value,
            postcode: postcodeResult.value,
            // Use controlled state — more reliable than FormData for checkboxes
            joinedWhatsapp,
          });
        }}
      >
        <FormField label="Name" htmlFor={nameId}>
          <Input
            id={nameId}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            disabled={busy}
          />
        </FormField>

        <FormField label="Town" htmlFor={townId}>
          <Input
            id={townId}
            name="town"
            type="text"
            autoComplete="address-level2"
            required
            disabled={busy}
          />
        </FormField>

        <FormField label="Postcode" htmlFor={postcodeId}>
          <Input
            id={postcodeId}
            name="postcode"
            type="text"
            autoComplete="postal-code"
            required
            disabled={busy}
            className="uppercase"
          />
        </FormField>

        <label
          htmlFor={whatsappId}
          className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-snug text-ink"
        >
          <input
            id={whatsappId}
            name="joinedWhatsapp"
            type="checkbox"
            disabled={busy}
            checked={joinedWhatsapp}
            onChange={(event) => setJoinedWhatsapp(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-line"
          />
          <span>
            I joined the Nurdle Clean Up North Tyneside WhatsApp group between
            20th – 31st July 2026
          </span>
        </label>

        <FieldError id={errorId}>{displayError}</FieldError>

        <div className="flex flex-col gap-2">
          <Button type="submit" fullWidth disabled={busy}>
            {busy ? "Signing…" : "Sign"}
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

export function OpenLetterSignSuccess({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <SuccessDialog
      open={open}
      onClose={onClose}
      title="Thank you — your signature has been recorded."
    />
  );
}
