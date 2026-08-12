import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Stat } from "@/components/ui/stat";

/** Back-compat wrapper around typography-led Stat. */
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
    <Stat
      label={label}
      value={value}
      size="md"
      className={cn("border-t border-line pt-4", className)}
      {...props}
    />
  );
}
