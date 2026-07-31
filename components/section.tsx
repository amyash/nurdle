import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  id,
  title,
  children,
  showDivider = true,
}: {
  id: string;
  title: string;
  children: ReactNode;
  showDivider?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16 py-8",
        showDivider && "border-t border-line",
      )}
    >
      <h2 className="text-section">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
