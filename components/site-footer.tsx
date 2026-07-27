export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-lg border-t border-[var(--line)] px-4 py-3 text-xs leading-snug text-[var(--mute)]">
      <p>Community-created information hub for North Tyneside volunteers.</p>
      <p className="mt-2 text-[0.7rem] leading-snug">
        This website is maintained by Amy Ash, a local volunteer. If you spot
        anything that&apos;s out of date or have information to add, please{" "}
        <a
          href="https://amyash.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          get in touch
        </a>
        .
      </p>
    </footer>
  );
}
