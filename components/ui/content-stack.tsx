import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const gaps = {
  sm: "space-y-2",
  md: "space-y-3",
  lg: "space-y-4",
  xl: "space-y-6",
} as const;

export function ContentStack({
  gap = "sm",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  gap?: keyof typeof gaps;
  children: ReactNode;
}) {
  return (
    <div className={cn(gaps[gap], className)} {...props}>
      {children}
    </div>
  );
}
