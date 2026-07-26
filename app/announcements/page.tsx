import type { Metadata } from "next";
import { AnnouncementCard } from "@/components/announcement-card";
import { LatestUpdateCard } from "@/components/latest-update-card";
import { PageShell } from "@/components/page-shell";
import { announcements, latestUpdate } from "@/data/content";

export const metadata: Metadata = {
  title: "Announcements",
};

export default function AnnouncementsPage() {
  return (
    <PageShell title="Announcements">
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
          />
        ))}
        <LatestUpdateCard update={latestUpdate} />
      </div>
    </PageShell>
  );
}
