import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { PageHeader } from "@/components/ui/page-header";

export function PageShell({
  title,
  lead,
  children,
  className,
  titleAs = "h1",
  narrow = false,
}: {
  title?: string;
  lead?: ReactNode;
  children: ReactNode;
  className?: string;
  titleAs?: "h1" | "h2";
  /** Constrain to reading measure (articles, letters). */
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "site-container pb-14 pt-6 sm:pt-8",
        narrow && "max-w-content",
        className,
      )}
    >
      {title ? (
        <PageHeader title={title} lead={lead} titleAs={titleAs} />
      ) : null}
      {children}
    </div>
  );
}
