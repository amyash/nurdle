import { describe, expect, it } from "vitest";
import { CLEANUP_LOG_MIN_DATE } from "@/data/spill";
import { aggregateCleanupLogs } from "@/lib/cleanup-logs/aggregate";
import {
  estimatedKgForVolume,
  formatEstimatedWeight,
  isValidCleanupDate,
  litresToEstimatedKg,
  parseDurationMinutes,
  volunteerHoursForSubmission,
} from "@/lib/cleanup-logs/format";

describe("volunteerHoursForSubmission", () => {
  it("counts one person for two hours as two volunteer hours", () => {
    expect(volunteerHoursForSubmission(120, 1)).toBe(2);
  });

  it("counts four people for two hours as eight volunteer hours", () => {
    expect(volunteerHoursForSubmission(120, 4)).toBe(8);
  });
});

describe("aggregateCleanupLogs", () => {
  it("keeps Whitley Bay beaches independent and sums overall", () => {
    const stats = aggregateCleanupLogs([
      {
        beachId: "whitley-bay-north",
        durationMinutes: 60,
        volunteerCount: 2,
        estimatedWeightKg: 1.5,
      },
      {
        beachId: "whitley-bay-south",
        durationMinutes: 120,
        volunteerCount: 1,
        estimatedWeightKg: null,
      },
    ]);

    expect(stats.byBeach["whitley-bay-north"]?.totalVolunteerHours).toBe(2);
    expect(stats.byBeach["whitley-bay-south"]?.totalVolunteerHours).toBe(2);
    expect(stats.overall.totalVolunteerHours).toBe(4);
    expect(stats.overall.totalVolunteerSessions).toBe(3);
    expect(stats.overall.totalEstimatedWeightKg).toBe(1.5);
    expect(stats.beachCountWithActivity).toBe(2);
  });
});

describe("parseDurationMinutes", () => {
  it("accepts 15 minutes minimum", () => {
    expect(parseDurationMinutes(0, 15)).toEqual({ ok: true, minutes: 15 });
  });

  it("rejects under 15 minutes", () => {
    expect(parseDurationMinutes(0, 10)).toEqual({ ok: false });
  });
});

describe("estimatedKgForVolume", () => {
  it("converts 1 litre at 550 g/L", () => {
    expect(litresToEstimatedKg(1)).toBe(0.55);
    expect(estimatedKgForVolume("1-litre")).toEqual({
      ok: true,
      id: "1-litre",
      label: "1 litre",
      kg: 0.55,
    });
  });

  it("uses midpoints for volume ranges", () => {
    expect(estimatedKgForVolume("2-5-litres")).toEqual({
      ok: true,
      id: "2-5-litres",
      label: "2–5 litres",
      kg: 1.93,
    });
  });

  it("rejects unknown volumes", () => {
    expect(estimatedKgForVolume("bucket")).toEqual({ ok: false });
  });
});

describe("isValidCleanupDate", () => {
  const now = Date.parse("2026-07-29T12:00:00+01:00");

  it("rejects future dates", () => {
    expect(isValidCleanupDate("2026-07-30", now)).toBe(false);
  });

  it("rejects dates before the clean-up logging start", () => {
    expect(isValidCleanupDate("2026-07-23", now)).toBe(false);
  });

  it("accepts the clean-up logging start date", () => {
    expect(isValidCleanupDate(CLEANUP_LOG_MIN_DATE, now)).toBe(true);
  });
});

describe("formatEstimatedWeight", () => {
  it("uses tonnes at 1000kg+", () => {
    expect(formatEstimatedWeight(2300)).toContain("tonne");
  });
});
