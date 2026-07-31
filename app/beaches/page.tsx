import type { Metadata } from "next";
import { BeachGroupsHubPanel } from "@/components/beach-groups/beach-groups-hub-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Beach cleans",
  description:
    "Check in at North Tyneside beaches, join WhatsApp groups, log clean-ups, and record organising time.",
};

export default function BeachesPage() {
  return (
    <PageShell title="Beach cleans">
      <BeachGroupsHubPanel />
    </PageShell>
  );
}
