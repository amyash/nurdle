import { formatPublishedDate } from "@/lib/dates";
import type { MediaCoverageItem } from "@/data/media-coverage";

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-1 h-3.5 w-3.5 shrink-0 text-mark"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5H3.5A1 1 0 0 0 2.5 4.5v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" />
      <path d="M9.5 2.5h4v4" />
      <path d="M7.5 8.5 13.5 2.5" />
    </svg>
  );
}

export function MediaCoverageList({ items }: { items: MediaCoverageItem[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.id}>
          <article className="py-8">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-eyebrow text-mark">{item.outlet}</p>
              <p className="text-meta">
                <time dateTime={item.date}>
                  {formatPublishedDate(item.date)}
                </time>
              </p>
            </div>
            <h2 className="mt-3 text-card-title">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-ink underline decoration-line underline-offset-2 hover:text-mark hover:decoration-mark"
              >
                <span>{item.headline}</span>
                <ExternalLinkIcon />
              </a>
            </h2>
            <p className="mt-3 reading-measure text-body text-mute">
              {item.summary}
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
