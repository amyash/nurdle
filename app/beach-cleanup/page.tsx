import type { Metadata } from "next";
import { CommunityCleanupMessagePanel } from "@/components/community-cleanup-message";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
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
  { kind: "video" as const, id: "video-4" },
  { kind: "video" as const, id: "video-3" },
  { kind: "video" as const, id: "video-1" },
  { kind: "guide" as const, id: "bucket-float" },
  { kind: "guide" as const, id: "spade-mesh" },
  { kind: "video" as const, id: "video-2" },
];

export default function BeachCleanupPage() {
  return (
    <PageShell title="Beach cleanup" className="!pb-0">
      <CommunityCleanupMessagePanel message={communityCleanupMessage} />

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
              <span>
                <span className="sr-only">Step {step.step}. </span>
                {step.text}
              </span>
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
                  <YoutubeEmbed url={video.url} title={video.title} />
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
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-base leading-snug">
                  {guide.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
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
