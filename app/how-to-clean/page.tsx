import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
import { TideTimesPanel } from "@/components/tide-times-panel";
import { YoutubeEmbed } from "@/components/youtube-embed";
import {
  ContentLinkButton,
  InlineContentLink,
} from "@/components/whatsapp/content-link";
import { Callout } from "@/components/ui/callout";
import { Disclosure } from "@/components/ui/disclosure";
import { Step } from "@/components/ui/step";
import { Technique } from "@/components/ui/technique";
import {
  faqs,
  howToCollect,
  howToCollectIntro,
  ecosystemProtection,
  techniqueGuides,
  trainingVideos,
  soapAndWaterGuidance,
  whatToBring,
  whatToBringIntro,
} from "@/data/content";

export const metadata: Metadata = {
  title: "How to clean",
  description:
    "What to bring, safe collection methods, and practical technique guides for cleaning nurdles.",
};

const videoById = Object.fromEntries(
  trainingVideos.map((video) => [video.id, video]),
);

const guideById = Object.fromEntries(
  techniqueGuides.map((guide) => [guide.id, guide]),
);

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
    <PageShell
      title="How to clean nurdles"
      lead="Practical community guidance for collecting plastic pellets safely and effectively."
    >
      <Callout tone="warning" className="mb-2">
        <p className="text-eyebrow">Important safety / current guidance</p>
        <p className="mt-2 text-body">
          Guidance can change quickly. Check the{" "}
          <a href="/news" className="font-bold underline underline-offset-2">
            latest updates
          </a>{" "}
          before heading to the beach, and avoid treading nurdles deeper into
          the sand.
        </p>
      </Callout>

      <Section id="bring" title="What to bring" showDivider={false}>
        <p className="mb-5 text-body font-bold text-ink">{whatToBringIntro}</p>
        <ul className="grid gap-0 sm:grid-cols-2">
          {whatToBring.map((item, index) => (
            <li
              key={item.id}
              className="flex gap-3 border-t border-line py-3 text-body"
            >
              <span className="text-eyebrow text-mark w-8 shrink-0 pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="collect" title="How to collect" showDivider>
        <p className="mb-2 text-body font-bold text-ink">{howToCollectIntro}</p>
        <p className="mb-8 text-meta">
          From community organiser guidance — methods are also discussed on the
          WhatsApp group.
        </p>
        <ol className="space-y-8">
          {howToCollect.map((step) => (
            <Step key={step.step} number={step.step} title={step.title}>
              <p>
                {typeof step.text === "string" ? (
                  step.text
                ) : (
                  <InlineContentLink segment={step.text} />
                )}
              </p>
              {step.cta ? (
                <p className="mt-3">
                  <ContentLinkButton
                    link={step.cta}
                    variant={
                      "whatsappKey" in step.cta ? "whatsapp" : "primary"
                    }
                  />
                </p>
              ) : null}
            </Step>
          ))}
        </ol>
      </Section>

      <Section
        id="techniques"
        title="Collection methods"
        lead="Reusable techniques with photos and video where available."
        showDivider
      >
        <div>
          {collectContentOrder.map((item) => {
            if (item.kind === "video") {
              const video = videoById[item.id];
              if (!video) return null;
              return (
                <article
                  key={video.id}
                  className="border-t border-line py-8 sm:py-10"
                >
                  <h3 className="text-body font-bold text-ink">{video.title}</h3>
                  {video.sideImage ? (
                    <div className="mt-5 grid grid-cols-[1fr_5.75rem] items-stretch gap-3 sm:grid-cols-[1fr_8rem]">
                      <figure className="min-w-0 overflow-hidden bg-surface">
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
                      className="mt-5 max-w-2xl"
                    />
                  )}
                  {video.tip ? (
                    <figure className="mt-5 max-w-xl overflow-hidden bg-surface">
                      <Image
                        src={video.tip.image.src}
                        alt={video.tip.image.alt}
                        width={800}
                        height={1000}
                        className="h-auto w-full object-cover"
                      />
                      <figcaption className="mt-3 text-body text-mute">
                        {video.tip.text}
                      </figcaption>
                    </figure>
                  ) : null}
                </article>
              );
            }

            const guide = guideById[item.id];
            if (!guide) return null;
            return <Technique key={guide.id} guide={guide} />;
          })}
        </div>
      </Section>

      <Section id="hygiene" title={soapAndWaterGuidance.title} showDivider>
        <div className="reading-measure">
          {soapAndWaterGuidance.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-body text-mute first:mt-0">
              {paragraph}
            </p>
          ))}
          <p className="mt-4 text-body font-bold text-ink">
            {soapAndWaterGuidance.soapIsKing.heading}
          </p>
          <ul className="mt-3 list-disc space-y-3 pl-5 text-body text-mute">
            {soapAndWaterGuidance.soapIsKing.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="ecosystem" title={ecosystemProtection.title} showDivider>
        <div className="reading-measure">
          <h3 className="text-card-title">{ecosystemProtection.subtitle}</h3>
          <p className="mt-3 text-body text-mute">{ecosystemProtection.intro}</p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-body text-mute">
            {ecosystemProtection.guidelines.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="faq" title="FAQs" showDivider>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <Disclosure
              key={item.id}
              summary={item.question}
              summaryClassName="py-4 font-bold text-ink"
              name="how-to-faq"
            >
              <p className="pb-4 reading-measure text-body text-mute">
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
          ))}
        </div>
      </Section>

      <Section id="tides" title="Tide times" showDivider>
        <TideTimesPanel />
      </Section>
    </PageShell>
  );
}
