import Image from "next/image";
import { CopyableEmailTemplate } from "@/components/copyable-email-template";
import { ScientificBriefingPanel } from "@/components/scientific-briefing";
import { scientificBriefing } from "@/data/content";
import type { OrganiserMessage } from "@/types";

export function OrganiserMessagePanel({
  message,
}: {
  message: OrganiserMessage;
}) {
  return (
    <section id="organiser" className="scroll-mt-20" aria-labelledby="organiser-heading">
      <h2
        id="organiser-heading"
        className="text-xl font-bold leading-snug text-[var(--ink)]"
      >
        {message.headline}
      </h2>

      <div className="mt-3 space-y-2 text-sm leading-snug text-[var(--ink)]">
        {message.context.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <figure className="mt-4 overflow-hidden rounded-lg">
        <Image
          src="/nurdles-on-beach.webp"
          alt="Thousands of small white plastic pellets (nurdles) scattered across beach sand"
          width={1200}
          height={900}
          className="h-auto w-full object-cover"
        />
      </figure>

      <div className="mt-6 rounded-lg bg-[#111827] px-4 py-5 text-white">
        <h3 className="text-lg font-bold uppercase tracking-wide text-white">
          Actions
        </h3>

        <ol className="mt-3 space-y-6">
          {message.actions.map((action) => (
            <li key={action.id}>
              <h4 className="font-bold text-white">{action.title}</h4>
              <div className="mt-2 space-y-2 text-sm leading-snug text-white/90">
                {action.body.map((paragraph) =>
                  typeof paragraph === "string" ? (
                    <p key={paragraph}>{paragraph}</p>
                  ) : (
                    <p key={paragraph.href + paragraph.linkLabel}>
                      {paragraph.beforeLink}
                      <a
                        href={paragraph.href}
                        {...(paragraph.href.startsWith("http")
                          ? {
                              target: "_blank" as const,
                              rel: "noopener noreferrer",
                            }
                          : {})}
                        className="font-bold text-[#5eead4] underline underline-offset-2"
                      >
                        {paragraph.linkLabel}
                      </a>
                      {paragraph.afterLink}
                    </p>
                  ),
                )}
              </div>
              {action.links && action.links.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {action.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target={
                          link.href.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel={
                          link.href.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                        className="inline-flex w-full items-center justify-center rounded-md bg-white px-3 py-2.5 text-center text-sm font-bold text-[#111827]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {action.emailTemplate && (
                <CopyableEmailTemplate
                  label={action.emailTemplate.label}
                  subject={action.emailTemplate.subject}
                  body={action.emailTemplate.body}
                  tone="dark"
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      <ScientificBriefingPanel briefing={scientificBriefing} />
    </section>
  );
}

export function OrganiserNotesCard({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;

  return (
    <aside
      className="space-y-2 rounded-lg border border-amber-800/40 bg-amber-50 p-3 text-sm leading-snug text-amber-950"
      role="note"
    >
      {notes.map((note) => (
        <p key={note}>{note}</p>
      ))}
    </aside>
  );
}
