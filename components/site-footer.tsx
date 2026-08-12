import { SiteFooterWhatsappLink } from "@/components/site-footer-whatsapp-link";
import { siteDisclaimer } from "@/data/content";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="site-container py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:gap-12">
          <div className="max-w-xl">
            <p className="text-sm font-bold text-ink">Nurdle Hub NE</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Community-created information hub for volunteers responding to the
              Port of Tyne nurdle spill across the North East coast.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute-soft">
              {siteDisclaimer}
            </p>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-mute">
            <p>
              Maintained by{" "}
              <a
                href="https://amyash.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-ink underline underline-offset-2"
              >
                Amy
              </a>
              , a local volunteer.
            </p>
            <p>
              Spot something out of date? DM on <SiteFooterWhatsappLink />.
            </p>
            <p>
              Collaborate on{" "}
              <a
                href="https://github.com/amyash/nurdle"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-ink underline underline-offset-2"
              >
                GitHub
              </a>
              .
            </p>
            <p>
              Official reporting:{" "}
              <a
                href="https://www.northtyneside.gov.uk/form/plastic-pellets-on-beaches-nurdl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-ink underline underline-offset-2"
              >
                North Tyneside nurdle form
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
