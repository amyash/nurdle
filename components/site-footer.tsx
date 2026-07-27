export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-lg border-t border-[var(--line)] px-4 py-3 text-xs leading-snug text-[var(--mute)]">
      <p>Community-created information hub for North Tyneside volunteers.</p>
      <p className="mt-2">
        This website is maintained by{" "}
        <a
          href="https://amyash.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Amy
        </a>
        , a local volunteer. If you spot anything that&apos;s out of date or
        have information to add, DM me on{" "}
        <a
          href="https://wa.me/447745720319"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          WhatsApp
        </a>
        . To collaborate join my repo on{" "}
        <a
          href="https://github.com/amyash/nurdle"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}
