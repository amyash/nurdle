import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "mt-1 w-full rounded-control border border-line bg-white px-3 py-2.5 text-base text-ink disabled:opacity-60";

export function FormField({
  label,
  htmlFor,
  optional,
  description,
  error,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  optional?: boolean;
  description?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <label htmlFor={htmlFor} className="block text-sm font-bold text-ink">
        {label}
        {optional ? (
          <span className="font-normal text-mute"> (optional)</span>
        ) : null}
      </label>
      {children}
      {description ? (
        <p className="mt-2 text-meta">{description}</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm font-bold text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(controlClass, "min-h-24 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlClass, className)} {...props}>
      {children}
    </select>
  );
}

export function FieldError({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-3 text-sm font-bold text-red-800">
      {children}
    </p>
  );
}

export { controlClass };
