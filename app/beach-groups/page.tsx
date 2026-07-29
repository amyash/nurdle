import type { Metadata } from "next";
import { BeachGroupsHubPanel } from "@/components/beach-groups/beach-groups-hub-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Beach groups",
  description:
    "Check in at North Tyneside beaches, join WhatsApp groups, and request mesh bags.",
};

export default function BeachGroupsPage() {
  return (
    <PageShell title="Beach groups">
      <BeachGroupsHubPanel />
    </PageShell>
  );
}
