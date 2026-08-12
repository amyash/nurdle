import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  alert:
    "rounded-soft border-l-[3px] border-l-urgent border border-line bg-urgent-soft text-urgent-ink",
  mark: "rounded-soft border-l-[3px] border-l-mark border border-line bg-surface-quiet text-ink",
  ink: "rounded-soft border border-line bg-paper text-ink",
  warning:
    "rounded-soft border-l-[3px] border-l-urgent border border-line bg-urgent-soft text-urgent-ink",
  muted: "rounded-soft border border-line bg-surface text-ink",
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
      className={cn(tones[tone], padded && "px-4 py-4 sm:px-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
