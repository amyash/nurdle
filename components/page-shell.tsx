import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageShell({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto max-w-lg px-4 pb-10 pt-2", className)}
    >
      {title ? <h2 className="mb-4 text-page-title">{title}</h2> : null}
      {children}
    </div>
  );
}
