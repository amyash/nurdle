import type { BriefingEvent } from "@/types";

export function BriefingEventPanel({ event }: { event: BriefingEvent }) {
  return (
    <article
      id="briefing"
      className="scroll-mt-20 rounded-lg border-2 border-[var(--ink)] bg-white"
    >
      <div className="px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--mute)]">
          Upcoming event
        </p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-[var(--ink)]">
          {event.title}
        </h3>
        <p className="mt-1 text-sm leading-snug text-[var(--mute)]">
          {event.summary}
        </p>
      </div>

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
    </article>
  );
}
