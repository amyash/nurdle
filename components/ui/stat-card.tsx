import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-white p-3 text-center",
        className,
      )}
      {...props}
    >
      <p className="text-eyebrow text-mute">{label}</p>
      <p className="mt-2 text-card-title tabular-nums">{value}</p>
    </div>
  );
}
