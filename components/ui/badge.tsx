import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  className,
  children,
  quiet,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  quiet?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block text-meta",
        quiet ? "italic text-mute" : "font-bold text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
