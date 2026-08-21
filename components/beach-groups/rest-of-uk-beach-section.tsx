"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ContentLinkButton } from "@/components/whatsapp/content-link";
import { restOfUk } from "@/data/content";

/** Visually separate from North / South Tyneside beach lists. */
export function RestOfUkBeachSection() {
  const teaser = restOfUk.beachesTeaser;

  return (
    <section
      aria-labelledby="region-rest-of-uk"
      className="rounded-soft border border-dashed border-line-strong bg-surface-quiet px-4 py-6 sm:px-5"
    >
      <p className="text-eyebrow text-mute">{teaser.eyebrow}</p>
      <h2 id="region-rest-of-uk" className="mt-2 text-section">
        {teaser.title}
      </h2>
      <p className="mt-3 max-w-measure text-body text-mute">{teaser.body}</p>
      <ul className="mt-5 flex max-w-sm flex-col gap-2">
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
      <p className="mt-4">
        <Link
          href={teaser.href}
          className="text-sm font-bold text-mark underline underline-offset-2"
        >
          {teaser.pageLabel}
        </Link>
      </p>
    </section>
  );
}
