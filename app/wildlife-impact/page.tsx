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
    <PageShell title="Wildlife impact">
      <noscript>
        <p className="mb-4 text-sm leading-snug text-[var(--mute)]">
          The interactive map needs JavaScript. You can still read the
          introduction and submit a report once JavaScript is available.
        </p>
      </noscript>
      <WildlifeImpactPanel />
    </PageShell>
  );
}
