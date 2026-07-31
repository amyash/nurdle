import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  alert: "rounded-card border-2 border-alert-ink bg-alert text-alert-ink",
  mark: "rounded-card border-2 border-mark bg-white text-ink",
  ink: "rounded-card border-2 border-ink bg-white text-ink",
  warning:
    "rounded-card border border-amber-800/40 bg-amber-50 text-amber-950",
  muted: "rounded-card border border-line bg-white text-ink",
} as const;

export function Callout({
  tone = "alert",
  className,
  children,
  padded = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  tone?: keyof typeof tones;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(tones[tone], padded && "px-4 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
