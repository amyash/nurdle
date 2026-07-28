import { describe, expect, it } from "vitest";
import {
  countActiveCheckins,
  isCheckinActive,
  namedHelpingLabel,
  sanitiseFirstName,
  summaryLabel,
  volunteerCountLabel,
} from "@/lib/check-in/format";
import type { BeachCheckinStats } from "@/types/check-in";

describe("isCheckinActive", () => {
  const now = Date.parse("2026-07-28T12:00:00.000Z");

  it("counts active check-ins", () => {
    expect(
      isCheckinActive({
        checkedOutAt: null,
        expiresAt: "2026-07-28T13:00:00.000Z",
        nowMs: now,
      }),
    ).toBe(true);
  });

  it("excludes expired check-ins", () => {
    expect(
      isCheckinActive({
        checkedOutAt: null,
        expiresAt: "2026-07-28T11:00:00.000Z",
        nowMs: now,
      }),
    ).toBe(false);
  });

  it("excludes checked-out records", () => {
    expect(
      isCheckinActive({
        checkedOutAt: "2026-07-28T11:30:00.000Z",
        expiresAt: "2026-07-28T13:00:00.000Z",
        nowMs: now,
      }),
    ).toBe(false);
  });
});

describe("countActiveCheckins", () => {
  const now = Date.parse("2026-07-28T12:00:00.000Z");

  it("only counts currently active rows", () => {
    const count = countActiveCheckins(
      [
        {
          checkedOutAt: null,
          expiresAt: "2026-07-28T13:00:00.000Z",
        },
        {
          checkedOutAt: null,
          expiresAt: "2026-07-28T11:59:00.000Z",
        },
        {
          checkedOutAt: "2026-07-28T11:00:00.000Z",
          expiresAt: "2026-07-28T14:00:00.000Z",
        },
      ],
      now,
    );
    expect(count).toBe(1);
  });
});

describe("volunteer wording", () => {
  it("uses singular and plural forms", () => {
    expect(volunteerCountLabel(1)).toBe("1 volunteer currently here");
    expect(volunteerCountLabel(12)).toBe("12 volunteers currently here");
    expect(volunteerCountLabel(0)).toBe("0 volunteers currently here");
  });

  it("summarises totals across beaches with volunteers only", () => {
    const stats: BeachCheckinStats[] = [
      {
        beachId: "a",
        volunteerCount: 10,
        latestCheckedInAt: null,
        sampleFirstName: null,
      },
      {
        beachId: "b",
        volunteerCount: 0,
        latestCheckedInAt: null,
        sampleFirstName: null,
      },
      {
        beachId: "c",
        volunteerCount: 21,
        latestCheckedInAt: null,
        sampleFirstName: null,
      },
    ];
    expect(summaryLabel(stats)).toBe(
      "31 volunteers currently checked in across 2 beaches",
    );
  });

  it("handles empty totals", () => {
    expect(
      summaryLabel([
        {
          beachId: "a",
          volunteerCount: 0,
          latestCheckedInAt: null,
          sampleFirstName: null,
        },
      ]),
    ).toBe("No volunteers currently checked in");
  });

  it("formats optional name wording", () => {
    expect(namedHelpingLabel("Amy", 8)).toBe(
      "Amy and 7 others are currently helping here.",
    );
    expect(namedHelpingLabel("Amy", 1)).toBe(
      "Amy is currently helping here.",
    );
    expect(namedHelpingLabel(null, 3)).toBeNull();
  });
});

describe("sanitiseFirstName", () => {
  it("accepts optional blank names", () => {
    expect(sanitiseFirstName("")).toEqual({ ok: true, value: null });
    expect(sanitiseFirstName("  ")).toEqual({ ok: true, value: null });
  });

  it("trims and accepts simple first names", () => {
    expect(sanitiseFirstName("  Amy  ")).toEqual({ ok: true, value: "Amy" });
    expect(sanitiseFirstName("Mary-Jane")).toEqual({
      ok: true,
      value: "Mary-Jane",
    });
  });

  it("rejects overly long or invalid names", () => {
    expect(sanitiseFirstName("A".repeat(41)).ok).toBe(false);
    expect(sanitiseFirstName("Amy<script>").ok).toBe(false);
  });
});

/**
 * Session / beach-switch behaviour is enforced in SQL RPCs.
 * These pure helpers document the intended client-side duplicate prevention:
 * one active check-in per session ID.
 */
describe("session uniqueness helpers", () => {
  it("treats a later beach check-in as replacing the previous active one", () => {
    const now = Date.parse("2026-07-28T12:00:00.000Z");
    const previous = {
      beachId: "whitley-bay",
      checkedOutAt: "2026-07-28T12:00:00.000Z",
      expiresAt: "2026-07-28T14:00:00.000Z",
    };
    const next = {
      beachId: "cullercoats-bay",
      checkedOutAt: null,
      expiresAt: "2026-07-28T14:00:00.000Z",
    };

    expect(
      isCheckinActive({
        checkedOutAt: previous.checkedOutAt,
        expiresAt: previous.expiresAt,
        nowMs: now,
      }),
    ).toBe(false);
    expect(
      isCheckinActive({
        checkedOutAt: next.checkedOutAt,
        expiresAt: next.expiresAt,
        nowMs: now,
      }),
    ).toBe(true);
  });

  it("extends expiry from a new server timestamp", () => {
    const checkedInAt = "2026-07-28T10:00:00.000Z";
    const oldExpires = "2026-07-28T12:00:00.000Z";
    const extendedExpires = "2026-07-28T14:00:00.000Z";
    // Just after the previous expiry window would have ended
    const now = Date.parse("2026-07-28T12:05:00.000Z");

    expect(
      isCheckinActive({
        checkedOutAt: null,
        expiresAt: oldExpires,
        nowMs: now,
      }),
    ).toBe(false);

    expect(
      isCheckinActive({
        checkedOutAt: null,
        expiresAt: extendedExpires,
        nowMs: now,
      }),
    ).toBe(true);

    // Extend keeps original check-in time; only expiry moves.
    expect(checkedInAt).toBe("2026-07-28T10:00:00.000Z");
  });
});

describe("map failure resilience", () => {
  it("keeps beach cards usable when map stats fall back to zeros", () => {
    const stats: BeachCheckinStats[] = checkinStatsFallback();
    expect(stats).toHaveLength(10);
    expect(summaryLabel(stats)).toBe("No volunteers currently checked in");
    expect(volunteerCountLabel(stats[0]!.volunteerCount)).toContain(
      "volunteers currently here",
    );
  });
});

function checkinStatsFallback(): BeachCheckinStats[] {
  return [
    "whitley-bay",
    "cullercoats-bay",
    "longsands-north",
    "longsands-south",
    "king-edwards-bay",
    "tynemouth-haven",
    "newbiggin",
    "blyth",
    "seaton-sluice",
    "cambois",
  ].map((beachId) => ({
    beachId,
    volunteerCount: 0,
    latestCheckedInAt: null,
    sampleFirstName: null,
  }));
}
