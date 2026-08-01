"use client";

import { useEffect, useState } from "react";
import { openLetter } from "@/data/open-letter";
import { Callout } from "@/components/ui/callout";
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

    // WhatsApp members are stored but must not change the displayed total.
    if (!input.joinedWhatsapp) {
      setAdditiveCount(result.additiveCount);
    }
    setFormOpen(false);
    setShowSuccess(true);
  }

  const supportTotal = openLetter.whatsappMemberCount + additiveCount;
  const signedByLabel = formatSignedByLabel(supportTotal);

  return (
    <div className="space-y-6">
      <Callout tone="mark" aria-label="Open letter support">
        <p className="text-eyebrow text-mute">Community support</p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-mark">
          {formatSupportTotal(supportTotal)}
        </p>
        <p className="mt-2 text-body font-bold">{signedByLabel}</p>
        <Button
          type="button"
          fullWidth
          className="mt-4"
          onClick={() => {
            setFormError(null);
            setFormOpen(true);
          }}
        >
          Sign
        </Button>
      </Callout>

      <article aria-labelledby="open-letter-addressee">
        <h2 id="open-letter-addressee" className="text-section">
          {openLetter.addressee}
        </h2>
        <p className="mt-3 text-body font-bold">{openLetter.title}</p>

        <div className="mt-4 space-y-3 text-body">
          {openLetter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <h3 className="mt-5 text-card-title">{openLetter.concernsHeading}</h3>
        <ol className="mt-3 space-y-3">
          {openLetter.concerns.map((concern, index) => {
            const title = "title" in concern ? concern.title : null;
            return (
              <li key={title ?? concern.text} className="text-body">
                {title ? (
                  <>
                    <span className="font-bold">
                      {index + 1}. {title}:
                    </span>{" "}
                    {concern.text}
                  </>
                ) : (
                  <>
                    <span className="font-bold">{index + 1}.</span>{" "}
                    {concern.text}
                  </>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-5 text-body">{openLetter.impact}</p>

        <p className="mt-5 text-body">{openLetter.demand}</p>

        <p className="mt-6 text-body">{openLetter.closing}</p>
        <p className="mt-3 text-body font-bold">{signedByLabel}</p>

        <Button
          type="button"
          fullWidth
          className="mt-6"
          onClick={() => {
            setFormError(null);
            setFormOpen(true);
          }}
        >
          Sign
        </Button>
      </article>

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
