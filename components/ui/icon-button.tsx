import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function IconButton({
  className,
  children,
  label,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-2xl font-bold leading-none text-ink hover:bg-board disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
