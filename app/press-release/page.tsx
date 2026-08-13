import type { Metadata } from "next";
import { PressReleaseArticle } from "@/components/press-release-article";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Press release",
  description:
    "Spring tide looms as nurdle volunteers demand more action — North East England, 11 August 2026.",
};

export default function PressReleasePage() {
  return (
    <PageShell narrow className="max-w-[44rem]">
      <PressReleaseArticle />
    </PageShell>
  );
}
