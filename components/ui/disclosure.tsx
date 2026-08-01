import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Disclosure({
  summary,
  children,
  className,
  summaryClassName,
  defaultOpen,
  openClassName,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
  defaultOpen?: boolean;
  openClassName?: string;
}) {
  return (
    <details
      className={cn("group", className, openClassName)}
      {...(defaultOpen ? { defaultOpen: true } : {})}
    >
      <summary
        className={cn(
          "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-2 marker:content-none [&::-webkit-details-marker]:hidden",
          summaryClassName,
        )}
      >
        <span className="min-w-0 flex-1 text-left">{summary}</span>
        <span
          className="inline-flex shrink-0 items-center justify-center text-lg font-bold leading-none transition group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="pb-2 pt-1">{children}</div>
    </details>
  );
}
