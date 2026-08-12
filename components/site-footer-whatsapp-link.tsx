"use client";

import { WhatsAppGateTextLink } from "@/components/whatsapp/content-link";

export function SiteFooterWhatsappLink() {
  return (
    <WhatsAppGateTextLink
      linkKey="site-contact"
      label="WhatsApp"
      className="font-normal text-mute underline underline-offset-2"
    />
  );
}
