import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteDisclaimer, whatsappCommunity } from "@/data/content";

export function SiteHeader() {
  return (
    <header>
      <div className="bg-[#111827] text-white">
        <div className="mx-auto max-w-lg px-4 pb-4 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#5eead4]">
            North Tyneside · Community volunteers
          </p>
          <Link
            href="/"
            className="mt-1 block whitespace-nowrap text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl sm:tracking-normal"
          >
            Nurdle spill — volunteer board
          </Link>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <a
              href={whatsappCommunity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#5eead4] px-1.5 py-2 text-center text-[11px] font-bold leading-tight text-[#111827] sm:text-sm"
            >
              Join WhatsApp
            </a>
            <a
              href="https://www.northtyneside.gov.uk/form/plastic-pellets-on-beaches-nurdl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#5eead4] px-1.5 py-2 text-center text-[11px] font-bold leading-tight text-[#111827] sm:text-sm"
            >
              Report nurdles
            </a>
            <Link
              href="/press-release"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#5eead4] px-1.5 py-2 text-center text-[11px] font-bold leading-tight text-[#111827] sm:text-sm"
            >
              Press release
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4">
        <div className="border-t border-[var(--line)]" aria-hidden="true" />

        <SiteNav />

        <p className="mt-3 text-[10px] leading-tight text-[var(--mute)]">
          {siteDisclaimer}
        </p>

        <div
          className="mt-4 border-t border-[var(--line)] pt-5"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
