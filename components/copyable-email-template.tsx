"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyableEmailTemplate({
  label,
  subject,
  body,
  tone = "light",
}: {
  label?: string;
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
      {label ? (
        <p className={`text-sm font-bold ${dark ? "text-white" : "text-ink"}`}>
          {label}
        </p>
      ) : null}

      <div
        className={`max-h-56 overflow-y-auto rounded-control border p-3 ${
          label ? "mt-2" : ""
        } ${
          dark
            ? "border-white/20 bg-white text-ink"
            : "border-line bg-board text-ink"
        }`}
      >
        <p className="text-xs font-bold">Subject</p>
        <p className="mt-1 text-xs leading-snug">{subject}</p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-snug">
          {body}
        </pre>
      </div>

      <Button type="button" onClick={copyTemplate} fullWidth className="mt-3">
        {copied ? "Copied to clipboard" : "Copy email template"}
      </Button>
    </div>
  );
}
