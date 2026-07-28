import type { Metadata } from "next";
import { VolunteerCheckinPanel } from "@/components/check-in/volunteer-checkin-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Volunteer beach check-in",
  description:
    "See roughly where volunteers are currently helping across North Tyneside beaches and check in when you arrive.",
};

export default function VolunteerCheckInPage() {
  return (
    <PageShell title="Where volunteers are cleaning">
      <VolunteerCheckinPanel />
    </PageShell>
  );
}
