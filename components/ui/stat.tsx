import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Typography-led statistic — not a card. */
export function Stat({
  label,
  value,
  className,
  size = "md",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  value: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className={cn("min-w-0", className)} {...props}>
      <p className="text-eyebrow text-mute">{label}</p>
      <p
        className={cn(
          "mt-1 font-bold tabular-nums tracking-tight text-ink",
          size === "sm" && "text-xl",
          size === "md" && "text-2xl sm:text-3xl",
          size === "lg" && "text-3xl sm:text-4xl",
        )}
      >
        {value}
      </p>
    </div>
  );
}
