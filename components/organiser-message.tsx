import { formatWhen } from "@/lib/dates";
import type { OrganiserMessage } from "@/types";

export function OrganiserMessagePanel({
  message,
}: {
  message: OrganiserMessage;
}) {
  return (
    <section
      id="organiser"
      className="scroll-mt-20 rounded-lg border-2 border-[var(--ink)] bg-white p-4"
      aria-labelledby="organiser-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--mute)]">
          {message.sourceLabel}
        </p>
        <p className="text-xs font-bold text-[var(--mute)]">
          <time dateTime={message.datetime}>
            {formatWhen(message.datetime)}
          </time>
        </p>
      </div>

      <h2
        id="organiser-heading"
        className="mt-2 text-xl font-bold leading-snug text-[var(--ink)]"
      >
        {message.headline}
      </h2>

      <div className="mt-3 space-y-2 text-sm leading-snug text-[var(--ink)]">
        {message.context.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-[var(--ink)]">
        Two actions
      </p>

      <ol className="mt-2 space-y-3">
        {message.actions.map((action) => (
          <li
            key={action.id}
            className="rounded-lg border border-[var(--line)] bg-[var(--board)] p-3"
          >
            <h3 className="font-bold text-[var(--ink)]">{action.title}</h3>
            <div className="mt-2 space-y-2 text-sm leading-snug text-[var(--ink)]">
              {action.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {action.links && action.links.length > 0 && (
              <ul className="mt-3 space-y-2">
                {action.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={
                        link.href.startsWith("mailto:")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="inline-flex w-full items-center justify-center rounded-md bg-[var(--ink)] px-3 py-2.5 text-center text-sm font-bold text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      <aside className="mt-4 space-y-2 rounded-lg border border-amber-800/40 bg-amber-50 p-3 text-sm leading-snug text-amber-950">
        {message.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </aside>
    </section>
  );
}
