import Image from "next/image";
import { CopyableEmailTemplate } from "@/components/copyable-email-template";
import { ScientificBriefingPanel } from "@/components/scientific-briefing";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { ContentStack } from "@/components/ui/content-stack";
import { scientificBriefing } from "@/data/content";
import type { OrganiserMessage } from "@/types";

export function OrganiserMessagePanel({
  message,
}: {
  message: OrganiserMessage;
}) {
  return (
    <section
      id="organiser"
      className="scroll-mt-20"
      aria-labelledby="organiser-heading"
    >
      <h2 id="organiser-heading" className="text-page-title">
        {message.headline}
      </h2>

      <ContentStack gap="sm" className="mt-3 max-w-prose text-body">
        {message.context.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </ContentStack>

      <figure className="mt-4 overflow-hidden rounded-card">
        <Image
          src="/nurdles-on-beach.webp"
          alt="Thousands of small white plastic pellets (nurdles) scattered across beach sand"
          width={1200}
          height={900}
          className="h-auto w-full object-cover"
        />
      </figure>

      <div className="mt-8 rounded-card bg-ink px-4 py-5 text-white">
        <h3 className="text-card-title text-white">Actions</h3>

        <ol className="mt-4 list-none space-y-6 p-0">
          {message.actions.map((action, index) => (
            <li
              key={action.id}
              className={index > 0 ? "border-t border-white/20 pt-6" : undefined}
            >
              <h4 className="text-base font-bold text-white">{action.title}</h4>
              <ContentStack gap="sm" className="mt-2 text-sm leading-snug text-white/90">
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
                        className="font-bold text-accent-mint underline underline-offset-2"
                      >
                        {paragraph.linkLabel}
                      </a>
                      {paragraph.afterLink}
                    </p>
                  ),
                )}
              </ContentStack>
              {action.links && action.links.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {action.links.map((link) => (
                    <li key={link.href}>
                      <ButtonLink
                        href={link.href}
                        variant="primary"
                        fullWidth
                        {...(link.href.startsWith("mailto:")
                          ? {}
                          : { external: true })}
                      >
                        {link.label}
                      </ButtonLink>
                    </li>
                  ))}
                </ul>
              )}
              {action.textLinks && action.textLinks.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {action.textLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-accent-mint underline underline-offset-2"
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

        {message.actionFooterLinks && message.actionFooterLinks.length > 0 ? (
          <>
            <div
              className="mt-6 border-t border-white/20"
              aria-hidden="true"
            />
            <ul className="mt-4 space-y-2">
              {message.actionFooterLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-accent-mint underline underline-offset-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <div className="mt-8 border-t border-line pt-8" aria-hidden="true" />

      <ScientificBriefingPanel briefing={scientificBriefing} />
    </section>
  );
}

export function OrganiserNotesCard({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;

  return (
    <Callout tone="warning" role="note" className="space-y-2 text-sm leading-snug">
      {notes.map((note) => (
        <p key={note}>{note}</p>
      ))}
    </Callout>
  );
}
