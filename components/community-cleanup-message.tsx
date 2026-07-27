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
        <span className="flex items-center justify-between gap-3">
          <span
            id="cleanup-message-heading"
            className="text-sm font-bold uppercase tracking-wide text-[var(--mute)]"
          >
            {message.title}
          </span>
          <span
            className="shrink-0 text-xl font-bold leading-none text-[var(--tide)] transition group-open:rotate-45"
            aria-hidden="true"
          >
            +
          </span>
        </span>
      </summary>

      <ul className="list-disc space-y-2 px-4 pb-4 pl-9 text-base leading-snug text-[var(--ink)]">
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
