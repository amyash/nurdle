import type { Metadata } from "next";
import { CollectionPointsPanel } from "@/components/collection-points/collection-points-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Collection points",
  description:
    "Official North Tyneside Council collection points for bagged nurdles and beach clean-up waste.",
};

export default function CollectionPointsPage() {
  return (
    <PageShell title="Collection points">
      <noscript>
        <p className="mb-4 text-sm leading-snug text-[var(--mute)]">
          The interactive map needs JavaScript. The collection-point list and
          directions links below still work without it.
        </p>
      </noscript>
      <CollectionPointsPanel />
    </PageShell>
  );
}
