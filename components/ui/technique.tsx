import type { ReactNode } from "react";
import Image from "next/image";
import { InstagramEmbed } from "@/components/instagram-embed";
import { GuideVideoAccordion } from "@/components/guide-video-accordion";
import { ContentLinkButton } from "@/components/whatsapp/content-link";
import type { TechniqueGuide } from "@/types";

/** Typography-led technique block — image + steps, not a decorative card. */
export function Technique({
  guide,
  children,
}: {
  guide: TechniqueGuide;
  children?: ReactNode;
}) {
  return (
    <article className="border-t border-line py-8 sm:py-10">
      <h3 className="text-body font-bold text-ink">{guide.title}</h3>
      {guide.description ? (
        <p className="mt-3 reading-measure text-body text-mute">
          {guide.description}
        </p>
      ) : null}

      {guide.steps.length > 0 ? (
        <ol className="mt-5 max-w-measure list-decimal space-y-2 pl-5 text-body text-mute">
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}

      {guide.notes && guide.notes.length > 0 ? (
        <div className="mt-4 max-w-measure space-y-2 text-body text-mute">
          {guide.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      ) : null}

      {guide.cta ? (
        <ContentLinkButton
          link={guide.cta}
          variant="whatsapp"
          className="mt-5"
        />
      ) : null}

      {guide.instagramUrl ? (
        <InstagramEmbed
          url={guide.instagramUrl}
          title={guide.title}
          className="mt-5"
        />
      ) : null}

      {guide.images && guide.images.length > 0 ? (
        <div
          className={`mt-6 grid gap-4 ${
            guide.images.length > 1 ? "sm:grid-cols-2" : "max-w-xl"
          }`}
        >
          {guide.images.map((image) => (
            <figure key={image.src} className="overflow-hidden bg-surface">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={1000}
                className="h-auto w-full object-cover"
              />
            </figure>
          ))}
        </div>
      ) : null}

      {guide.videos && guide.videos.length > 0 ? (
        <GuideVideoAccordion videos={guide.videos} />
      ) : null}

      {children}
    </article>
  );
}
