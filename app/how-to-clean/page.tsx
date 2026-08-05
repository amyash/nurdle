import type { Metadata } from "next";
import { InstagramEmbed } from "@/components/instagram-embed";
import { GuideVideoAccordion } from "@/components/guide-video-accordion";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
import { TideTimesPanel } from "@/components/tide-times-panel";
import { YoutubeEmbed } from "@/components/youtube-embed";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";
import { Disclosure } from "@/components/ui/disclosure";
import { Step } from "@/components/ui/step";
import Image from "next/image";
import {
  faqs,
  howToCollect,
  howToCollectIntro,
  ecosystemProtection,
  techniqueGuides,
  trainingVideos,
  whatToBring,
  whatToBringIntro,
} from "@/data/content";

export const metadata: Metadata = {
  title: "How to clean",
};

const videoById = Object.fromEntries(
  trainingVideos.map((video) => [video.id, video]),
);

const guideById = Object.fromEntries(
  techniqueGuides.map((guide) => [guide.id, guide]),
);

/** Display order under How to collect bullets. */
const collectContentOrder = [
  { kind: "guide" as const, id: "scrape-wet" },
  { kind: "guide" as const, id: "spade-mesh" },
  { kind: "guide" as const, id: "bucket-float" },
  { kind: "video" as const, id: "video-2" },
  { kind: "guide" as const, id: "keep-work-manageable" },
  { kind: "guide" as const, id: "mesh-bag-tutorial" },
  { kind: "guide" as const, id: "removing-nurdles-from-seaweed" },
];

export default function HowToCleanPage() {
  return (
    <PageShell className="!pb-0">
      <Section id="bring" title="What to bring" showDivider={false}>
        <p className="mb-3 text-body font-bold">{whatToBringIntro}</p>
        <ul className="list-disc space-y-1.5 pl-5 text-body">
          {whatToBring.map((item) => (
            <li key={item.id}>{item.item}</li>
          ))}
        </ul>

        <Callout tone="mark" className="mt-6 space-y-3">
          <h3 className="text-card-title">{ecosystemProtection.title}</h3>
          {ecosystemProtection.blocks.map((block) => (
            <div key={block.heading}>
              <p className="text-body font-bold">{block.heading}</p>
              <p className="mt-1 text-body">{block.text}</p>
            </div>
          ))}
        </Callout>
      </Section>

      <Section id="collect" title="How to collect">
        <p className="mb-3 text-body font-bold">{howToCollectIntro}</p>
        <p className="mb-3 text-meta">
          From community organiser guidance — methods are also discussed on the
          WhatsApp group.
        </p>
        <ol className="space-y-4">
          {howToCollect.map((step) => (
            <Step key={step.step} number={step.step} title={step.title}>
              <p>
                {typeof step.text === "string" ? (
                  step.text
                ) : (
                  <>
                    {step.text.beforeLink}
                    <a
                      href={step.text.href}
                      {...(step.text.href.startsWith("http")
                        ? {
                            target: "_blank" as const,
                            rel: "noopener noreferrer",
                          }
                        : {})}
                      className="font-bold text-mark underline underline-offset-2"
                    >
                      {step.text.linkLabel}
                    </a>
                    {step.text.afterLink}
                  </>
                )}
              </p>
              {step.cta ? (
                <p className="mt-2">
                  <ButtonLink
                    href={step.cta.href}
                    variant="primary"
                    external={step.cta.href.startsWith("http")}
                  >
                    {step.cta.label}
                  </ButtonLink>
                </p>
              ) : null}
            </Step>
          ))}
        </ol>

        <ul className="mt-4 space-y-4">
          {collectContentOrder.map((item) => {
            if (item.kind === "video") {
              const video = videoById[item.id];
              if (!video) return null;
              return (
                <li key={video.id}>
                  <Card padding="sm">
                    <p className="text-card-title">{video.title}</p>
                    {video.sideImage ? (
                      <div className="mt-2 grid grid-cols-[1fr_5.75rem] items-stretch gap-2 sm:grid-cols-[1fr_7rem]">
                        <figure className="min-w-0 overflow-hidden rounded-card">
                          <Image
                            src={video.sideImage.src}
                            alt={video.sideImage.alt}
                            width={800}
                            height={1000}
                            className="h-full max-h-[22rem] w-full object-cover"
                          />
                        </figure>
                        <YoutubeEmbed
                          url={video.url}
                          title={video.title}
                          aspect="short"
                          className="mt-0 h-full max-h-[22rem] w-full"
                        />
                      </div>
                    ) : (
                      <YoutubeEmbed
                        url={video.url}
                        title={video.title}
                        className="mt-2"
                      />
                    )}
                    {video.tip && (
                      <figure className="mt-3 overflow-hidden rounded-card">
                        <Image
                          src={video.tip.image.src}
                          alt={video.tip.image.alt}
                          width={800}
                          height={1000}
                          className="h-auto w-full object-cover"
                        />
                        <figcaption className="mt-2 text-body">
                          {video.tip.text}
                        </figcaption>
                      </figure>
                    )}
                  </Card>
                </li>
              );
            }

            const guide = guideById[item.id];
            if (!guide) return null;
            return (
              <li key={guide.id}>
                <Card padding="sm">
                  <p className="text-card-title">{guide.title}</p>
                  {guide.description ? (
                    <p className="mt-2 text-body">{guide.description}</p>
                  ) : null}
                  {guide.steps.length > 0 && (
                    <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-body">
                      {guide.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  )}
                  {guide.notes && guide.notes.length > 0 ? (
                    <div className="mt-3 space-y-2 text-body">
                      {guide.notes.map((note) => (
                        <p key={note}>{note}</p>
                      ))}
                    </div>
                  ) : null}
                  {guide.cta ? (
                    <ButtonLink
                      href={guide.cta.href}
                      variant="whatsapp"
                      fullWidth
                      external
                      className="mt-3"
                    >
                      {guide.cta.label}
                    </ButtonLink>
                  ) : null}
                  {guide.instagramUrl ? (
                    <InstagramEmbed
                      url={guide.instagramUrl}
                      title={guide.title}
                      className="mt-3"
                    />
                  ) : null}
                  {guide.images && guide.images.length > 0 && (
                    <div
                      className={`mt-3 grid gap-3 ${
                        guide.images.length > 1 ? "sm:grid-cols-2" : ""
                      }`}
                    >
                      {guide.images.map((image) => (
                        <figure
                          key={image.src}
                          className="overflow-hidden rounded-card"
                        >
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
                  )}
                  {guide.videos && guide.videos.length > 0 ? (
                    <GuideVideoAccordion videos={guide.videos} />
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      <div className="mt-6 border-t border-line pb-8" aria-hidden="true" />

      <section id="faq" className="scroll-mt-16">
        <h2 className="text-section">FAQs</h2>
        <div className="mt-3 space-y-2">
          {faqs.map((item) => (
            <Card key={item.id} padding="sm">
              <Disclosure
                summary={item.question}
                summaryClassName="font-bold text-ink"
              >
                <p className="text-meta">
                  {item.highlight && item.answer.includes(item.highlight) ? (
                    <>
                      {item.answer.split(item.highlight)[0]}
                      <strong className="font-bold text-ink">
                        {item.highlight}
                      </strong>
                      {item.answer.split(item.highlight)[1]}
                    </>
                  ) : (
                    item.answer
                  )}
                </p>
              </Disclosure>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-6 border-t border-line pt-6 pb-8">
        <TideTimesPanel />
      </div>
    </PageShell>
  );
}
