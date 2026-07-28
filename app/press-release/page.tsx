import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Press release",
  description:
    "Press and media information about the Port of Tyne nurdle spill.",
};

export default function PressReleasePage() {
  return (
    <PageShell title="Press release">
      <p className="text-sm leading-snug text-[var(--mute)]">
        Press release content will be added here shortly.
      </p>
    </PageShell>
  );
}
