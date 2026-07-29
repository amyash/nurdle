import { describe, expect, it } from "vitest";
import {
  beachBagSummary,
  formatNeededShort,
  requesterLabel,
  sanitiseMeshBagName,
} from "@/lib/mesh-bags/format";
import type { MeshBagRequest } from "@/types/mesh-bags";

function request(
  overrides: Partial<MeshBagRequest> &
    Pick<MeshBagRequest, "quantityRequested" | "neededType" | "status">,
): MeshBagRequest {
  return {
    id: "1",
    beachId: "whitley-bay",
    neededAt: null,
    requesterName: null,
    note: null,
    deliveredAt: null,
    createdAt: "2026-07-29T10:00:00.000Z",
    updatedAt: "2026-07-29T10:00:00.000Z",
    ...overrides,
  };
}

describe("beachBagSummary", () => {
  it("summarises ASAP-only requests", () => {
    const summary = beachBagSummary([
      request({ quantityRequested: 12, neededType: "asap", status: "requested" }),
    ]);
    expect(summary.tone).toBe("requested");
    expect(summary.primary).toBe("12 bags requested ASAP");
  });

  it("summarises mixed ASAP and scheduled", () => {
    const now = Date.parse("2026-07-29T10:00:00+01:00");
    const summary = beachBagSummary(
      [
        request({
          id: "a",
          quantityRequested: 12,
          neededType: "asap",
          status: "requested",
        }),
        request({
          id: "b",
          quantityRequested: 15,
          neededType: "scheduled",
          neededAt: "2026-07-30T08:00:00+01:00",
          status: "requested",
        }),
      ],
      now,
    );
    expect(summary.primary).toBe("27 bags requested");
    expect(summary.detail).toContain("12 ASAP");
    expect(summary.detail).toContain("15");
  });
});

describe("formatNeededShort", () => {
  it("returns ASAP", () => {
    expect(
      formatNeededShort({ neededType: "asap", neededAt: null }),
    ).toBe("ASAP");
  });
});

describe("requesterLabel", () => {
  it("handles anonymous and named", () => {
    expect(requesterLabel(null)).toBe("Requested anonymously");
    expect(requesterLabel("Amy")).toBe("Requested by Amy");
  });
});

describe("sanitiseMeshBagName", () => {
  it("accepts short names", () => {
    expect(sanitiseMeshBagName("Amy")).toEqual({ ok: true, value: "Amy" });
  });
});
