import { describe, expect, it } from "vitest";
import {
  parseConstituencySearch,
  pickMpEmail,
} from "@/lib/write-to-mp/parliament";

const tynemouthSearch = {
  items: [
    {
      value: {
        id: 4372,
        name: "Tynemouth",
        currentRepresentation: {
          member: {
            value: {
              id: 529,
              nameDisplayAs: "Sir Alan Campbell",
              nameFullTitle: "Rt Hon Sir Alan Campbell MP",
              nameAddressAs: "Sir Alan Campbell",
              latestParty: { name: "Labour" },
            },
          },
          representation: {
            house: 1,
            membershipEndDate: null,
          },
        },
      },
    },
  ],
  totalResults: 1,
  resultType: "FullPostcode",
};

describe("parseConstituencySearch", () => {
  it("reads the current Commons MP for a full postcode", () => {
    const result = parseConstituencySearch(tynemouthSearch);
    expect(result).toEqual({
      ok: true,
      mp: {
        id: 529,
        nameDisplayAs: "Sir Alan Campbell",
        nameAddressAs: "Sir Alan Campbell",
        nameFullTitle: "Rt Hon Sir Alan Campbell MP",
        constituency: "Tynemouth",
        party: "Labour",
      },
    });
  });

  it("treats several matches as ambiguous", () => {
    expect(
      parseConstituencySearch({
        items: [{}, {}],
        totalResults: 2,
      }),
    ).toEqual({ ok: false, reason: "ambiguous" });
  });

  it("treats an empty result as not found", () => {
    expect(parseConstituencySearch({ items: [], totalResults: 0 })).toEqual({
      ok: false,
      reason: "not_found",
    });
  });

  it("ignores someone who is not a current MP", () => {
    const ended = {
      items: [
        {
          value: {
            ...tynemouthSearch.items[0].value,
            currentRepresentation: {
              ...tynemouthSearch.items[0].value.currentRepresentation,
              representation: {
                house: 1,
                membershipEndDate: "2024-05-30T00:00:00",
              },
            },
          },
        },
      ],
      totalResults: 1,
    };
    expect(parseConstituencySearch(ended)).toEqual({
      ok: false,
      reason: "not_found",
    });
  });
});

describe("pickMpEmail", () => {
  it("prefers the parliamentary office email", () => {
    expect(
      pickMpEmail({
        value: [
          { typeId: 4, email: "office@constituency.example" },
          { typeId: 1, email: "alan.campbell.mp@parliament.uk" },
          { typeId: 6, email: null },
        ],
      }),
    ).toBe("alan.campbell.mp@parliament.uk");
  });

  it("falls back to another published email", () => {
    expect(
      pickMpEmail({
        value: [
          { typeId: 1, email: null },
          { typeId: 4, email: "office@constituency.example" },
        ],
      }),
    ).toBe("office@constituency.example");
  });

  it("returns null when no email is published", () => {
    expect(pickMpEmail({ value: [{ typeId: 1, email: null }] })).toBeNull();
  });
});
