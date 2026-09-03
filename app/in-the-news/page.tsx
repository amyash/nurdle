import type { Metadata } from "next";
import { MediaCoverageList } from "@/components/media-coverage-list";
import { PageShell } from "@/components/page-shell";
import { mediaCoverage } from "@/data/media-coverage";

export const metadata: Metadata = {
  title: "In the news",
  description:
    "Newspaper and broadcast reports covering the volunteer response to the Port of Tyne nurdle spill.",
};

export default function InTheNewsPage() {
  return (
    <PageShell
      title="In the news"
      lead="A short selection of newspaper and broadcast reports on the community effort. Headlines open the original articles."
    >
      <MediaCoverageList items={mediaCoverage} />
      <p className="mt-8 reading-measure text-meta">
        This is not a complete cuttings file. The campaign has featured in far
        more coverage than we list here.
      </p>
    </PageShell>
  );
}
