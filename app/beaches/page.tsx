import type { Metadata } from "next";
import { BeachGroupsHubPanel } from "@/components/beach-groups/beach-groups-hub-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Beaches",
  description:
    "Find where volunteers are cleaning, equipment locations and collection points across North and South Tyneside.",
};

export default function BeachesPage() {
  return (
    <PageShell
      title="Beaches"
      lead="Find where volunteers are cleaning, equipment locations and collection points."
    >
      <BeachGroupsHubPanel />
    </PageShell>
  );
}
