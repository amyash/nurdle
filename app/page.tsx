import { BriefingEventPanel } from "@/components/briefing-event";
import { OrganiserMessagePanel } from "@/components/organiser-message";
import { Section } from "@/components/section";
import {
  beachesNeedingHelp,
  briefingEvent,
  faqs,
  howToCollect,
  howToCollectIntro,
  latestUpdate,
  organiserMessage,
  photosNote,
  siteDisclaimer,
  trainingVideos,
  whatsappCommunity,
  whatToBring,
} from "@/data/content";
import { formatWhen } from "@/lib/dates";

const nav = [
  { href: "#organiser", label: "Message" },
  { href: "#latest", label: "Update" },
  { href: "#bring", label: "Bring" },
  { href: "#collect", label: "Collect" },
  { href: "#photos", label: "Photos" },
  { href: "#videos", label: "Techniques" },
  { href: "#beaches", label: "Beaches" },
  { href: "#faq", label: "FAQ" },
  { href: "#briefing", label: "Briefing" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-lg px-4 pb-10">
      <a
        href="#organiser"
        className="sr-only focus:not-sr-only focus:mb-3 focus:inline-block focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-[var(--mark)]"
      >
        Skip to organiser message
      </a>

      <div className="sticky top-0 z-20 -mx-4 border-b border-[#128C7E] bg-[#25D366] px-4 py-3">
        <a
          href={whatsappCommunity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-center text-base font-bold text-white underline decoration-white/70 underline-offset-2"
        >
          {whatsappCommunity.label}
        </a>
      </div>

      <header className="pb-3 pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--mark)]">
          North Tyneside · Community volunteers
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">
          Nurdle spill — volunteer board
        </h1>
      </header>

      <nav
        aria-label="Jump to section"
        className="sticky top-[3.25rem] z-10 -mx-4 border-y border-[var(--line)] bg-[var(--board)]/95 px-4 py-2 backdrop-blur"
      >
        <ul className="flex gap-1 overflow-x-auto text-sm font-semibold">
          {nav.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                className="inline-block rounded-md border border-[var(--line)] bg-white px-2.5 py-1.5 text-[var(--ink)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4 space-y-4">
        <OrganiserMessagePanel message={organiserMessage} />

        <section
          id="latest"
          className="scroll-mt-20 rounded-lg border-2 border-[var(--alert-ink)] bg-[var(--alert)] p-4"
          aria-labelledby="latest-heading"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="latest-heading"
              className="text-sm font-bold uppercase tracking-wide text-[var(--alert-ink)]"
            >
              Latest update
            </h2>
            <p className="text-sm font-bold text-[var(--alert-ink)]">
              <time dateTime={latestUpdate.datetime}>
                {formatWhen(latestUpdate.datetime)}
              </time>
            </p>
          </div>
          <p className="mt-2 text-base font-medium leading-snug text-[var(--alert-ink)]">
            {latestUpdate.summary}
          </p>

          <p className="mt-4 text-base font-bold text-[var(--alert-ink)]">
            {latestUpdate.window}
          </p>
          <div className="mt-2 space-y-2 text-sm leading-snug text-[var(--alert-ink)]">
            {latestUpdate.whyThisWeek.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-4 text-base font-bold leading-snug text-[var(--alert-ink)]">
            {latestUpdate.callToAction}
          </p>

          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[var(--alert-ink)]">
            Important — method to focus on
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-[var(--alert-ink)]">
            {latestUpdate.focusMethod}
          </p>

          <p className="mt-4 border-t border-[var(--alert-ink)]/30 pt-3 text-sm font-medium leading-snug text-[var(--alert-ink)]">
            {latestUpdate.closing}
          </p>
        </section>
      </div>

      <Section id="bring" title="What to bring">
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
      </Section>

      <aside
        id="photos"
        className="mt-6 scroll-mt-20 rounded-lg border border-[var(--ink)] bg-white px-3 py-3 text-sm leading-snug text-[var(--ink)]"
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

      <Section id="videos" title="Collection techniques">
        <ul className="space-y-2">
          {trainingVideos.map((video, index) => (
            <li
              key={video.id}
              className="rounded-lg border border-[var(--line)] bg-white p-3"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--mute)]">
                Video {index + 1} · {video.duration}
              </p>
              <p className="mt-1 font-bold">{video.title}</p>
              {video.url ? (
                <a
                  href={video.url}
                  className="mt-2 inline-block text-sm font-bold text-[var(--mark)] underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch video
                </a>
              ) : (
                <p className="mt-2 text-sm italic text-[var(--mute)]">
                  {video.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="beaches" title="Beaches needing help">
        <p className="mb-3 text-sm text-[var(--mute)]">
          Join the beach group when a link is listed. More links will be added
          as they are confirmed.
        </p>
        <ul className="divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
          {beachesNeedingHelp.map((beach) => (
            <li key={beach.id} className="px-3 py-3">
              <p className="font-bold">{beach.name}</p>
              <p className="text-sm text-[var(--mute)]">{beach.need}</p>
              <p className="mt-0.5 text-sm text-[var(--mute)]">
                Next window:{" "}
                {beach.nextWindow ?? (
                  <span className="italic">Not yet confirmed</span>
                )}
              </p>
              {beach.whatsappUrl ? (
                <a
                  href={beach.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex rounded-md bg-[#25D366] px-3 py-2 text-sm font-bold text-white"
                >
                  Join {beach.name} WhatsApp
                </a>
              ) : (
                <p className="mt-2 text-sm italic text-[var(--mute)]">
                  Beach WhatsApp link not yet added, ask for invite in General
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" title="FAQs">
        <div className="space-y-2">
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
      </Section>

      <div className="mt-8">
        <BriefingEventPanel event={briefingEvent} />
      </div>

      <footer className="mt-8 border-t border-[var(--line)] pt-4 text-sm leading-snug text-[var(--mute)]">
        <p>{siteDisclaimer}</p>
        <p className="mt-2">
          Edit content in{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs text-[var(--ink)]">
            data/content.ts
          </code>
          .
        </p>
      </footer>
    </div>
  );
}
