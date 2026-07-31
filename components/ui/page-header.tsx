import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  lead,
  titleAs: TitleTag = "h2",
  className,
  id,
}: {
  title: ReactNode;
  lead?: ReactNode;
  titleAs?: "h1" | "h2";
  className?: string;
  id?: string;
}) {
  return (
    <header className={cn("mb-6", className)}>
      <TitleTag id={id} className="text-page-title">
        {title}
      </TitleTag>
      {lead ? (
        <div className="mt-3 max-w-prose text-body text-mute [&_p+p]:mt-2">
          {lead}
        </div>
      ) : null}
    </header>
  );
}
