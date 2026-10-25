import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Report nurdles",
  description:
    "How to report large quantities of nurdles from the Port of Tyne spill to your local council or the Port of Tyne.",
};

const linkClass =
  "font-medium text-mark underline underline-offset-2 hover:decoration-2";

export default function ReportNurdlesPage() {
  return (
    <PageShell
      title="Report nurdles"
      lead="If you see large numbers of nurdles, or nurdles that you can't access safely to collect, please report them rather than attempting to clear them yourself."
    >
      <div className="reading-measure space-y-10 text-body">
        <p className="text-mute">
          Depending on where you are, there is a different reporting process.
          Check which council covers the area where you found the nurdles, then
          choose from the options below.
        </p>

        {/* Northumberland */}
        <section className="border-t border-line pt-8">
          <h2 className="mb-4 text-section-title">
            Northumberland County Council
          </h2>
          <ul className="space-y-3 text-body text-ink">
            <li>
              Report through the{" "}
              <a
                href="https://nland.cc/fix"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Fix My Street app (nland.cc/fix)
              </a>
              .
            </li>
            <li>
              <a
                href="https://www.northumberland.gov.uk/news/plastic-pellets-nurdles-countys-beaches-updated-august-19th"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Latest guidance from Northumberland County Council
              </a>
            </li>
          </ul>
        </section>

        {/* North Tyneside */}
        <section className="border-t border-line pt-8">
          <h2 className="mb-4 text-section-title">North Tyneside Council</h2>
          <ul className="space-y-3 text-body text-ink">
            <li>
              <a
                href="https://www.northtyneside.gov.uk/form/plastic-pellets-on-beaches-nurdl"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Online reporting form
              </a>
            </li>
            <li>
              <a
                href="https://www.northtyneside.gov.uk/plastic-pellets-beaches-nurdles"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Latest guidance from North Tyneside Council
              </a>
            </li>
          </ul>
        </section>

        {/* River Tyne */}
        <section className="border-t border-line pt-8">
          <h2 className="mb-4 text-section-title">River Tyne</h2>
          <div className="space-y-3 text-body text-ink">
            <p>There is a new number for reporting nurdles in the river.</p>
            <p>
              Vessel Traffic Services (VTS){" "}
              <a href="tel:+441912572080" className={linkClass}>
                0191 257 2080
              </a>
            </p>
            <p>
              From the Port of Tyne, there is a request that any increased
              numbers of sightings in the river be reported{" "}
              <strong>IMMEDIATELY</strong> to Vessel Traffic Services (VTS){" "}
              <a href="tel:+441912572080" className={linkClass}>
                0191 257 2080
              </a>{" "}
              to give them a chance to respond on the day.
            </p>
            <p>
              If there is no answer, please use the former contact details:
            </p>
            <ul className="space-y-3">
              <li>
                Email{" "}
                <a
                  href="mailto:community.reporting@portoftyne.co.uk"
                  className={linkClass}
                >
                  community.reporting@portoftyne.co.uk
                </a>
              </li>
              <li>
                Call{" "}
                <a href="tel:+447483579324" className={linkClass}>
                  07483 579 324
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* South Tyneside */}
        <section className="border-t border-line pt-8">
          <h2 className="mb-4 text-section-title">South Tyneside Council</h2>
          <ul className="space-y-3 text-body text-ink">
            <li>
              Email{" "}
              <a href="mailto:nurdles@southtyneside.gov.uk" className={linkClass}>
                nurdles@southtyneside.gov.uk
              </a>
            </li>
            <li>
              <a
                href="https://www.southtyneside.gov.uk/article/31199/Plastic-pellets-reported-on-South-Tyneside-coastline#sightings"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Latest guidance from South Tyneside Council
              </a>
            </li>
          </ul>
        </section>

        {/* Sunderland */}
        <section className="border-t border-line pt-8">
          <h2 className="mb-4 text-section-title">Sunderland City Council</h2>
          <ul className="space-y-3 text-body text-ink">
            <li>
              <a
                href="https://www.sunderland.gov.uk/article/40726/Plastic-pellets-on-beaches"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Latest guidance from Sunderland City Council, including how to
                report nurdles
              </a>
            </li>
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
