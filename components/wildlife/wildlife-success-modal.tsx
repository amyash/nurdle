"use client";

import { useId } from "react";
import { SuccessDialog } from "@/components/ui/modal";

export function WildlifeSuccessModal({
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
      title="Thanks — your wildlife report has been added."
      titleId={titleId}
    >
      <p className="text-sm leading-snug text-mute">
        It’s now on the public map and list. If you submitted by mistake, use
        Remove on the report and confirm with the email you entered. We may
        still email you if supporting evidence would help.
      </p>
    </SuccessDialog>
  );
}
