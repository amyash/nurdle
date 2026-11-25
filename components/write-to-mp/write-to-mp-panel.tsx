"use client";

import { useId, useState, type FormEvent } from "react";
import { Callout } from "@/components/ui/callout";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/form-field";
import { isNorthEastConstituency } from "@/data/mp-letter";
import { sanitiseOpenLetterPostcode } from "@/lib/open-letter/format";
import { fetchMpByPostcode } from "@/lib/write-to-mp/api";
import {
  buildGmailComposeUrl,
  buildMailtoUrl,
  buildMpLetter,
  previewMpLetter,
  todayIsoDate,
  validateConstituent,
  type ConstituentField,
} from "@/lib/write-to-mp/letter";
import type { MpLookup } from "@/types/write-to-mp";

const POSTCODE_HINT = "Enter a full UK postcode, such as NE30 2HE.";

export function WriteToMpPanel() {
  const postcodeId = useId();
  const nameId = useId();
  const streetId = useId();
  const townId = useId();
  const emailId = useId();
  const phoneId = useId();
  const dateId = useId();

  const [postcode, setPostcode] = useState("");
  const [resolvedPostcode, setResolvedPostcode] = useState<string | null>(null);
  const [mp, setMp] = useState<MpLookup | null>(null);
  const [busy, setBusy] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [town, setTown] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(todayIsoDate);
  const [showErrors, setShowErrors] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const parsedPostcode = sanitiseOpenLetterPostcode(postcode);
  const postcodeDirty =
    resolvedPostcode !== null &&
    (!parsedPostcode.ok || parsedPostcode.value !== resolvedPostcode);

  const constituentInput = {
    name,
    street,
    town,
    postcode: resolvedPostcode ?? "",
    email,
    phone,
    date,
  };
  const validation = validateConstituent(constituentInput);
  const fieldErrors: Partial<Record<ConstituentField, string>> =
    showErrors && !validation.ok ? validation.errors : {};
  const letter = mp ? previewMpLetter(mp, constituentInput) : null;
  const mailto =
    mp?.email && letter
      ? buildMailtoUrl(mp.email, letter.subject, letter.body)
      : null;
  const gmailUrl =
    mp?.email && letter
      ? buildGmailComposeUrl(mp.email, letter.subject, letter.body)
      : null;

  async function onFind(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setNotice(null);
    const parsed = sanitiseOpenLetterPostcode(postcode);
    if (!parsed.ok) {
      setLookupError(POSTCODE_HINT);
      return;
    }
    setLookupError(null);
    setBusy(true);
    const result = await fetchMpByPostcode(parsed.value);
    setBusy(false);
    if (!result.ok) {
      setLookupError(result.message);
      return;
    }
    setPostcode(result.postcode);
    setResolvedPostcode(result.postcode);
    setMp(result.mp);
    setShowErrors(false);
  }

  function onEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mp || !letter) return;
    setShowErrors(true);
    if (postcodeDirty) {
      setNotice(
        "Postcode changed. Find your MP again before sending, so the letter goes to the right person.",
      );
      return;
    }
    const checked = validateConstituent(constituentInput);
    if (!checked.ok) {
      setNotice("Add the missing details, then send the letter.");
      return;
    }
    if (!mp.email || !mailto) {
      setNotice("Copy the letter and send it from your MP’s Parliament contact page.");
      return;
    }

    const ready = buildMpLetter(mp, checked.value);
    const opened = buildMailtoUrl(mp.email, ready.subject, ready.body);
    if (!opened) return;

    const pasted =
      `The letter is copied. Paste it into the email to ${mp.nameAddressAs} (${mp.email}) and send it. The subject is already filled in.`;
    const manual =
      `Start an email to ${mp.email}. The subject is “${ready.subject}”. Select the letter below, copy it, paste it in, and send.`;

    const write = navigator.clipboard?.writeText(ready.body);
    if (write) {
      void write.then(
        () => setNotice(pasted),
        () => setNotice(manual),
      );
    } else {
      setNotice(manual);
    }
    window.location.href = opened.href;
  }

  function onGmail() {
    if (!mp?.email) return;
    setShowErrors(true);
    if (postcodeDirty) {
      setNotice(
        "Postcode changed. Find your MP again before sending, so the letter goes to the right person.",
      );
      return;
    }
    const checked = validateConstituent(constituentInput);
    if (!checked.ok) {
      setNotice("Add the missing details, then open Gmail.");
      return;
    }
    const ready = buildMpLetter(mp, checked.value);
    const url = buildGmailComposeUrl(mp.email, ready.subject, ready.body);
    if (!url) {
      setNotice(
        "This letter is too long to open as a Gmail draft. Use Email or Copy letter.",
      );
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setNotice(
      `A Gmail draft to ${mp.nameAddressAs} should open in a new tab, with the full letter filled in. Check it, then send.`,
    );
  }

  async function onCopy() {
    if (!mp || !letter) return;
    setShowErrors(true);
    if (postcodeDirty) {
      setNotice(
        "Postcode changed. Find your MP again before copying, so the letter names the right MP.",
      );
      return;
    }
    const checked = validateConstituent(constituentInput);
    if (!checked.ok) {
      setNotice("Add the missing details, then copy the letter.");
      return;
    }
    const ready = buildMpLetter(mp, checked.value);
    try {
      await navigator.clipboard.writeText(ready.body);
      setNotice("Letter copied.");
    } catch {
      setNotice("Select the letter below and copy it.");
    }
  }

  return (
    <div className="rounded-soft border border-line border-l-[3px] border-l-mark bg-paper px-4 py-5 sm:px-6 sm:py-6">
      <form onSubmit={onFind}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <FormField
            label="Your postcode"
            htmlFor={postcodeId}
            className="min-w-0 flex-1 sm:max-w-xs"
          >
            <Input
              id={postcodeId}
              name="postcode"
              value={postcode}
              onChange={(event) => {
                setPostcode(event.target.value);
                setLookupError(null);
              }}
              autoComplete="postal-code"
              autoCapitalize="characters"
              spellCheck={false}
              inputMode="text"
              required
              disabled={busy}
              placeholder="NE30 2HE"
            />
          </FormField>
          <Button type="submit" disabled={busy} className="w-full sm:w-auto">
            {busy ? "Finding your MP…" : "Find my MP"}
          </Button>
        </div>
        <p className="mt-3 max-w-measure text-meta">
          Matched using the UK Parliament member list, the same source as the
          official MP finder. Only the postcode is looked up. Your name and
          address stay in your browser.
        </p>
        {lookupError ? (
          <p role="alert" className="mt-3 text-sm font-bold text-red-800">
            {lookupError}
          </p>
        ) : null}
      </form>

      {mp && letter ? (
        <form onSubmit={onEmail} className="mt-8 space-y-8">
          <div aria-live="polite">
            <p className="text-eyebrow text-mark">Your MP</p>
            <p className="mt-2 text-card-title">{mp.nameFullTitle}</p>
            <p className="mt-1 text-meta">
              {mp.constituency}
              {mp.party ? ` · ${mp.party}` : ""}
            </p>
            {mp.email ? (
              <p className="mt-2 text-sm text-ink">
                Email: <span className="font-bold">{mp.email}</span>
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {mp.nameAddressAs} hasn’t published an email address. Copy the
                letter and send it from their{" "}
                <a
                  href={mp.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-mark underline underline-offset-2"
                >
                  Parliament contact page
                </a>
                .
              </p>
            )}
            {!isNorthEastConstituency(mp.constituency) ? (
              <p className="mt-3 max-w-measure text-meta">
                This constituency is outside the North East. The closing line
                addresses them as your MP. Please read the letter before you
                send it — it is written about the North East spill.
              </p>
            ) : null}
          </div>

          <div>
            <h3 className="text-card-title">Your details</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField label="Full name" htmlFor={nameId} error={fieldErrors.name}>
                <Input
                  id={nameId}
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </FormField>
              <FormField
                label="Email"
                htmlFor={emailId}
                error={fieldErrors.email}
              >
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </FormField>
              <FormField
                label="Street address"
                htmlFor={streetId}
                error={fieldErrors.street}
                className="sm:col-span-2"
              >
                <Input
                  id={streetId}
                  name="street"
                  value={street}
                  onChange={(event) => setStreet(event.target.value)}
                  autoComplete="street-address"
                  required
                />
              </FormField>
              <FormField label="Town or city" htmlFor={townId} error={fieldErrors.town}>
                <Input
                  id={townId}
                  name="town"
                  value={town}
                  onChange={(event) => setTown(event.target.value)}
                  autoComplete="address-level2"
                  required
                />
              </FormField>
              <FormField
                label="Phone"
                htmlFor={phoneId}
                optional
                error={fieldErrors.phone}
              >
                <Input
                  id={phoneId}
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                />
              </FormField>
              <FormField label="Date" htmlFor={dateId} error={fieldErrors.date}>
                <Input
                  id={dateId}
                  name="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </FormField>
            </div>
            <p className="mt-3 text-meta">
              Postcode on the letter: {resolvedPostcode}. MPs use your address
              to check you are a constituent.
            </p>
          </div>

          <div>
            <h3 className="text-card-title">Your letter</h3>
            <div className="mt-4 rounded-control border border-line bg-surface p-4">
              <p className="text-xs font-bold text-ink">Subject</p>
              <p className="mt-1 text-sm leading-snug text-ink">{letter.subject}</p>
              <pre className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">
                {letter.body}
              </pre>
            </div>
          </div>

          <div>
            {postcodeDirty ? (
              <p role="status" className="mb-3 text-sm font-bold text-ink">
                Postcode changed. Find your MP again before sending, so the
                letter goes to the right person.
              </p>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {mp.email ? (
                <Button type="submit" className="h-auto whitespace-normal text-center">
                  Email {mp.nameAddressAs}
                </Button>
              ) : null}
              {gmailUrl ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="h-auto whitespace-normal text-center"
                  onClick={onGmail}
                >
                  Open in Gmail
                </Button>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                onClick={() => void onCopy()}
              >
                Copy letter
              </Button>
            </div>
            <p className="mt-3 max-w-measure text-meta">
              {mp.email
                ? "Email opens your mail app with the subject filled in and copies the letter so you can paste it in. It has to come from you, so your MP can see you are a constituent. Open in Gmail fills in the whole letter."
                : "Copy the letter, then send it from the Parliament contact page."}
            </p>
            {notice ? (
              <Callout tone="mark" className="mt-4">
                <p className="text-sm leading-relaxed">{notice}</p>
              </Callout>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}
