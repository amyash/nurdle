"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappCommunity } from "@/data/content";

type NavItem =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

const nav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/how-to-clean", label: "How to clean" },
  { href: "/beaches", label: "Beaches" },
  { href: "/wildlife-impact", label: "Wildlife impact" },
  { href: "/photos", label: "Photos" },
  { href: whatsappCommunity.url, label: "Join WhatsApp", external: true },
  {
    href: "https://www.northtyneside.gov.uk/form/plastic-pellets-on-beaches-nurdl",
    label: "Report nurdles",
    external: true,
  },
  { href: "/press-release", label: "Press release" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Site" className="mt-4 py-2">
      <ul className="flex flex-wrap gap-2 text-sm font-semibold">
        {nav.map((item) => {
          const active =
            !item.external &&
            (item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href));

          const className = `inline-block rounded-md border px-3 py-1.5 ${
            active
              ? "border-[var(--ink)] bg-[var(--ink)] text-white"
              : "border-[var(--line)] bg-white text-[var(--ink)]"
          }`;

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
      </ul>
    </nav>
  );
}
