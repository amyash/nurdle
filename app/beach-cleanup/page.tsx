import type { Metadata } from "next";
import { CommunityCleanupMessagePanel } from "@/components/community-cleanup-message";
import { InstagramEmbed } from "@/components/instagram-embed";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
import { TideTimesPanel } from "@/components/tide-times-panel";
import { YoutubeEmbed } from "@/components/youtube-embed";
import Image from "next/image";
import {
  communityCleanupMessage,
  faqs,
  howToCollect,
  howToCollectIntro,
  photosNote,
  techniqueGuides,
  trainingVideos,
  whatToBring,
  whatToBringIntro,
} from "@/data/content";

export const metadata: Metadata = {
  title: "Beach cleanup",
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
  { kind: "guide" as const, id: "bucket-float" },
  { kind: "guide" as const, id: "spade-mesh" },
  { kind: "video" as const, id: "video-2" },
  { kind: "guide" as const, id: "keep-work-manageable" },
  { kind: "guide" as const, id: "mesh-bag-tutorial" },
];

export default function BeachCleanupPage() {
  return (
    <PageShell title="Beach cleanup" className="!pb-0">
      <CommunityCleanupMessagePanel message={communityCleanupMessage} />
      <TideTimesPanel />

      <Section id="bring" title="What to bring">
        <p className="mb-3 text-base font-bold leading-snug text-[var(--ink)]">
          {whatToBringIntro}
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-base leading-snug">
          {whatToBring.map((item) => (
            <li key={item.id}>{item.item}</li>
          ))}
        </ul>
      </Section>

      <Section id="collect" title="How to collect">
        <p className="mb-3 text-base font-bold leading-snug text-[var(--ink)]">
          {howToCollectIntro}
        </p>
        <p className="mb-3 text-sm text-[var(--mute)]">
          From community organiser guidance — methods are also discussed on the
          WhatsApp group.
        </p>
        <ol className="space-y-2">
          {howToCollect.map((step) => (
            <li key={step.step} className="flex gap-3 text-base leading-snug">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-sm font-bold text-white"
                aria-hidden="true"
              >
                {step.step}
              </span>
              <div className="min-w-0">
                <span className="sr-only">Step {step.step}. </span>
                {step.title ? (
                  <p className="font-bold text-[var(--ink)]">{step.title}</p>
                ) : null}
                <p className={step.title ? "mt-1" : undefined}>
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
                        className="font-bold text-[var(--mark)] underline underline-offset-2"
                      >
                        {step.text.linkLabel}
                      </a>
                      {step.text.afterLink}
                    </>
                  )}
                </p>
                {step.cta ? (
                  <a
                    href={step.cta.href}
                    {...(step.cta.href.startsWith("http")
                      ? {
                          target: "_blank" as const,
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="mt-2 inline-flex rounded-md bg-[var(--mark)] px-3 py-2 text-sm font-bold text-white"
                  >
                    {step.cta.label}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <ul className="mt-4 space-y-4">
          {collectContentOrder.map((item) => {
            if (item.kind === "video") {
              const video = videoById[item.id];
              if (!video) return null;
              return (
                <li
                  key={video.id}
                  className="rounded-lg border border-[var(--line)] bg-white p-3"
                >
                  <p className="font-bold">{video.title}</p>
                  {video.sideImage ? (
                    <div className="mt-2 grid grid-cols-[1fr_5.75rem] items-stretch gap-2 sm:grid-cols-[1fr_7rem]">
                      <figure className="min-w-0 overflow-hidden rounded-lg">
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
                    <figure className="mt-3 overflow-hidden rounded-lg">
                      <Image
                        src={video.tip.image.src}
                        alt={video.tip.image.alt}
                        width={800}
                        height={1000}
                        className="h-auto w-full object-cover"
                      />
                      <figcaption className="mt-2 text-sm leading-snug text-[var(--ink)]">
                        {video.tip.text}
                      </figcaption>
                    </figure>
                  )}
                </li>
              );
            }

            const guide = guideById[item.id];
            if (!guide) return null;
            return (
              <li
                key={guide.id}
                className="rounded-lg border border-[var(--line)] bg-white p-3"
              >
                <p className="font-bold">{guide.title}</p>
                {guide.description ? (
                  <p className="mt-2 text-base leading-snug">{guide.description}</p>
                ) : null}
                {guide.steps.length > 0 && (
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-base leading-snug">
                    {guide.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
                {guide.cta ? (
                  <a
                    href={guide.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#25D366] px-3 py-2.5 text-center text-sm font-bold text-white"
                  >
                    {guide.cta.label}
                  </a>
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
                        className="overflow-hidden rounded-lg"
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
                {guide.videos && guide.videos.length > 0 && (
                  <div
                    className={`mt-3 grid gap-2 ${
                      guide.videos.length === 3
                        ? "grid-cols-3"
                        : guide.videos.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-1"
                    }`}
                  >
                    {guide.videos.map((video) => (
                      <YoutubeEmbed
                        key={video.url}
                        url={video.url}
                        title={video.title}
                        aspect="short"
                        className="mt-0 w-full"
                      />
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      <aside
        className="rounded-lg border border-[var(--ink)] bg-white px-3 py-3 text-sm leading-snug text-[var(--ink)]"
        role="note"
      >
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--mute)]">
          Photos needed
        </p>
        <p className="mt-1">
          {photosNote.beforeLink}
          <a
            href={photosNote.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[var(--tide)] underline underline-offset-2"
          >
            {photosNote.linkLabel}
          </a>
          {photosNote.afterLink}
        </p>
        <p className="mt-2">
          {photosNote.nurdleHunt.beforeLink}
          <a
            href={photosNote.nurdleHunt.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[var(--tide)] underline underline-offset-2"
          >
            {photosNote.nurdleHunt.linkLabel}
          </a>
        </p>
      </aside>

      <div className="mt-6 border-t border-[var(--line)] pb-8" aria-hidden="true" />

      <section id="faq" className="scroll-mt-16">
        <h2 className="text-lg font-bold uppercase tracking-wide text-[var(--ink)]">
          FAQs
        </h2>
        <div className="mt-3 space-y-2">
          {faqs.map((item) => (
            <details
              key={item.id}
              className="rounded-lg border border-[var(--line)] bg-white px-3 py-2"
            >
              <summary className="cursor-pointer font-bold">
                {item.question}
              </summary>
              <p className="mt-2 pb-1 text-sm leading-snug text-[var(--mute)]">
                {item.highlight && item.answer.includes(item.highlight) ? (
                  <>
                    {item.answer.split(item.highlight)[0]}
                    <strong className="font-bold text-[var(--ink)]">
                      {item.highlight}
                    </strong>
                    {item.answer.split(item.highlight)[1]}
                  </>
                ) : (
                  item.answer
                )}
              </p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
