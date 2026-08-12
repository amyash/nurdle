import type { Metadata } from "next";
import { WildlifeImpactPanel } from "@/components/wildlife/wildlife-impact-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Wildlife impact",
  description:
    "Report and view community wildlife sightings potentially linked to the North East nurdle spill.",
};

export default function WildlifeImpactPage() {
  return (
    <PageShell
      title="Wildlife impact"
      lead="Help document wildlife possibly affected by the nurdle spill. Community reports build a shared picture of impact — without uploading photos to this site."
    >
      <noscript>
        <p className="mb-4 text-meta">
          The interactive map needs JavaScript. You can still read the
          introduction and submit a report once JavaScript is available.
        </p>
      </noscript>
      <WildlifeImpactPanel />
    </PageShell>
  );
}
