"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button, ButtonLink, type ButtonVariant } from "@/components/ui/button";
import { useWhatsAppGate } from "@/components/whatsapp/whatsapp-gate";
import {
  whatsappGateLabelForKey,
  type WhatsappLinkKey,
} from "@/lib/whatsapp-gate/links";
import { cn } from "@/lib/cn";
import type { ContentLink, InlineContentLink, RichTextPart } from "@/types";

const inlineLinkClass =
  "font-bold text-mark underline underline-offset-2";

function openWhatsappGate(
  openGate: ReturnType<typeof useWhatsAppGate>["openGate"],
  linkKey: WhatsappLinkKey,
  label: string,
) {
  openGate({
    linkKey,
    beachId: "",
    label: whatsappGateLabelForKey(linkKey) || label,
  });
}

export function WhatsAppGateTextLink({
  linkKey,
  label,
  className,
  children,
}: {
  linkKey: WhatsappLinkKey;
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  const { openGate } = useWhatsAppGate();

  return (
    <button
      type="button"
      className={cn(inlineLinkClass, className)}
      onClick={() => openWhatsappGate(openGate, linkKey, label)}
    >
      {children ?? label}
    </button>
  );
}

export function ContentLinkButton({
  link,
  variant = "whatsapp",
  fullWidth,
  className,
}: {
  link: ContentLink;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
}) {
  const { openGate } = useWhatsAppGate();

  if ("whatsappKey" in link) {
    return (
      <Button
        type="button"
        variant={variant}
        fullWidth={fullWidth}
        className={className}
        onClick={() =>
          openWhatsappGate(openGate, link.whatsappKey, link.label)
        }
      >
        {link.label}
      </Button>
    );
  }

  const external = /^https?:\/\//.test(link.href);

  return (
    <ButtonLink
      href={link.href}
      variant={variant}
      fullWidth={fullWidth}
      className={className}
      external={external}
    >
      {link.label}
    </ButtonLink>
  );
}

export function InlineContentLink({
  segment,
  linkClassName = inlineLinkClass,
}: {
  segment: InlineContentLink;
  linkClassName?: string;
}) {
  if ("whatsappKey" in segment) {
    return (
      <>
        {segment.beforeLink}
        <WhatsAppGateTextLink
          linkKey={segment.whatsappKey}
          label={segment.linkLabel}
          className={linkClassName}
        />
        {segment.afterLink}
      </>
    );
  }

  const external = segment.href.startsWith("http");

  if (segment.href.startsWith("/")) {
    return (
      <>
        {segment.beforeLink}
        <Link href={segment.href} className={linkClassName}>
          {segment.linkLabel}
        </Link>
        {segment.afterLink}
      </>
    );
  }

  return (
    <>
      {segment.beforeLink}
      <a
        href={segment.href}
        {...(external
          ? { target: "_blank" as const, rel: "noopener noreferrer" }
          : {})}
        className={linkClassName}
      >
        {segment.linkLabel}
      </a>
      {segment.afterLink}
    </>
  );
}

export function RichTextParts({ parts }: { parts: RichTextPart[] }) {
  return (
    <>
      {parts.map((part, index) =>
        part.type === "text" ? (
          <span key={index}>{part.value}</span>
        ) : part.type === "whatsapp" ? (
          <WhatsAppGateTextLink
            key={index}
            linkKey={part.linkKey}
            label={part.label}
          />
        ) : (
          <a
            key={index}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className={inlineLinkClass}
          >
            {part.label}
          </a>
        ),
      )}
    </>
  );
}
