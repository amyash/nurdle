import type { Metadata } from "next";
import { AnnouncementCard } from "@/components/announcement-card";
import { BriefingEventPanel } from "@/components/briefing-event";
import { LatestUpdateCard } from "@/components/latest-update-card";
import { PageShell } from "@/components/page-shell";
import { announcements, briefingEvent, latestUpdate } from "@/data/content";

export const metadata: Metadata = {
  title: "News",
};

export default function NewsPage() {
  return (
    <PageShell title="News">
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
          />
        ))}
        <LatestUpdateCard update={latestUpdate} />
        <BriefingEventPanel event={briefingEvent} />
      </div>
    </PageShell>
  );
}
