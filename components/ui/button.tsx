import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3 py-2.5 text-sm font-bold transition-opacity disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-mark text-white hover:opacity-95",
  secondary: "border border-line bg-white text-ink hover:bg-board",
  quiet:
    "border border-transparent bg-transparent text-ink underline-offset-2 hover:underline",
  danger: "bg-red-800 text-white hover:opacity-95",
  whatsapp: "bg-whatsapp text-white hover:opacity-95",
  accent: "bg-accent-mint text-ink hover:opacity-95",
  ink: "bg-ink text-white hover:opacity-95",
} as const;

export type ButtonVariant = keyof typeof variants;

export function Button({
  variant = "primary",
  fullWidth,
  className,
  children,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  fullWidth,
  className,
  children,
  href,
  external,
  ...props
}: {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  href: string;
  external?: boolean;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
>) {
  return (
    <a
      href={href}
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
