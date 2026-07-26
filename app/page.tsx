import { BriefingEventPanel } from "@/components/briefing-event";
import {
  OrganiserMessagePanel,
  OrganiserNotesCard,
} from "@/components/organiser-message";
import { PageShell } from "@/components/page-shell";
import { briefingEvent, organiserMessage } from "@/data/content";

export default function HomePage() {
  return (
    <PageShell>
      <div className="space-y-4">
        <OrganiserMessagePanel message={organiserMessage} />
        <OrganiserNotesCard notes={organiserMessage.notes} />
        <BriefingEventPanel event={briefingEvent} />
      </div>
    </PageShell>
  );
}
