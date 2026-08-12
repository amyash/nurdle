import { describe, expect, it } from "vitest";
import { validateFormGate } from "@/lib/form-gate/validate";

describe("validateFormGate", () => {
  const openedAt = 1_000_000;

  it("accepts a normal submission", () => {
    expect(
      validateFormGate(
        { formOpenedAt: openedAt, honeypot: "" },
        openedAt + 4000,
      ),
    ).toBe(true);
  });

  it("rejects filled honeypot", () => {
    expect(
      validateFormGate(
        { formOpenedAt: openedAt, honeypot: "spam" },
        openedAt + 4000,
      ),
    ).toBe(false);
  });

  it("rejects submissions that are too fast", () => {
    expect(
      validateFormGate(
        { formOpenedAt: openedAt, honeypot: "" },
        openedAt + 1000,
      ),
    ).toBe(false);
  });

  it("rejects missing or stale openedAt", () => {
    expect(
      validateFormGate({ formOpenedAt: NaN, honeypot: "" }, openedAt + 4000),
    ).toBe(false);
    expect(
      validateFormGate(
        { formOpenedAt: openedAt, honeypot: "" },
        openedAt + 25 * 60 * 60 * 1000,
      ),
    ).toBe(false);
  });
});
