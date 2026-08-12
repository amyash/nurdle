"use client";

import type { ReactNode } from "react";
import { WhatsAppGateProvider } from "@/components/whatsapp/whatsapp-gate";

export function AppProviders({ children }: { children: ReactNode }) {
  return <WhatsAppGateProvider>{children}</WhatsAppGateProvider>;
}
