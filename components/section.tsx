import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  id,
  title,
  children,
  showDivider = true,
  eyebrow,
  lead,
  className,
}: {
  id: string;
  title?: string;
  children: ReactNode;
  showDivider?: boolean;
  eyebrow?: string;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-10 sm:py-12",
        showDivider && "border-t border-line",
        className,
      )}
    >
      {eyebrow ? <p className="text-eyebrow text-mark mb-3">{eyebrow}</p> : null}
      {title ? <h2 className="text-section">{title}</h2> : null}
      {lead ? (
        <div className="mt-3 reading-measure text-body text-mute">{lead}</div>
      ) : null}
      <div
        className={cn(Boolean(title || lead || eyebrow) && "mt-6")}
      >
        {children}
      </div>
    </section>
  );
}
