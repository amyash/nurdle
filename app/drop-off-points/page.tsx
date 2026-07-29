import type { Metadata } from "next";
import { CollectionPointsPanel } from "@/components/collection-points/collection-points-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Drop-off points",
  description:
    "Official North Tyneside Council drop-off points for bagged nurdles and beach clean-up waste.",
};

export default function DropOffPointsPage() {
  return (
    <PageShell title="Drop-off points">
      <noscript>
        <p className="mb-4 text-sm leading-snug text-[var(--mute)]">
          The interactive map needs JavaScript. The drop-off point list and
          directions links below still work without it.
        </p>
      </noscript>
      <CollectionPointsPanel />
    </PageShell>
  );
}
