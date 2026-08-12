import { SiteFooterWhatsappLink } from "@/components/site-footer-whatsapp-link";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-lg border-t border-line px-4 py-4 text-xs leading-snug text-mute">
      <p>Community-created information hub for North Tyneside volunteers.</p>
      <p className="mt-2">
        This website is maintained by{" "}
        <a
          href="https://amyash.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mute underline underline-offset-2"
        >
          Amy
        </a>
        , a local volunteer. If you spot anything that&apos;s out of date or
        have information to add, DM me on <SiteFooterWhatsappLink />. To collaborate join my repo on{" "}
        <a
          href="https://github.com/amyash/nurdle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mute underline underline-offset-2"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}
