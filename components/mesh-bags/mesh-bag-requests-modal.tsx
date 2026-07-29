"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  formatDeliveredAt,
  formatNeededShort,
  requesterLabel,
} from "@/lib/mesh-bags/format";
import type { MeshBagRequest } from "@/types/mesh-bags";

function RequestMenu({
  request,
  busy,
  onDeliver,
  onCancel,
}: {
  request: MeshBagRequest;
  busy: boolean;
  onDeliver: () => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (request.status !== "requested") return null;

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        disabled={busy}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-lg font-bold text-[var(--mute)] hover:bg-[var(--board)] disabled:opacity-60"
      >
        <span className="sr-only">Request actions</span>
        <span aria-hidden="true">⋯</span>
      </button>
      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          className="absolute right-0 z-10 mt-1 min-w-[11rem] rounded-md border border-[var(--line)] bg-white py-1 shadow-md"
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full px-3 py-2.5 text-left text-sm font-bold text-[var(--ink)] hover:bg-[var(--board)]"
            onClick={() => {
              setOpen(false);
              onDeliver();
            }}
          >
            Mark as delivered
          </button>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-3 py-2.5 text-left text-sm font-bold text-red-800 hover:bg-[var(--board)]"
            onClick={() => {
              setOpen(false);
              onCancel();
            }}
          >
            Cancel request
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function MeshBagRequestsModal({
  beachName,
  requests,
  open,
  busy,
  nowMs,
  onClose,
  onDeliver,
  onCancel,
}: {
  beachName: string;
  requests: MeshBagRequest[];
  open: boolean;
  busy: boolean;
  nowMs: number;
  onClose: () => void;
  onDeliver: (request: MeshBagRequest) => void;
  onCancel: (request: MeshBagRequest) => void;
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
      className="fixed left-1/2 top-1/2 z-50 m-0 max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-[var(--line)] bg-white p-0 text-[var(--ink)] shadow-lg open:backdrop:bg-black/40"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !busy) onClose();
      }}
    >
      <div className="px-4 py-4">
        <h2 id={titleId} className="text-lg font-bold leading-snug">
          Mesh bag requests — {beachName}
        </h2>

        {requests.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--mute)]">
            No active mesh bag requests for this beach.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--line)]">
            {requests.map((request) => {
              const bags =
                request.quantityRequested === 1
                  ? "1 bag"
                  : `${request.quantityRequested} bags`;
              const when =
                request.status === "delivered"
                  ? `Delivered${formatDeliveredAt(request.deliveredAt) ? ` at ${formatDeliveredAt(request.deliveredAt)}` : ""}`
                  : formatNeededShort(request, nowMs);

              return (
                <li key={request.id} className="flex items-start gap-2 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug">{bags}</p>
                    <p className="mt-0.5 text-sm text-[var(--mute)]">{when}</p>
                    <p className="mt-0.5 text-sm text-[var(--mute)]">
                      {requesterLabel(request.requesterName)}
                    </p>
                    {request.note ? (
                      <p className="mt-1 text-sm leading-snug text-[var(--ink)]">
                        {request.note}
                      </p>
                    ) : null}
                  </div>
                  <RequestMenu
                    request={request}
                    busy={busy}
                    onDeliver={() => onDeliver(request)}
                    onCancel={() => onCancel(request)}
                  />
                </li>
              );
            })}
          </ul>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-sm font-bold text-[var(--ink)] disabled:opacity-60"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
