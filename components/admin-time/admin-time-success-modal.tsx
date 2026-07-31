"use client";

import { useId } from "react";
import { SuccessDialog } from "@/components/ui/modal";

export function AdminTimeSuccessModal({
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
      title="Thanks — your admin time has been logged."
      titleId={titleId}
    >
      <p className="text-sm leading-snug text-mute">
        Behind-the-scenes hours help show the full volunteer effort.
      </p>
    </SuccessDialog>
  );
}
