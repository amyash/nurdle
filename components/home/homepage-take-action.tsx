import {
  ContentLinkButton,
  InlineContentLink,
} from "@/components/whatsapp/content-link";
import { CopyableEmailTemplate } from "@/components/copyable-email-template";
import { Disclosure } from "@/components/ui/disclosure";
import type { ContentLink, OrganiserMessage } from "@/types";

function contentLinkKey(link: ContentLink): string {
  return "whatsappKey" in link ? link.whatsappKey : link.href;
}

function inlineSegmentKey(
  segment: Extract<OrganiserMessage["actions"][number]["body"][number], object>,
): string {
  return "whatsappKey" in segment
    ? `${segment.linkLabel}-${segment.whatsappKey}`
    : `${segment.linkLabel}-${segment.href}`;
}

/** Campaigning actions — email template behind disclosure, not dumped on the page. */
export function HomepageTakeAction({
  message,
}: {
  message: OrganiserMessage;
}) {
  return (
    <ol className="list-none space-y-0 p-0">
      {message.actions.map((action, index) => (
        <li key={action.id} className={index > 0 ? "mt-10" : undefined}>
          <h3 className="text-card-title">
            {action.title.replace(/^\d+\.\s*/, "")}
          </h3>
          <div className="mt-3 max-w-measure space-y-3 text-body text-mute">
            {action.body.map((paragraph) =>
              typeof paragraph === "string" ? (
                <p key={paragraph}>{paragraph}</p>
              ) : (
                <p key={inlineSegmentKey(paragraph)}>
                  <InlineContentLink
                    segment={paragraph}
                    linkClassName="font-bold text-mark underline underline-offset-2"
                  />
                </p>
              ),
            )}
          </div>

          {action.emailTemplate ? (
            <div className="mt-5">
              <Disclosure
                className="border border-line bg-paper open:bg-surface"
                summaryClassName="px-4 py-3 text-sm font-bold text-ink"
                summary="Show email template for councillors & MPs"
              >
                <div className="border-t border-line px-4 pb-4 pt-3">
                  <CopyableEmailTemplate
                    label={action.emailTemplate.label}
                    subject={action.emailTemplate.subject}
                    body={action.emailTemplate.body}
                    tone="light"
                  />
                </div>
              </Disclosure>
            </div>
          ) : null}

          {action.links && action.links.length > 0 ? (
            <ul className="mt-5 flex flex-col gap-2 sm:max-w-sm">
              {action.links.map((link) => (
                <li key={contentLinkKey(link)}>
                  <ContentLinkButton
                    link={link}
                    variant={"whatsappKey" in link ? "whatsapp" : "primary"}
                    fullWidth
                  />
                </li>
              ))}
            </ul>
          ) : null}

          {action.textLinks && action.textLinks.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {action.textLinks.map((link) => (
                <li key={contentLinkKey(link)}>
                  {"whatsappKey" in link ? (
                    <ContentLinkButton
                      link={link}
                      variant="quiet"
                      className="!min-h-0 !justify-start !px-0 !py-0 font-bold text-mark underline underline-offset-2"
                    />
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-mark underline underline-offset-2"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}

      {message.actionFooterLinks && message.actionFooterLinks.length > 0 ? (
        <li className="mt-10">
          <ul className="space-y-2">
            {message.actionFooterLinks.map((link) => (
              <li key={contentLinkKey(link)}>
                {"whatsappKey" in link ? (
                  <ContentLinkButton
                    link={link}
                    variant="quiet"
                    className="!min-h-0 !justify-start !px-0 !py-0 font-bold text-mark underline underline-offset-2"
                  />
                ) : (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-mark underline underline-offset-2"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </li>
      ) : null}
    </ol>
  );
}
