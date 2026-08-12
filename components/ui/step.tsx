import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Numbered how-to step — typography-led, not a card. */
export function Step({
  number,
  title,
  children,
  className,
}: {
  number: number;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("grid grid-cols-[auto_1fr] gap-4 sm:gap-5", className)}>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink bg-ink text-sm font-bold text-white"
        aria-hidden="true"
      >
        {number}
      </span>
      <div className="min-w-0 pt-1">
        {title ? <h3 className="text-card-title">{title}</h3> : null}
        <div
          className={cn(
            title && "mt-2",
            "text-body text-mute [&_p+p]:mt-2 [&_strong]:text-ink",
          )}
        >
          {children}
        </div>
      </div>
    </li>
  );
}
