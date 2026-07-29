import type { Metadata } from "next";
import { BeachGroupsHubPanel } from "@/components/beach-groups/beach-groups-hub-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Beaches",
  description:
    "Check in at North Tyneside beaches, join WhatsApp groups, request mesh bags, and log clean-ups.",
};

export default function BeachesPage() {
  return (
    <PageShell title="Beaches">
      <BeachGroupsHubPanel />
    </PageShell>
  );
}
