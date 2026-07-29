"use client";

import { useEffect, useId, useRef } from "react";

export function MeshBagSuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed left-1/2 top-1/2 z-50 m-0 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--line)] bg-white p-0 text-[var(--ink)] shadow-lg open:backdrop:bg-black/40"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="px-4 py-4">
        <h2 id={titleId} className="text-lg font-bold leading-snug">
          Request submitted
        </h2>
        <p className="mt-3 text-sm leading-snug text-[var(--ink)]">
          Thanks! Your request has been added.
        </p>
        <p className="mt-2 text-sm leading-snug text-[var(--mute)]">
          The sewing team use this website alongside their WhatsApp group, so
          someone should pick it up shortly.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
