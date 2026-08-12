import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  lead,
  titleAs: TitleTag = "h1",
  className,
  id,
  eyebrow,
}: {
  title: ReactNode;
  lead?: ReactNode;
  titleAs?: "h1" | "h2";
  className?: string;
  id?: string;
  eyebrow?: ReactNode;
}) {
  return (
    <header className={cn("mb-8 max-w-3xl sm:mb-10", className)}>
      {eyebrow ? (
        <p className="text-eyebrow text-mark mb-3">{eyebrow}</p>
      ) : null}
      <TitleTag id={id} className="text-page-title">
        {title}
      </TitleTag>
      {lead ? (
        <div className="mt-4 reading-measure text-body text-mute [&_p+p]:mt-3">
          {lead}
        </div>
      ) : null}
    </header>
  );
}
