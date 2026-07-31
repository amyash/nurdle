"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { whatsappCommunity } from "@/data/content";

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

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
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
          <a
            href={whatsappCommunity.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join WhatsApp (opens in a new tab)"
            className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-line bg-white text-whatsapp"
          >
            <WhatsAppIcon />
          </a>
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
