"use client";

import type { CommunityCleanupMessage } from "@/types";
import { InlineContentLink } from "@/components/whatsapp/content-link";
import { Card } from "@/components/ui/card";
import { Disclosure } from "@/components/ui/disclosure";

function pointKey(point: CommunityCleanupMessage["points"][number]): string {
  if (typeof point === "string") return point;
  if ("whatsappKey" in point) {
    return `${point.linkLabel}-${point.whatsappKey}`;
  }
  return `${point.linkLabel}-${point.href}`;
}

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
              <li key={pointKey(point)}>
                <InlineContentLink segment={point} />
              </li>
            ),
          )}
        </ul>
      </Disclosure>
    </Card>
  );
}
