import type { ScientificBriefing } from "@/types";

export function ScientificBriefingPanel({
  briefing,
}: {
  briefing: ScientificBriefing;
}) {
  return (
    <section
      id="scientific-briefing"
      className="scroll-mt-20 border-t border-[var(--line)] pt-6"
      aria-labelledby="scientific-briefing-heading"
    >
      <h3
        id="scientific-briefing-heading"
        className="text-lg font-bold uppercase tracking-wide text-[var(--ink)]"
      >
        {briefing.title}
      </h3>

      <div className="mt-4 space-y-5 text-sm leading-snug text-[var(--ink)]">
        {briefing.sections.map((section, index) => (
          <div key={`${section.heading}-${index}`} className="space-y-2">
            {section.heading ? (
              <h4 className="font-bold text-[var(--ink)]">{section.heading}</h4>
            ) : null}
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="list-disc space-y-1.5 pl-5">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        {briefing.fullBriefingHref ? (
          <p>
            Read the full briefing{" "}
            <a
              href={briefing.fullBriefingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[var(--mark)] underline underline-offset-2"
            >
              here
            </a>
            .
          </p>
        ) : null}
      </div>
    </section>
  );
}
