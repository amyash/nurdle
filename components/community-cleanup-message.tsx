import type { CommunityCleanupMessage } from "@/types";
import { Card } from "@/components/ui/card";
import { Disclosure } from "@/components/ui/disclosure";

export function CommunityCleanupMessagePanel({
  message,
}: {
  message: CommunityCleanupMessage;
}) {
  return (
    <Card variant="ink" className="mb-6 !p-0">
      <Disclosure
        summary={
          <span id="cleanup-message-heading" className="text-eyebrow text-mute">
            {message.title}
          </span>
        }
        summaryClassName="px-4"
        className="open:shadow-sm"
      >
        <ul className="list-disc space-y-2 px-4 pb-2 pl-9 text-body">
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
                  className="font-bold text-mark underline underline-offset-2"
                >
                  {point.linkLabel}
                </a>
                {point.afterLink}
              </li>
            ),
          )}
        </ul>
      </Disclosure>
    </Card>
  );
}
