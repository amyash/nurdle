"use client";

import { useCallback, useEffect, useId, useState } from "react";
import type { ScientificBriefing } from "@/types";

export function ScientificBriefingPanel({
  briefing,
}: {
  briefing: ScientificBriefing;
}) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <section
      id="scientific-briefing"
      className="scroll-mt-20 border-t border-[var(--line)] pt-6"
      aria-labelledby="scientific-briefing-heading"
    >
      <h3
        id="scientific-briefing-heading"
        className="text-lg font-bold uppercase tracking-wide text-[var(--ink)]"
      >
        {briefing.title}
      </h3>

      <div className="mt-4 space-y-5 text-sm leading-snug text-[var(--ink)]">
        {briefing.sections.map((section, index) => (
          <div key={`${section.heading}-${index}`} className="space-y-2">
            {section.heading ? (
              <h4 className="font-bold text-[var(--ink)]">{section.heading}</h4>
            ) : null}
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="list-disc space-y-1.5 pl-5">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        {briefing.fullBriefingHref ? (
          <p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-bold text-[var(--mark)] underline underline-offset-2"
            >
              Read the full scientific briefing
            </button>
          </p>
        ) : null}
      </div>

      {open && briefing.fullBriefingHref ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <p id={titleId} className="sr-only">
            Full scientific briefing PDF
          </p>

          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 rounded-md bg-white/15 px-3 py-2 text-sm font-bold text-white"
            aria-label="Close briefing"
          >
            Close
          </button>

          <div
            className="flex h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <iframe
              src={`${briefing.fullBriefingHref}#view=FitH`}
              title="Full scientific briefing"
              className="h-full w-full flex-1 border-0"
            />
            <p className="border-t border-[var(--line)] px-3 py-2 text-center text-xs text-[var(--mute)]">
              <a
                href={briefing.fullBriefingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[var(--mark)] underline underline-offset-2"
              >
                Open PDF in a new tab
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
