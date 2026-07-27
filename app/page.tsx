import {
  OrganiserMessagePanel,
} from "@/components/organiser-message";
import { PageShell } from "@/components/page-shell";
import { organiserMessage } from "@/data/content";

export default function HomePage() {
  return (
    <PageShell>
      <div className="space-y-4">
        <OrganiserMessagePanel message={organiserMessage} />
      </div>
    </PageShell>
  );
}
