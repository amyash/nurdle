"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/how-to-clean", label: "How to clean" },
  { href: "/beaches", label: "Beaches" },
  { href: "/drop-off-points", label: "Drop-off points" },
  { href: "/photos", label: "Photos" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Site" className="mt-4 py-2">
      <ul className="flex flex-wrap gap-2 text-sm font-semibold">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`inline-block rounded-md border px-3 py-1.5 ${
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                    : "border-[var(--line)] bg-white text-[var(--ink)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
