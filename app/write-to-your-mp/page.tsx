import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SharePageLink } from "@/components/write-to-mp/share-page-link";
import { WriteToMpPanel } from "@/components/write-to-mp/write-to-mp-panel";

const title = "Ask your MP to sign";
const description =
  "Find your MP by postcode and send a letter asking them to back a government-funded clean-up of the Port of Tyne nurdle spill.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/write-to-your-mp" },
  openGraph: {
    title,
    description,
    url: "/write-to-your-mp",
    siteName: "Nurdle Hub NE",
    type: "website",
    images: [
      {
        url: "/nurdles-on-beach.webp",
        width: 976,
        height: 549,
        alt: "Thousands of small white plastic pellets scattered across beach sand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/nurdles-on-beach.webp"],
  },
};

export default function WriteToYourMpPage() {
  return (
    <PageShell
      title={title}
      lead="Professional clean-up is being scaled back while nurdles remain on the coast. Find your MP from your postcode and send a letter asking them to back a government-funded clean-up."
    >
      <SharePageLink />
      <WriteToMpPanel liveLetter />
    </PageShell>
  );
}
