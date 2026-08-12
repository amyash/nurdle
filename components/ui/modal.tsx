"use client";

import {
  useEffect,
  useRef,
  type DialogHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

export function Modal({
  open,
  onClose,
  busy = false,
  title,
  titleId,
  children,
  className,
  panelClassName,
  showClose = false,
  size = "sm",
  ...props
}: {
  open: boolean;
  onClose: () => void;
  busy?: boolean;
  title?: ReactNode;
  titleId?: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  showClose?: boolean;
  size?: "sm" | "md";
} & Omit<DialogHTMLAttributes<HTMLDialogElement>, "open" | "children" | "className" | "title">) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 m-0 max-h-[90dvh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-soft border border-line bg-paper p-0 text-ink open:backdrop:bg-ink/45",
        size === "sm" ? "max-w-md" : "max-w-lg",
        className,
      )}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !busy) onClose();
      }}
      {...props}
    >
      <div className={cn("px-4 py-4", panelClassName)}>
        {(title || showClose) && (
          <div className="mb-4 flex items-start justify-between gap-3">
            {title ? (
              <h2 id={titleId} className="text-card-title min-w-0 flex-1">
                {title}
              </h2>
            ) : (
              <span className="flex-1" />
            )}
            {showClose ? (
              <IconButton
                label="Close"
                disabled={busy}
                onClick={onClose}
                className="-mr-1 -mt-1"
              >
                ×
              </IconButton>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}

export function SuccessDialog({
  open,
  onClose,
  title,
  titleId,
  children,
  actionLabel = "Close",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  titleId?: string;
  children?: ReactNode;
  actionLabel?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} titleId={titleId}>
      {children}
      <Button type="button" onClick={onClose} fullWidth className="mt-4">
        {actionLabel}
      </Button>
    </Modal>
  );
}
