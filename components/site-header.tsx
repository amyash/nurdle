import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export function SiteHeader() {
  return (
    <header className="bg-mark text-white">
      <div className="site-container">
        <div className="flex items-start justify-between gap-4 py-4 sm:items-center sm:py-5">
          <div className="min-w-0">
            <p className="text-eyebrow text-accent">
              North Tyneside · Community response
            </p>
            <Link
              href="/"
              className="mt-1 block text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Nurdle Hub NE
            </Link>
            <p className="mt-1 max-w-sm text-xs leading-snug text-white/70 sm:text-sm">
              Community-run · not an official council or emergency service
            </p>
          </div>

          <SiteNav />
        </div>
      </div>
    </header>
  );
}
