import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
import { WhatsAppGateTextLink } from "@/components/whatsapp/content-link";

export const metadata: Metadata = {
  title: "Repairing mesh bags",
  description:
    "How to return, care for, and repair handmade mesh filter bags so they stay in circulation.",
};

const linkClass = "font-bold text-mark underline underline-offset-2";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=St+John%27s+Methodist+Church%2C+Ilfracombe+Gardens%2C+Whitley+Bay+NE26+3ND";

const bagPhotos = [
  {
    src: "/community/mesh-bag-hands.webp",
    alt: "Gloved hands holding a mesh bag filled with seaweed and white nurdles",
  },
  {
    src: "/community/mesh-bag-bucket-shovel.webp",
    alt: "Volunteer lifting a mesh bag from a water-filled bucket beside a shovel",
  },
  {
    src: "/techniques/mesh-bag-wash.webp",
    alt: "Purple mesh bag being washed in shallow seawater",
  },
  {
    src: "/community/volunteers-mesh-group.webp",
    alt: "Volunteers kneeling on the beach sifting sand with mesh bags and bowls",
  },
];

function BeachesLink() {
  return (
    <Link href="/beaches" className={linkClass}>
      Nurdle Hub page
    </Link>
  );
}

function DropboxLink({ children }: { children: string }) {
  return (
    <a href="#whitley-bay-dropbox" className={linkClass}>
      {children}
    </a>
  );
}

