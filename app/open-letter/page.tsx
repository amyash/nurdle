import type { Metadata } from "next";
import { OpenLetterPanel } from "@/components/open-letter/open-letter-panel";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "An Open Letter to Matt Beeton",
  description:
    "An open letter to Matt Beeton, Chief Executive of the Port of Tyne, calling for trained volunteers to assist river-source nurdle recovery. Signed by members of the community WhatsApp effort.",
};

export default function OpenLetterPage() {
  return (
    <PageShell>
      <OpenLetterPanel />
    </PageShell>
  );
}
