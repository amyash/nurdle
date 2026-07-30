import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteDisclaimer } from "@/data/content";

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

          <p className="mt-2 text-[10px] leading-tight text-white/70">
            {siteDisclaimer}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4">
        <div className="border-t border-[var(--line)]" aria-hidden="true" />

        <SiteNav />

        <div
          className="mt-5 border-t border-[var(--line)] pt-5"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
