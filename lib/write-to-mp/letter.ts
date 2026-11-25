import {
  MP_LETTER_PARAGRAPHS,
  MP_LETTER_SUBJECT,
  isNorthEastConstituency,
  mpLetterClosing,
} from "@/data/mp-letter";
import type { MpLookup } from "@/types/write-to-mp";

export const MAILTO_URL_LIMIT = 1800;
export const GMAIL_COMPOSE_URL_LIMIT = 7500;

export type MpLetterRecipient = Pick<
  MpLookup,
  "nameAddressAs" | "nameFullTitle" | "constituency"
>;

export type MpLetterConstituent = {
  name: string;
  street: string;
  town: string;
  postcode: string;
  email: string;
  phone: string;
  dateLabel: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanLetterLine(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatLetterDate(isoDate: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utc);
}

export function todayIsoDate(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export type ConstituentInput = {
  name: string;
  street: string;
  town: string;
  postcode: string;
  email: string;
  phone: string;
  date: string;
};

export type ConstituentField = keyof ConstituentInput;

export function validateConstituent(input: ConstituentInput):
  | { ok: true; value: MpLetterConstituent }
  | { ok: false; errors: Partial<Record<ConstituentField, string>> } {
  const errors: Partial<Record<ConstituentField, string>> = {};
  const name = cleanLetterLine(input.name);
  const street = cleanLetterLine(input.street);
  const town = cleanLetterLine(input.town);
  const postcode = cleanLetterLine(input.postcode);
  const email = cleanLetterLine(input.email);
  const phone = cleanLetterLine(input.phone);
  const dateLabel = formatLetterDate(input.date);

  if (name.length < 2) errors.name = "Enter your name.";
  else if (name.length > 80) errors.name = "Use a shorter name.";

  if (street.length < 5) errors.street = "Enter your street address.";
  else if (street.length > 120) errors.street = "Use a shorter street address.";

  if (town.length < 2) errors.town = "Enter your town or city.";
  else if (town.length > 80) errors.town = "Use a shorter town or city.";

  if (!postcode) errors.postcode = "Enter your postcode.";

  if (!email || !EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.email = "Enter your email address.";
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (
      phone.length > 30 ||
      !/^[0-9+().\-\s]+$/.test(phone) ||
      digits.length < 8 ||
      digits.length > 15
    ) {
      errors.phone = "Enter a phone number, or leave it blank.";
    }
  }

  if (!dateLabel) errors.date = "Choose a date.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name,
      street,
      town,
      postcode,
      email,
      phone,
      dateLabel: dateLabel ?? "",
    },
  };
}

export function buildMpLetter(
  mp: MpLetterRecipient,
  constituent: MpLetterConstituent,
): { subject: string; body: string } {
  const name = cleanLetterLine(constituent.name);
  const street = cleanLetterLine(constituent.street);
  const town = cleanLetterLine(constituent.town);
  const postcode = cleanLetterLine(constituent.postcode);
  const email = cleanLetterLine(constituent.email);
  const phone = cleanLetterLine(constituent.phone);
  const dateLabel = cleanLetterLine(constituent.dateLabel);
  const addressAs = cleanLetterLine(mp.nameAddressAs);
  const fullTitle = cleanLetterLine(mp.nameFullTitle);

  const heading = [
    name,
    street,
    town,
    postcode,
    email,
    ...(phone ? [phone] : []),
    dateLabel,
    "",
    fullTitle,
    "House of Commons",
    "London",
    "SW1A 0AA",
    "",
    `Dear ${addressAs},`,
  ].join("\n");

  const body = [
    heading,
    ...MP_LETTER_PARAGRAPHS,
    mpLetterClosing(isNorthEastConstituency(mp.constituency)),
    name,
  ].join("\n\n");

  return { subject: MP_LETTER_SUBJECT, body };
}

export function previewMpLetter(
  mp: MpLetterRecipient,
  input: ConstituentInput,
): { subject: string; body: string } {
  const dateLabel = formatLetterDate(input.date);
  return buildMpLetter(mp, {
    name: cleanLetterLine(input.name) || "[Your name]",
    street: cleanLetterLine(input.street) || "[Your street address]",
    town: cleanLetterLine(input.town) || "[Town/City]",
    postcode: cleanLetterLine(input.postcode) || "[Postcode]",
    email: cleanLetterLine(input.email) || "[Your email address]",
    phone: cleanLetterLine(input.phone),
    dateLabel: dateLabel || "[Date]",
  });
}

function isSafeEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email) && !/[\r\n]/.test(email);
}

export function buildMailtoUrl(
  email: string,
  subject: string,
  body: string,
): { href: string; includesBody: boolean } | null {
  if (!isSafeEmail(email)) return null;
  const withSubject = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  const withBody = `${withSubject}&body=${encodeURIComponent(body)}`;
  if (withBody.length <= MAILTO_URL_LIMIT) {
    return { href: withBody, includesBody: true };
  }
  return { href: withSubject, includesBody: false };
}

export function buildGmailComposeUrl(
  email: string,
  subject: string,
  body: string,
): string | null {
  if (!isSafeEmail(email)) return null;
  const href =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
  if (href.length > GMAIL_COMPOSE_URL_LIMIT) return null;
  return href;
}
