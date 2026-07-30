import type { Metadata } from "next";
import { OpenLetterPanel } from "@/components/open-letter/open-letter-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Open letter",
  description:
    "Open letter calling on the Port of Tyne to allow qualified marine operators to assist river-source nurdle recovery. Sign with your name and address.",
};

export default function OpenLetterPage() {
  return (
    <PageShell title="Open letter">
      <noscript>
        <p className="mb-4 text-sm leading-snug text-[var(--mute)]">
          Signing needs JavaScript. You can still read the letter, then sign
          once JavaScript is available.
        </p>
      </noscript>
      <OpenLetterPanel />
    </PageShell>
  );
}
