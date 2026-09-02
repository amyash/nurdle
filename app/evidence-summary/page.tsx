import type { Metadata } from "next";
import { EvidenceSummaryArticle } from "@/components/evidence-summary-article";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Preliminary evidence summary",
  description:
    "Unlisted organising-team briefing covering WhatsApp sources from 23–31 July 2026. Preliminary extraction, not a legal conclusion.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EvidenceSummaryPage() {
  return (
    <PageShell narrow className="max-w-[44rem]">
      <EvidenceSummaryArticle />
    </PageShell>
  );
}
