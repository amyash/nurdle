import { describe, expect, it } from "vitest";
import {
  displayLocationLabel,
  formatDropoffListItem,
  formatDropoffTime,
  sanitiseMakerName,
  sanitiseOtherLocation,
} from "@/lib/mesh-bags/dropoff-format";

describe("formatDropoffListItem", () => {
  it("formats quantity, place and London time", () => {
    const line = formatDropoffListItem({
      quantity: 10,
      locationLabel: "Panama",
      locationOther: null,
      droppedAt: "2026-07-30T13:30:00.000Z",
    });
    expect(line).toMatch(/^10 bags at Panama at \d{2}:\d{2}$/);
  });

  it("uses singular bag and other location text", () => {
    expect(
      formatDropoffListItem({
        quantity: 1,
        locationLabel: "Other location",
        locationOther: "Crusoe’s",
        droppedAt: "2026-07-30T14:12:00.000Z",
      }),
    ).toMatch(/^1 bag at Crusoe’s at \d{2}:\d{2}$/);
  });
});

describe("displayLocationLabel", () => {
  it("prefers other location when present", () => {
    expect(displayLocationLabel("Other location", "Harbour wall")).toBe(
      "Harbour wall",
    );
    expect(displayLocationLabel("Panama", null)).toBe("Panama");
  });
});

describe("formatDropoffTime", () => {
  it("returns HH:mm in Europe/London", () => {
    expect(formatDropoffTime("2026-07-30T13:30:00.000Z")).toMatch(
      /^\d{2}:\d{2}$/,
    );
  });
});

describe("sanitiseMakerName", () => {
  it("accepts short names and blanks", () => {
    expect(sanitiseMakerName("Amy")).toEqual({ ok: true, value: "Amy" });
    expect(sanitiseMakerName("  ")).toEqual({ ok: true, value: null });
    expect(sanitiseMakerName(null)).toEqual({ ok: true, value: null });
  });

  it("rejects overlong names and invalid characters", () => {
    expect(sanitiseMakerName("a".repeat(41)).ok).toBe(false);
    expect(sanitiseMakerName("Amy123").ok).toBe(false);
  });
});

describe("sanitiseOtherLocation", () => {
  it("trims and length-checks", () => {
    expect(sanitiseOtherLocation("  Harbour  ")).toEqual({
      ok: true,
      value: "Harbour",
    });
    expect(sanitiseOtherLocation("x".repeat(81)).ok).toBe(false);
  });
});
