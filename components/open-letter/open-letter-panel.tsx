"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { openLetter } from "@/data/open-letter";
import {
  createOpenLetterSignature,
  fetchOpenLetterData,
} from "@/lib/open-letter/api";
import {
  OPEN_LETTER_ADDRESS_MAX,
  OPEN_LETTER_NAME_MAX,
  formatSignatureCount,
} from "@/lib/open-letter/format";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  OpenLetterSignaturePublic,
  OpenLetterSignatureStats,
} from "@/types/open-letter";

function emptyStats(): OpenLetterSignatureStats {
  return { signatureCount: 0 };
}

export function OpenLetterPanel() {
  const configured = isSupabaseConfigured();
  const nameFieldId = useId();
  const addressFieldId = useId();
  const consentId = useId();
  const formHeadingId = useId();
  const listHeadingId = useId();

  const [signatures, setSignatures] = useState<OpenLetterSignaturePublic[]>(
    [],
  );
  const [stats, setStats] = useState<OpenLetterSignatureStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setSignatures([]);
          setStats(emptyStats());
          setLoading(false);
        }
        return;
      }

      const result = await fetchOpenLetterData();
      if (cancelled) return;
      if (result.ok) {
        setSignatures(result.signatures);
        setStats(result.stats);
        setLoadError(null);
      } else if (result.error === "not_configured") {
        setSignatures([]);
        setStats(emptyStats());
      } else {
        setLoadError(result.message);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") ?? "");
    const address = String(data.get("address") ?? "");
    const consentPublic = data.get("consentPublic") === "on";

    setBusy(true);
    setFormError(null);
    setSuccessMessage(null);

    const result = await createOpenLetterSignature({
      fullName,
      address,
      consentPublic,
    });
    setBusy(false);

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    form.reset();
    setSuccessMessage("Thank you — your signature has been added.");

    if (result.signature) {
      setSignatures((prev) => [
        result.signature!,
        ...prev.filter((item) => item.id !== result.signature!.id),
      ]);
      setStats((prev) => ({
        signatureCount: prev.signatureCount + 1,
      }));
    }

    const refreshed = await fetchOpenLetterData();
    if (refreshed.ok) {
      setSignatures(refreshed.signatures);
      setStats(refreshed.stats);
    }
  }

  return (
    <div className="space-y-6">
      <article aria-labelledby="open-letter-title">
        <h2
          id="open-letter-title"
          className="text-xl font-bold leading-snug text-[var(--ink)]"
        >
          {openLetter.title}
        </h2>
        <p className="mt-3 text-sm font-bold uppercase tracking-wide text-[var(--mute)]">
          {openLetter.dateline}
        </p>

        <div className="mt-4 space-y-3 text-base leading-snug text-[var(--ink)]">
          {openLetter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <h3 className="mt-5 text-base font-bold text-[var(--ink)]">
          {openLetter.concernsHeading}
        </h3>
        <ol className="mt-3 space-y-3">
          {openLetter.concerns.map((concern, index) => (
            <li
              key={concern.title}
              className="text-base leading-snug text-[var(--ink)]"
            >
              <span className="font-bold">
                {index + 1}. {concern.title}:
              </span>{" "}
              {concern.text}
            </li>
          ))}
        </ol>

        <p className="mt-5 text-base leading-snug text-[var(--ink)]">
          {openLetter.demand}
        </p>
      </article>

      <section
        aria-labelledby={formHeadingId}
        className="rounded-lg border border-[var(--line)] bg-white px-3 py-4"
      >
        <h2
          id={formHeadingId}
          className="text-lg font-bold leading-snug text-[var(--ink)]"
        >
          Sign the open letter
        </h2>
        <p className="mt-2 text-sm leading-snug text-[var(--mute)]">
          Add your name and address to support this call for a coordinated
          marine recovery response on the River Tyne.
        </p>
        <p className="mt-2 text-sm font-bold text-[var(--ink)]" role="status">
          {loading
            ? "Loading signatures…"
            : formatSignatureCount(stats.signatureCount)}
        </p>

        {!configured ? (
          <aside
            className="mt-3 rounded-lg border border-amber-800/40 bg-amber-50 p-3 text-sm leading-snug text-amber-950"
            role="note"
          >
            Signing isn’t connected for this environment yet. Add Supabase
            credentials and run the open letter SQL migration to enable
            signatures.
          </aside>
        ) : null}

        {loadError ? (
          <p role="alert" className="mt-3 text-sm leading-snug text-red-800">
            {loadError}
          </p>
        ) : null}

        <form className="mt-4 space-y-3" onSubmit={(e) => void handleSubmit(e)}>
          <div>
            <label
              htmlFor={nameFieldId}
              className="block text-sm font-bold text-[var(--ink)]"
            >
              Full name
            </label>
            <input
              id={nameFieldId}
              name="fullName"
              type="text"
              required
              disabled={busy || !configured}
              maxLength={OPEN_LETTER_NAME_MAX}
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor={addressFieldId}
              className="block text-sm font-bold text-[var(--ink)]"
            >
              Address
            </label>
            <textarea
              id={addressFieldId}
              name="address"
              required
              disabled={busy || !configured}
              maxLength={OPEN_LETTER_ADDRESS_MAX}
              rows={3}
              autoComplete="street-address"
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-base disabled:opacity-60"
            />
          </div>

          <label
            htmlFor={consentId}
            className="flex items-start gap-2 text-sm leading-snug text-[var(--ink)]"
          >
            <input
              id={consentId}
              name="consentPublic"
              type="checkbox"
              required
              disabled={busy || !configured}
              className="mt-1 h-4 w-4 shrink-0"
            />
            <span>
              I understand my name and address will appear publicly on this open
              letter.
            </span>
          </label>

          {formError ? (
            <p role="alert" className="text-sm leading-snug text-red-800">
              {formError}
            </p>
          ) : null}

          {successMessage ? (
            <p role="status" className="text-sm font-bold leading-snug text-[var(--mark)]">
              {successMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || !configured}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--mark)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? "Signing…" : "Sign the letter"}
          </button>
        </form>
      </section>

      <section aria-labelledby={listHeadingId}>
        <h2
          id={listHeadingId}
          className="text-sm font-bold uppercase tracking-wide text-[var(--mute)]"
        >
          Signatories
        </h2>

        {loading ? (
          <p className="mt-2 text-sm text-[var(--mute)]" role="status">
            Loading signatures…
          </p>
        ) : signatures.length === 0 ? (
          <p className="mt-2 text-sm leading-snug text-[var(--mute)]">
            No signatures yet. Be the first to add your name.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {signatures.map((signature) => (
              <li
                key={signature.id}
                className="rounded-lg border border-[var(--line)] bg-white px-3 py-3"
              >
                <p className="font-bold text-[var(--ink)]">
                  {signature.fullName}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm leading-snug text-[var(--mute)]">
                  {signature.address}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
