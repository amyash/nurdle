import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Open letter",
  description:
    "Open letter signing is temporarily paused while we review how signature data is handled.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OpenLetterPage() {
  return (
    <PageShell title="Open letter">
      <div className="space-y-4">
        <p className="text-base leading-snug text-[var(--ink)]">
          Signing is temporarily paused while we review how signature data is
          handled.
        </p>
        <p className="text-sm leading-snug text-[var(--mute)]">
          Thanks for your patience — this page will return once we’re confident
          the process protects people’s privacy.
        </p>
      </div>
    </PageShell>
  );
}
