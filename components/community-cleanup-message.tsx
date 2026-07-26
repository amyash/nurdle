import type { CommunityCleanupMessage } from "@/types";

export function CommunityCleanupMessagePanel({
  message,
}: {
  message: CommunityCleanupMessage;
}) {
  return (
    <details
      open
      className="group mb-6 rounded-lg border-2 border-[var(--ink)] bg-white open:shadow-sm"
    >
      <summary className="cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-start justify-between gap-3">
          <span>
            <span
              id="cleanup-message-heading"
              className="block text-sm font-bold uppercase tracking-wide text-[var(--mute)]"
            >
              {message.title}
            </span>
            <span className="mt-1 block text-sm leading-snug text-[var(--mute)]">
              Community guidance for heading down — tools, timing, and what to
              do with collections.
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

      <ul className="list-disc space-y-2 border-t border-[var(--line)] px-4 py-4 pl-9 text-base leading-snug text-[var(--ink)]">
        {message.points.map((point) =>
          typeof point === "string" ? (
            <li key={point}>{point}</li>
          ) : (
            <li key={point.href}>
              {point.beforeLink}
              <a
                href={point.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[var(--tide)] underline underline-offset-2"
              >
                {point.linkLabel}
              </a>
              {point.afterLink}
            </li>
          ),
        )}
      </ul>
    </details>
  );
}
