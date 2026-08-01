import type { OpenLetterSignatureStats } from "@/types/open-letter";

export function mapOpenLetterAdditiveCount(
  value: number | string | null | undefined,
): OpenLetterSignatureStats {
  return {
    additiveCount: Number(value ?? 0) || 0,
  };
}
