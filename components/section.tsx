import type { ReactNode } from "react";

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
      className={`scroll-mt-16 py-6${showDivider ? " border-t border-[var(--line)]" : ""}`}
    >
      <h2 className="text-lg font-bold uppercase tracking-wide text-[var(--ink)]">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
