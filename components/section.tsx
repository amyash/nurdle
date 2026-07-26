import type { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-[var(--line)] py-6">
      <h2 className="text-lg font-bold uppercase tracking-wide text-[var(--ink)]">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
