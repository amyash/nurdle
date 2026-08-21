import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { ContentLinkButton } from "@/components/whatsapp/content-link";
import { restOfUk } from "@/data/content";

export const metadata: Metadata = {
  title: "Rest of UK",
  description:
    "Finding nurdles outside North and South Tyneside? Record them with the Great Nurdle Hunt, or join an initial Rest of UK WhatsApp group.",
};

export default function RestOfUkPage() {
  return (
    <PageShell title={restOfUk.title} lead={restOfUk.lead} narrow>
      <div className="reading-measure space-y-4 text-body text-mute">
        {restOfUk.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <ul className="mt-8 flex max-w-sm flex-col gap-2">
        <li>
          <ContentLinkButton link={restOfUk.whatsapp} fullWidth />
        </li>
        <li>
          <ButtonLink
            href={restOfUk.nurdleHunt.href}
            variant="secondary"
            fullWidth
            external
          >
            {restOfUk.nurdleHunt.label}
          </ButtonLink>
        </li>
      </ul>

      <p className="mt-10 text-meta">
        Cleaning on Tyneside?{" "}
        <Link
          href="/beaches"
          className="font-bold text-mark underline underline-offset-2"
        >
          Find a North or South Tyneside beach clean
        </Link>
        .
      </p>
    </PageShell>
  );
}
