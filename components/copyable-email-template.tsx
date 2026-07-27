"use client";

import { useState } from "react";

export function CopyableEmailTemplate({
  label,
  subject,
  body,
  tone = "light",
}: {
  label: string;
  subject: string;
  body: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);
  const fullText = `Subject: ${subject}\n\n${body}`;
  const dark = tone === "dark";

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-3">
      <p
        className={`text-sm font-bold ${dark ? "text-white" : "text-[var(--ink)]"}`}
      >
        {label}
      </p>

      <div
        className={`mt-2 max-h-56 overflow-y-auto rounded-md border p-3 ${
          dark
            ? "border-white/20 bg-white text-[var(--ink)]"
            : "border-[var(--line)] bg-[var(--board)] text-[var(--ink)]"
        }`}
      >
        <p className="text-xs font-bold">Subject</p>
        <p className="mt-1 text-xs leading-snug">{subject}</p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-snug">
          {body}
        </pre>
      </div>

      <button
        type="button"
        onClick={copyTemplate}
        className={`mt-3 inline-flex w-full items-center justify-center rounded-md px-3 py-2.5 text-sm font-bold ${
          dark
            ? "bg-white text-[#111827]"
            : "bg-[var(--mark)] text-white"
        }`}
      >
        {copied ? "Copied to clipboard" : "Copy email template"}
      </button>

      <div
        className={`mt-6 border-t ${dark ? "border-white/20" : "border-[var(--line)]"}`}
        aria-hidden="true"
      />
    </div>
  );
}
