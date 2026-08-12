"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { WhatsAppCommunityAccessButton } from "@/components/whatsapp/whatsapp-gate";

type NavItem =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

const nav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/how-to-clean", label: "How to clean" },
  { href: "/wildlife-impact", label: "Wildlife impact" },
  { href: "/photos", label: "Photos" },
  {
    href: "https://www.northtyneside.gov.uk/form/plastic-pellets-on-beaches-nurdl",
    label: "Report nurdles",
    external: true,
  },
  { href: "/press-release", label: "Press release" },
];

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5H3.5A1 1 0 0 0 2.5 4.5v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" />
      <path d="M9.5 2.5h4v4" />
      <path d="M7.5 8.5 13.5 2.5" />
    </svg>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const beachesActive = pathname.startsWith("/beaches");

  return (
    <nav aria-label="Site" className="mt-4 py-2">
      <ul className="flex flex-wrap items-center gap-2 text-sm font-bold">
        {nav.map((item) => {
          const active =
            !item.external &&
            (item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href));

          const className = cn(
            "inline-flex min-h-9 items-center gap-1.5 rounded-control border px-3 py-1.5",
            active
              ? "border-ink bg-ink text-white"
              : "border-line bg-white text-ink",
          );

          return (
            <li key={item.href + item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {item.label}
                  <ExternalLinkIcon />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
        <li>
          <WhatsAppCommunityAccessButton
            ariaLabel="Join WhatsApp (opens in a new tab)"
            className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line bg-white text-whatsapp"
          />
        </li>
      </ul>

      <Link
        href="/beaches"
        className={cn(
          "mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-control bg-mark px-3 py-2.5 text-center text-sm font-bold text-white sm:text-base",
        )}
        aria-current={beachesActive ? "page" : undefined}
      >
        Join a beach clean
      </Link>
    </nav>
  );
}
