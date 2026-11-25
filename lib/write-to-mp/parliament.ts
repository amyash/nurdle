import type { MpLookup } from "@/types/write-to-mp";

const PARLIAMENT_API = "https://members-api.parliament.uk/api";

export type ParsedMember = {
  id: number;
  nameDisplayAs: string;
  nameAddressAs: string;
  nameFullTitle: string;
  constituency: string;
  party: string | null;
};

export function parseConstituencySearch(data: unknown):
  | { ok: true; mp: ParsedMember }
  | { ok: false; reason: "not_found" | "ambiguous" } {
  if (!isRecord(data)) return { ok: false, reason: "not_found" };
  const items = Array.isArray(data.items) ? data.items : [];
  const total =
    typeof data.totalResults === "number" ? data.totalResults : items.length;
  if (total === 0 || items.length === 0) return { ok: false, reason: "not_found" };
  if (total > 1) return { ok: false, reason: "ambiguous" };

  const item = asRecord(items[0]);
  const constituency = asRecord(item?.value);
  const member = asRecord(asRecord(asRecord(constituency?.currentRepresentation)?.member)?.value);
  const representation = asRecord(
    asRecord(constituency?.currentRepresentation)?.representation,
  );
  if (!constituency || !member || !representation) {
    return { ok: false, reason: "not_found" };
  }
  if (representation.house !== 1 || representation.membershipEndDate) {
    return { ok: false, reason: "not_found" };
  }

  const id = member.id;
  const nameDisplayAs = stringValue(member.nameDisplayAs);
  const constituencyName = stringValue(constituency.name);
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
    return { ok: false, reason: "not_found" };
  }
  if (!nameDisplayAs || !constituencyName) {
    return { ok: false, reason: "not_found" };
  }

  const nameAddressAs = stringValue(member.nameAddressAs) || nameDisplayAs;
  const publishedTitle = stringValue(member.nameFullTitle);
  const nameFullTitle = publishedTitle
    ? publishedTitle
    : /\bMP$/i.test(nameDisplayAs)
      ? nameDisplayAs
      : `${nameDisplayAs} MP`;
  const party = stringValue(asRecord(member.latestParty)?.name);

  return {
    ok: true,
    mp: {
      id,
      nameDisplayAs,
      nameAddressAs,
      nameFullTitle,
      constituency: constituencyName,
      party,
    },
  };
}

export function pickMpEmail(data: unknown): string | null {
  if (!isRecord(data) || !Array.isArray(data.value)) return null;
  const contacts = data.value.filter(isRecord);
  const parliamentary = contacts.find(
    (contact) => contact.typeId === 1 && isEmail(contact.email),
  );
  if (parliamentary && typeof parliamentary.email === "string") {
    return parliamentary.email;
  }
  const other = contacts.find((contact) => isEmail(contact.email));
  return other && typeof other.email === "string" ? other.email : null;
}

export function mpContactUrl(id: number): string {
  return `https://members.parliament.uk/member/${id}/contact`;
}

export async function lookupMpByPostcode(postcode: string): Promise<
  | { ok: true; mp: MpLookup }
  | { ok: false; reason: "not_found" | "ambiguous" | "unavailable" }
> {
  let searchJson: unknown;
  try {
    const response = await fetch(
      `${PARLIAMENT_API}/Location/Constituency/Search?searchText=${encodeURIComponent(postcode)}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
        next: { revalidate: 60 * 60 * 24 },
      },
    );
    if (!response.ok) return { ok: false, reason: "unavailable" };
    searchJson = await response.json();
  } catch {
    return { ok: false, reason: "unavailable" };
  }

  const parsed = parseConstituencySearch(searchJson);
  if (!parsed.ok) return parsed;

  let email: string | null = null;
  try {
    const contact = await fetch(
      `${PARLIAMENT_API}/Members/${parsed.mp.id}/Contact`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
        next: { revalidate: 60 * 60 * 24 },
      },
    );
    if (contact.ok) email = pickMpEmail(await contact.json());
  } catch {
    email = null;
  }

  return {
    ok: true,
    mp: {
      ...parsed.mp,
      email,
      contactUrl: mpContactUrl(parsed.mp.id),
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null;
}

function stringValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
  );
}
