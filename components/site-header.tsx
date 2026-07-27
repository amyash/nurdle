import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteDisclaimer, whatsappCommunity } from "@/data/content";

export function SiteHeader() {
  return (
    <header>
      <div className="sticky top-0 z-20 border-b border-[#128C7E] bg-[#25D366] px-4 py-3">
        <a
          href={whatsappCommunity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-center text-base font-bold text-white underline decoration-white/70 underline-offset-2"
        >
          {whatsappCommunity.label}
        </a>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--mark)]">
          North Tyneside · Community volunteers
        </p>
        <Link
          href="/"
          className="mt-1 block text-2xl font-bold leading-tight text-[var(--ink)]"
        >
          Nurdle spill — volunteer board
        </Link>

        <blockquote className="mt-3 border-l-4 border-[var(--tide)] bg-white px-3 py-2 text-sm leading-snug text-[var(--mute)]">
          {siteDisclaimer}
        </blockquote>

        <SiteNav />

        <div className="mt-5 border-t border-[var(--line)] pt-5" aria-hidden="true" />
      </div>
    </header>
  );
}
