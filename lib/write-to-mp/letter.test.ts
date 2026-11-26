import { describe, expect, it } from "vitest";
import {
  buildGmailComposeUrl,
  buildMailtoUrl,
  buildMpLetter,
  formatLetterDate,
  previewMpLetter,
  validateConstituent,
} from "@/lib/write-to-mp/letter";

const tynemouth = {
  nameAddressAs: "Sir Alan Campbell",
  nameFullTitle: "Rt Hon Sir Alan Campbell MP",
  constituency: "Tynemouth",
};

const constituent = {
  name: "Jane Smith",
  street: "12 Coast Road",
  town: "Tynemouth",
  postcode: "NE30 2HE",
  email: "jane@example.com",
  phone: "07123 456789",
  dateLabel: "25 November 2026",
};

describe("buildMpLetter", () => {
  it("fills the North East letter and signs it with the constituent’s name", () => {
    const letter = buildMpLetter(tynemouth, constituent);

    expect(letter.subject).toBe(
      "Please sign the open letter on the Port of Tyne nurdle spill",
    );
    expect(letter.body).toContain("Jane Smith\n12 Coast Road\nTynemouth\nNE30 2HE");
    expect(letter.body).toContain("jane@example.com\n07123 456789\n25 November 2026");
    expect(letter.body).toContain("Rt Hon Sir Alan Campbell MP\nHouse of Commons\nLondon\nSW1A 0AA");
    expect(letter.body).toContain("Dear Sir Alan Campbell,");
    expect(letter.body).toContain("X-Press Pearl");
    expect(letter.body).toContain("short term extensions");
    expect(letter.body).toContain(
      "publication of evidence from the STAC giving full attention to the community data",
    );
    expect(letter.body).toContain(
      "Our coastline and wildlife cannot afford further delays.",
    );
    expect(letter.body).toContain("71%");
    expect(letter.body).toContain("Volunteer Liaison Group (VLG)");
    expect(letter.body).toContain(
      "As a North East MP, I urge you to stand with affected coastal communities",
    );
    expect(letter.body.endsWith("Jane Smith")).toBe(true);
    expect(letter.body).not.toContain("[signed]");
    expect(letter.body).not.toContain("[Your Name]");
  });

  it("drops the phone line when none is given", () => {
    const letter = buildMpLetter(tynemouth, { ...constituent, phone: "   " });
    expect(letter.body).not.toContain("07123");
    expect(letter.body).toContain("jane@example.com\n25 November 2026");
  });

  it("does not call an MP outside the North East a North East MP", () => {
    const letter = buildMpLetter(
      { ...tynemouth, constituency: "Islington North" },
      constituent,
    );
    expect(letter.body).toContain("I urge you to stand with affected coastal communities");
    expect(letter.body).not.toContain("As a North East MP");
    expect(letter.body).toContain("Yet here in the North East");
  });

  it("keeps a full Gmail draft inside the compose limit and leaves mailto body off", () => {
    const letter = buildMpLetter(tynemouth, constituent);
    const gmail = buildGmailComposeUrl(
      "alan.campbell.mp@parliament.uk",
      letter.subject,
      letter.body,
    );
    const mailto = buildMailtoUrl(
      "alan.campbell.mp@parliament.uk",
      letter.subject,
      letter.body,
    );

    expect(gmail).toEqual(expect.any(String));
    expect(gmail!.length).toBeLessThanOrEqual(7500);
    expect(mailto?.includesBody).toBe(false);
    expect(mailto?.href.startsWith("mailto:alan.campbell.mp@parliament.uk?subject=")).toBe(true);
    expect(mailto?.href).not.toContain("&body=");
  });
});

describe("previewMpLetter", () => {
  it("shows placeholders until details are filled", () => {
    const letter = previewMpLetter(tynemouth, {
      name: "",
      street: "",
      town: "",
      postcode: "NE30 2HE",
      email: "",
      phone: "",
      date: "",
    });
    expect(letter.body).toContain("[Your name]");
    expect(letter.body).toContain("[Your street address]");
    expect(letter.body).toContain("NE30 2HE");
    expect(letter.body).toContain("[Date]");
    expect(letter.body).toContain("Dear Sir Alan Campbell,");
  });

  it("shows the letter before an MP or any details are known", () => {
    const letter = previewMpLetter(null, {
      name: "Jane",
      street: "",
      town: "",
      postcode: "",
      email: "",
      phone: "",
      date: "2026-11-25",
    });
    expect(letter.body).toContain("Jane");
    expect(letter.body).toContain("[Your street address]");
    expect(letter.body).toContain("[Postcode]");
    expect(letter.body).toContain("Dear [Your MP],");
    expect(letter.body).toContain("[Your MP]\nHouse of Commons");
    expect(letter.body).toContain("25 November 2026");
    expect(letter.body).toContain("I urge you to stand with affected coastal communities");
    expect(letter.body).not.toContain("As a North East MP");
    expect(letter.body.endsWith("Jane")).toBe(true);
  });
});

describe("validateConstituent", () => {
  it("accepts a complete constituent", () => {
    const result = validateConstituent({
      name: "  Jane   Smith ",
      street: "12 Coast Road",
      town: "Tynemouth",
      postcode: "NE30 2HE",
      email: "jane@example.com",
      phone: "+44 7123 456789",
      date: "2026-11-25",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Jane Smith");
      expect(result.value.dateLabel).toBe("25 November 2026");
    }
  });

  it("rejects an incomplete constituent", () => {
    const result = validateConstituent({
      name: "",
      street: "12",
      town: "",
      postcode: "NE30 2HE",
      email: "not-an-email",
      phone: "abc",
      date: "2026-02-31",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.street).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.phone).toBeTruthy();
      expect(result.errors.date).toBeTruthy();
    }
  });
});

describe("formatLetterDate", () => {
  it("formats a real calendar date and rejects impossible ones", () => {
    expect(formatLetterDate("2026-11-25")).toBe("25 November 2026");
    expect(formatLetterDate("2026-02-31")).toBeNull();
  });
});
