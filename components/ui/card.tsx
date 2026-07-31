import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  default: "rounded-card border border-line bg-white",
  interactive:
    "rounded-card border border-line bg-white transition-shadow hover:shadow-sm",
  callout: "rounded-card border-2 border-alert-ink bg-alert",
  mark: "rounded-card border-2 border-mark bg-white",
  ink: "rounded-card border-2 border-ink bg-white",
  stat: "rounded-card border border-line bg-white",
  warning: "rounded-card border border-amber-800/40 bg-amber-50 text-amber-950",
} as const;

export type CardVariant = keyof typeof variants;

const paddings = {
  sm: "p-3",
  md: "p-4",
  lg: "px-4 py-5",
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
