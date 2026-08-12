import type { BriefingEvent } from "@/types";
import { ButtonLink } from "@/components/ui/button";

export function BriefingEventPanel({ event }: { event: BriefingEvent }) {
  return (
    <section id="briefing" className="scroll-mt-24">
      <p className="text-eyebrow text-mark">Upcoming event</p>
      <h2 className="mt-2 text-section">{event.title}</h2>
      <p className="mt-3 reading-measure text-body text-mute">{event.summary}</p>

      <div className="mt-6 max-w-sm">
        <ButtonLink href={event.url} variant="primary" fullWidth external>
          Sign up on Eventbrite
        </ButtonLink>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-card-title">What this is</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-body text-mute">
            {event.whatThisIs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-card-title">What this is not</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-body text-mute">
            {event.whatThisIsNot.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 reading-measure text-meta">{event.signupNote}</p>
    </section>
  );
}
