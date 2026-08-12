import type { Metadata } from "next";
import { AnnouncementCard } from "@/components/announcement-card";
import { BriefingEventPanel } from "@/components/briefing-event";
import { LatestUpdateCard } from "@/components/latest-update-card";
import { PageShell } from "@/components/page-shell";
import { announcements, briefingEvent, latestUpdate } from "@/data/content";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Community updates, official guidance and practical information about the Port of Tyne nurdle spill.",
};

export default function NewsPage() {
  const [newest, ...rest] = announcements;

  return (
    <PageShell
      title="Updates"
      lead="A chronological feed of community posts, guidance and practical information."
    >
      {newest ? (
        <section className="border-b border-line pb-10">
          <p className="text-eyebrow text-urgent mb-4">Newest</p>
          <AnnouncementCard announcement={newest} featured />
        </section>
      ) : null}

      <div className="divide-y divide-line">
        {rest.map((announcement) => (
          <div key={announcement.id} className="py-8">
            <AnnouncementCard announcement={announcement} />
          </div>
        ))}
      </div>

      <section className="mt-4 border-t border-line pt-10">
        <LatestUpdateCard update={latestUpdate} />
      </section>

      <section className="mt-10 border-t border-line pt-10">
        <BriefingEventPanel event={briefingEvent} />
      </section>
    </PageShell>
  );
}
