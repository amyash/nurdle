import type { ReactNode } from "react";

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
      className={`mx-auto max-w-lg px-4 pb-10 pt-2${className ? ` ${className}` : ""}`}
    >
      {title && (
        <h2 className="mb-4 text-xl font-bold tracking-tight text-[var(--ink)]">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
