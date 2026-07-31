import type { BriefingEvent } from "@/types";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function BriefingEventPanel({ event }: { event: BriefingEvent }) {
  return (
    <Card
      id="briefing"
      variant="ink"
      className="scroll-mt-20 !p-0"
    >
      <div className="px-4 py-3">
        <p className="text-eyebrow text-mute">Upcoming event</p>
        <h3 className="mt-1 text-card-title">{event.title}</h3>
        <p className="mt-1 text-meta">{event.summary}</p>
      </div>

      <div className="space-y-4 border-t border-line px-4 py-4 text-sm leading-snug text-ink">
        <ButtonLink href={event.url} variant="ink" fullWidth external>
          Sign up on Eventbrite
        </ButtonLink>

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
    </Card>
  );
}
