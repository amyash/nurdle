import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Numbered how-to step — number shown once. */
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
    <li className={cn("flex gap-3", className)}>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white"
        aria-hidden="true"
      >
        {number}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        {title ? <h3 className="text-card-title">{title}</h3> : null}
        <div
          className={cn(
            title && "mt-2",
            "text-body [&_p+p]:mt-2",
          )}
        >
          {children}
        </div>
      </div>
    </li>
  );
}