export default function RepairingMeshBagsPage() {
  return (
    <PageShell
      narrow
      title="Returning or repairing a mesh filter bag"
      lead={
        <>
          <p>
            This is a bag that&apos;s handmade to be reused. Filter the sand
            and plastic pellets (nurdles), dispose of the pellets
            appropriately, and pass the bag on to the next person.
          </p>
          <p>
            The most useful thing you can do is get it back into circulation
            when you&apos;re done and no longer need it.
          </p>
          <p>
            If you&apos;re unsure, find out how to do that based on where you
            are and what you need below.
          </p>
          <p>
            Caring for bags: the main thing to do is a simple rinse every now
            and again in warm water and dish soap. Some people use Milton.
            Then hang to dry.
          </p>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {bagPhotos.map((photo) => (
          <figure key={photo.src} className="overflow-hidden bg-surface">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={1000}
              className="aspect-[4/5] h-auto w-full object-cover"
            />
          </figure>
        ))}
      </div>
      <p className="mt-3 text-meta">Photos from volunteers.</p>

      <Section id="using-nests" title="Using NESTs">
        <div className="reading-measure space-y-4 text-body text-mute">
          <p>
            A NEST (Nurdle Equipment Station) is a storage box near a beach
            that holds equipment you can borrow and return ready for the next
            person to use. We have set these up in the North East of England
            in response to the Port of Tyne spill. Find your nearest NEST,
            listed by beach, on the <BeachesLink />.
          </p>
          <p>The mesh filter bags live in NESTs between uses.</p>
        </div>
      </Section>

      <Section id="returning" title="Returning a bag you've used">
        <div className="reading-measure space-y-4 text-body text-mute">
          <p>
            Take it back to the NEST you borrowed it from. Rinse it in sea or
            freshwater. That&apos;s all you need to do. The next person will
            use it after you.
          </p>
          <p>
            If you can&apos;t get back to that particular NEST, drop it at any
            NEST, or use the <DropboxLink>Whitley Bay dropbox</DropboxLink>.
            Before you use the dropbox, please wash in warm water with dish
            soap and hang up to dry.
          </p>
        </div>
      </Section>

      <Section id="stray-bag" title="Found a stray bag?">
        <div className="reading-measure space-y-4 text-body text-mute">
          <p>
            If you&apos;ve found a bag without a home, return it to the nearest
            NEST. Find your nearest NEST, listed by beach, on the{" "}
            <BeachesLink />.
          </p>
          <p>
            If you can get to Whitley Bay, you can also use the{" "}
            <DropboxLink>dropbox</DropboxLink>. Please wash your bag in warm
            water and dish soap and hang it up to dry before returning to the
            dropbox.
          </p>
        </div>
      </Section>

      <Section id="repair" title="Your bag needs repair?">
        <div className="reading-measure text-body text-mute">
          <p>
            A torn or worn bag can be mended and put back into use. Don&apos;t
            bin it.
          </p>
          <p className="mt-4 font-bold text-ink">In North East England:</p>
          <ul className="mt-3 list-disc space-y-3 pl-5">
            <li>
              Put the bag in your local NEST with a tag marked &apos;for
              repair&apos;.
            </li>
            <li>
              If you&apos;re in the{" "}
              <WhatsAppGateTextLink
                linkKey="__community__"
                label="WhatsApp community"
              >
                WhatsApp community
              </WhatsAppGateTextLink>
              , post in the &apos;Making mesh bags&apos; group so a repair
              volunteer knows one&apos;s waiting.
            </li>
          </ul>
          <p className="mt-4 font-bold text-ink">
            Everywhere else, or if you can&apos;t reach your NEST:
          </p>
          <ul className="mt-3 list-disc space-y-3 pl-5">
            <li>
              Use any NEST, or the <DropboxLink>Whitley Bay dropbox</DropboxLink>
              .
            </li>
          </ul>
        </div>
      </Section>

      <Section id="whitley-bay-dropbox" title="The Whitley Bay dropbox">
        <div className="reading-measure text-body text-mute">
          <p>The dropbox is a public drop-and-collect point. We use it to:</p>
          <ul className="mt-3 list-disc space-y-3 pl-5">
            <li>Collect bags that need repair.</li>
            <li>Distribute a supply of bags or fabric to be used to make bags.</li>
          </ul>
          <p className="mt-4">
            It&apos;s public on purpose — so nobody has to share a private
            address to hand things over. You&apos;re welcome to return your
            used and no longer needed mesh bag here too.
          </p>
          <p className="mt-4 font-bold text-ink">Where to find it:</p>
          <ul className="mt-3 list-disc space-y-3 pl-5">
            <li>
              St John&apos;s Methodist Church, Ilfracombe Gardens, Whitley Bay
              NE26 3ND (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Google Maps
              </a>
              )
            </li>
            <li>
              Look for the small blue shelter in the paved garden along the
              side of the building, on Balmoral Gardens.
            </li>
            <li>
              what3words:{" "}
              <a
                href="https://what3words.com/hungry.deep.lamp"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                hungry.deep.lamp
              </a>
            </li>
          </ul>
        </div>
      </Section>

      <Section id="about" title="About the bags">
        <div className="reading-measure space-y-4 text-body text-mute">
          <p>
            These mesh filter bags are handmade by volunteers, in response to
            the Port of Tyne nurdle spill on 19 July 2026. They make it far
            quicker to sieve nurdles — the small plastic pellets washed up in
            the spill — out of the sand.
          </p>
          <p>
            In six days, more than 30 home machinists from Durham to Morpeth
            made over 500 bags from donated material, with help from a local
            manufacturer. And we&apos;re still going.
          </p>
          <p>
            The bags are built to last and to be used over and over. Returning
            yours is what keeps that going.
          </p>
          <p>
            If you would like to make your own bag you can do that{" "}
            <Link href="/how-to-clean#mesh-bag-tutorial" className={linkClass}>
              here
            </Link>
            .
          </p>
          <div>
            <p className="font-bold text-ink">With thanks to:</p>
            <ul className="mt-3 list-disc space-y-3 pl-5">
              <li>
                Kayleigh at 1st for Fabrics for making the first bags and
                donating the first bolt of fabric, then providing the mesh at
                cost. Whitley Bay Round Table and a generous 1st for Fabrics
                customer for funding fabric so volunteers weren&apos;t out of
                pocket.
              </li>
              <li>
                Local firms for donating used and new scaffolding and garden
                mesh.
              </li>
              <li>
                Our network of home sewing machinists, and the people who help
                with distribution of fabric and finished bags, driving from
                here to there to get things where they need to be.
              </li>
              <li>
                The local manufacturer, for an hour of time in their factory
                producing 90 bags.
              </li>
            </ul>
            <p className="mt-4">
              To every single one of you who has helped and is still helping —
              thank you.
            </p>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
