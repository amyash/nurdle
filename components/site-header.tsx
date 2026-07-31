import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteDisclaimer } from "@/data/content";
import { openLetter } from "@/data/open-letter";

export function SiteHeader() {
  return (
    <header>
      <div className="bg-ink text-white">
        <div className="mx-auto max-w-lg px-4 pb-4 pt-4">
          <p className="text-eyebrow text-accent-mint">
            North Tyneside · Community volunteers
          </p>
          <Link
            href="/"
            className="mt-1 block whitespace-nowrap text-2xl font-bold leading-tight tracking-tight text-white sm:text-[1.75rem] sm:tracking-normal"
          >
            Nurdle spill — volunteer board
          </Link>

          <p className="mt-2 text-xs leading-snug text-white/70">
            {siteDisclaimer}
          </p>

          <div className="mt-3">
            <Link
              href="/open-letter"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-control bg-accent-mint px-3 py-2.5 text-center text-sm font-bold leading-tight text-ink sm:text-base"
            >
              {openLetter.headerCtaLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4">
        <div className="border-t border-line" aria-hidden="true" />

        <SiteNav />

        <div
          className="mt-5 border-t border-line pt-5"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
