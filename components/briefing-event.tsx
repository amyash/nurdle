import type { BriefingEvent } from "@/types";

export function BriefingEventPanel({ event }: { event: BriefingEvent }) {
  return (
    <details
      id="briefing"
      className="scroll-mt-20 group rounded-lg border-2 border-[var(--ink)] bg-white open:shadow-sm"
    >
      <summary className="cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-start justify-between gap-3">
          <span>
            <span className="block text-xs font-bold uppercase tracking-wide text-[var(--mute)]">
              Upcoming event · tap to expand
            </span>
            <span className="mt-1 block text-lg font-bold leading-snug text-[var(--ink)]">
              {event.title}
            </span>
            <span className="mt-1 block text-sm leading-snug text-[var(--mute)]">
              {event.summary}
            </span>
          </span>
          <span
            className="mt-1 shrink-0 text-xl font-bold text-[var(--tide)] transition group-open:rotate-45"
            aria-hidden="true"
          >
            +
          </span>
        </span>
      </summary>

      <div className="space-y-4 border-t border-[var(--line)] px-4 py-4 text-sm leading-snug text-[var(--ink)]">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-md bg-[var(--ink)] px-3 py-2.5 text-center text-sm font-bold text-white"
        >
          Sign up on Eventbrite
        </a>

        <div>
          <p className="font-bold">What this is</p>
          <ul className="mt-1 list-disc space-y-1.5 pl-5">
            {event.whatThisIs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-bold">What this is not</p>
          <ul className="mt-1 list-disc space-y-1.5 pl-5">
            {event.whatThisIsNot.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <p>{event.signupNote}</p>
      </div>
    </details>
  );
}
