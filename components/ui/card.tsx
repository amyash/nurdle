import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  default: "rounded-card border border-line bg-paper",
  interactive:
    "rounded-card border border-line bg-paper transition-colors hover:border-line-strong",
  callout: "rounded-card border border-urgent/40 bg-urgent-soft",
  mark: "rounded-card border border-mark/30 bg-paper",
  ink: "rounded-card border border-ink/20 bg-paper",
  stat: "border-0 bg-transparent p-0",
  warning: "rounded-card border border-urgent/35 bg-urgent-soft text-urgent-ink",
  ghost: "rounded-none border-0 bg-transparent",
  rule: "rounded-none border-0 border-t border-line bg-transparent",
} as const;

export type CardVariant = keyof typeof variants;

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "px-4 py-5 sm:px-5 sm:py-6",
} as const;

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  padding?: keyof typeof paddings;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}
