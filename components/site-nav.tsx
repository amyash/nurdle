"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/announcements", label: "Announcements" },
  { href: "/beach-cleanup", label: "Beach cleanup" },
  { href: "/beach-groups", label: "Beach groups" },
  { href: "/collection-points", label: "Collection points" },
  { href: "/volunteer-check-in", label: "Volunteer check-in" },
  { href: "/community-images", label: "Community images" },
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
