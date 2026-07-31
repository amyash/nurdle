"use client";

import { useId } from "react";
import { SuccessDialog } from "@/components/ui/modal";

export function CleanupLogSuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();

  return (
    <SuccessDialog
      open={open}
      onClose={onClose}
      title="Thank you — your clean-up has been added to the community total."
      titleId={titleId}
    >
      <p className="text-sm leading-snug text-mute">
        Every hour helps show the scale of the volunteer response.
      </p>
    </SuccessDialog>
  );
}
