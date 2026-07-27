"use client";

import { useState } from "react";

export function CopyableEmailTemplate({
  label,
  subject,
  body,
}: {
  label: string;
  subject: string;
  body: string;
}) {
  const [copied, setCopied] = useState(false);
  const fullText = `Subject: ${subject}\n\n${body}`;

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
      <p className="text-sm font-bold text-[var(--ink)]">{label}</p>

      <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-[var(--line)] bg-[var(--board)] p-3">
        <p className="text-xs font-bold text-[var(--ink)]">Subject</p>
        <p className="mt-1 text-xs leading-snug text-[var(--ink)]">{subject}</p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-snug text-[var(--ink)]">
          {body}
        </pre>
      </div>

      <button
        type="button"
        onClick={copyTemplate}
        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white"
      >
        {copied ? "Copied to clipboard" : "Copy email template"}
      </button>

      <div className="mt-6 border-t border-[var(--line)]" aria-hidden="true" />
    </div>
  );
}
