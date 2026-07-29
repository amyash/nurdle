import { HomepageCleanupCallout } from "@/components/cleanup-logs/homepage-cleanup-callout";
import {
  OrganiserMessagePanel,
} from "@/components/organiser-message";
import { PageShell } from "@/components/page-shell";
import { organiserMessage } from "@/data/content";

export default function HomePage() {
  return (
    <PageShell>
      <div className="space-y-4">
        <HomepageCleanupCallout />
        <div className="border-t border-[var(--line)]" aria-hidden="true" />
        <OrganiserMessagePanel message={organiserMessage} />
      </div>
    </PageShell>
  );
}
