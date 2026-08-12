"use client";

import { useEffect, useState } from "react";
import { openLetter } from "@/data/open-letter";
import { Button } from "@/components/ui/button";
import {
  OpenLetterSignModal,
  OpenLetterSignSuccess,
} from "@/components/open-letter/open-letter-sign-modal";
import {
  createOpenLetterSignature,
  fetchOpenLetterAdditiveCount,
} from "@/lib/open-letter/api";
import {
  formatSignedByLabel,
  formatSupportTotal,
} from "@/lib/open-letter/format";
import type { CreateOpenLetterSignatureInput } from "@/types/open-letter";

export function OpenLetterPanel() {
  const [additiveCount, setAdditiveCount] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchOpenLetterAdditiveCount();
      if (cancelled || !result.ok) return;
      setAdditiveCount(result.stats.additiveCount);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(input: CreateOpenLetterSignatureInput) {
    if (busy) return;
    setBusy(true);
    setFormError(null);
    const result = await createOpenLetterSignature(input);
    setBusy(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    if (!input.joinedWhatsapp) {
      setAdditiveCount(result.additiveCount);
    }
    setFormOpen(false);
    setShowSuccess(true);
  }

  const supportTotal = openLetter.whatsappMemberCount + additiveCount;
  const signedByLabel = formatSignedByLabel(supportTotal);

  function openSign() {
    setFormError(null);
    setFormOpen(true);
  }

  return (
    <div>
      <header className="border-b border-line pb-8">
        <p className="text-eyebrow text-mark">Open letter</p>
        <p className="mt-4 text-5xl font-bold tabular-nums tracking-tight text-ink sm:text-6xl">
          {formatSupportTotal(supportTotal)}
        </p>
        <p className="mt-2 text-body text-mute">{signedByLabel}</p>
        <Button type="button" className="mt-6 min-h-12" onClick={openSign}>
          Sign the open letter
        </Button>
      </header>

      <article
        aria-labelledby="open-letter-addressee"
        className="mx-auto mt-10 max-w-measure"
      >
        <h1 id="open-letter-addressee" className="text-page-title">
          {openLetter.addressee}
        </h1>
        <p className="mt-4 text-body font-bold">{openLetter.title}</p>

        <div className="mt-8 space-y-5 text-body text-mute [&_strong]:text-ink">
          {openLetter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <h2 className="mt-10 text-section">{openLetter.concernsHeading}</h2>
        <ol className="mt-5 space-y-5">
          {openLetter.concerns.map((concern, index) => {
            const title = "title" in concern ? concern.title : null;
            return (
              <li key={title ?? concern.text} className="text-body text-mute">
                {title ? (
                  <>
                    <span className="font-bold text-ink">
                      {index + 1}. {title}:
                    </span>{" "}
                    {concern.text}
                  </>
                ) : (
                  <>
                    <span className="font-bold text-ink">{index + 1}.</span>{" "}
                    {concern.text}
                  </>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-8 text-body text-mute">{openLetter.impact}</p>
        <p className="mt-5 text-body text-mute">{openLetter.demand}</p>
        <p className="mt-8 text-body text-mute">{openLetter.closing}</p>
        <p className="mt-4 text-body font-bold text-ink">{signedByLabel}</p>
      </article>

      <div className="sticky bottom-0 z-20 -mx-[var(--gutter)] mt-10 border-t border-line bg-board/95 px-[var(--gutter)] py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-measure items-center justify-between gap-3">
          <p className="text-sm font-bold text-ink">
            {formatSupportTotal(supportTotal)} signatures
          </p>
          <Button type="button" onClick={openSign}>
            Sign
          </Button>
        </div>
      </div>

      <OpenLetterSignModal
        open={formOpen}
        busy={busy}
        error={formError}
        onClose={() => {
          if (!busy) setFormOpen(false);
        }}
        onSubmit={handleSubmit}
      />

      <OpenLetterSignSuccess
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
