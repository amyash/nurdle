import type { Metadata } from "next";
import { PressReleaseArticle } from "@/components/press-release-article";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Press release",
  description:
    "North East volunteers left to fill the gap as official clean-up scales back and nurdle pollution reaches Yorkshire coast — North East England, 24 August 2026.",
};

export default function PressReleasePage() {
  return (
    <PageShell narrow className="max-w-[44rem]">
      <PressReleaseArticle />
    </PageShell>
  );
}
