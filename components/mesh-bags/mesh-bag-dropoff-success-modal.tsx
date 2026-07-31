"use client";

import { useId } from "react";
import { SuccessDialog } from "@/components/ui/modal";

export function MeshBagDropoffSuccessModal({
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
      title="Thanks — the bag drop-off has been added."
      titleId={titleId}
    >
      <p className="text-sm leading-snug text-mute">
        Volunteers can see it on the How to clean page for the next 24 hours.
      </p>
    </SuccessDialog>
  );
}
