"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";
import { WhatsAppCommunityAccessButton } from "@/components/whatsapp/whatsapp-gate";

type NavItem =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

const primaryNav: NavItem[] = [
  { href: "/beaches", label: "Beaches" },
  { href: "/rest-of-uk", label: "Rest of UK" },
  { href: "/how-to-clean", label: "How to clean" },
  { href: "/news", label: "Updates" },
  { href: "/wildlife-impact", label: "Wildlife" },
];

const moreNav: NavItem[] = [
  { href: "/photos", label: "Photos" },
  { href: "/in-the-news", label: "In the news" },
  { href: "/open-letter", label: "Open letter" },
  { href: "/press-release", label: "Press release" },
  { href: "/report-nurdles", label: "Report nurdles" },
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

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function NavLink({
  item,
  pathname,
  onNavigate,
  className,
  onDark = false,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
  className?: string;
  onDark?: boolean;
}) {
  const active = !item.external && isActive(pathname, item.href);
  const classes = cn(
    "inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-bold transition-colors",
    onDark
      ? active
        ? "text-accent"
        : "text-white/85 hover:text-white"
      : active
        ? "text-mark"
        : "text-ink hover:text-mark",
    className,
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onNavigate}
      >
        {item.label}
        <ExternalLinkIcon />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={classes}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const menuId = useId();
  const moreId = useId();
  const beachesActive = pathname.startsWith("/beaches");

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && !moreOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, moreOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      {/* Desktop */}
      <nav
        aria-label="Primary"
        className="hidden items-center gap-1 lg:flex"
      >
        <ul className="flex items-center gap-5">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <NavLink item={item} pathname={pathname} onDark />
            </li>
          ))}
          <li className="relative">
            <button
              type="button"
              className={cn(
                "inline-flex min-h-11 items-center gap-1 px-1 text-sm font-bold",
                moreNav.some(
                  (item) => !item.external && isActive(pathname, item.href),
                )
                  ? "text-accent"
                  : "text-white/85 hover:text-white",
              )}
              aria-expanded={moreOpen}
              aria-controls={moreId}
              onClick={() => setMoreOpen((open) => !open)}
            >
              More
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className={cn(
                  "h-3 w-3 transition-transform",
                  moreOpen && "rotate-180",
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
            {moreOpen ? (
              <div
                id={moreId}
                className="absolute left-0 top-full z-40 mt-1 min-w-52 border border-line bg-paper py-2 text-ink"
              >
                <ul>
                  {moreNav.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        item={item}
                        pathname={pathname}
                        onNavigate={() => setMoreOpen(false)}
                        className="w-full px-4 py-2.5"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        </ul>

        <div className="ml-6 flex items-center gap-3">
          <WhatsAppCommunityAccessButton
            ariaLabel="Join WhatsApp (opens in a new tab)"
            className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-white/35 text-white hover:bg-white/10"
          />
        </div>
      </nav>

      {/* Mobile controls */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-white/40 bg-transparent text-white"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            id={menuId}
            className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col border-l border-line bg-board text-ink"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm font-bold text-ink">Menu</p>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-line bg-paper text-ink"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
              <Link
                href="/beaches"
                onClick={closeMenu}
                className="mb-2 inline-flex min-h-12 w-full items-center justify-center rounded-control bg-mark px-4 text-base font-bold text-white"
                aria-current={beachesActive ? "page" : undefined}
              >
                Join a clean
              </Link>

              <ul className="space-y-1">
                <li>
                  <WhatsAppCommunityAccessButton
                    ariaLabel="Join WhatsApp (opens in a new tab)"
                    label="Join WhatsApp"
                    iconPosition="end"
                    iconClassName="h-4 w-4 fill-current text-whatsapp"
                    className="inline-flex min-h-11 w-full items-center justify-start gap-2 border-b border-line px-1 py-3 text-sm font-bold text-ink hover:text-mark"
                    onNavigate={closeMenu}
                  />
                </li>
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      item={item}
                      pathname={pathname}
                      onNavigate={closeMenu}
                      className="w-full border-b border-line py-3"
                    />
                  </li>
                ))}
              </ul>

              <p className="text-eyebrow text-mute mt-8 mb-2">More</p>
              <ul className="space-y-1">
                {moreNav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      item={item}
                      pathname={pathname}
                      onNavigate={closeMenu}
                      className="w-full border-b border-line py-3"
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
