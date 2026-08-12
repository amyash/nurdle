import type { WhatsappLinkKey } from "@/lib/whatsapp-gate/links";

export type SourceLabel =
  | "Official"
  | "Community"
  | "Awaiting confirmation";

export type { WhatsappLinkKey };

/** External page link or gated WhatsApp group invite. */
export type ContentLink =
  | { label: string; href: string }
  | { label: string; whatsappKey: WhatsappLinkKey };

/** Inline copy with a link mid-sentence. */
export type InlineContentLink =
  | {
      beforeLink: string;
      linkLabel: string;
      afterLink?: string;
      href: string;
    }
  | {
      beforeLink: string;
      linkLabel: string;
      afterLink?: string;
      whatsappKey: WhatsappLinkKey;
    };

export type RichTextPart =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string }
  | { type: "whatsapp"; label: string; linkKey: WhatsappLinkKey };

export interface LatestUpdate {
  datetime: string;
  summary: string;
  source: SourceLabel;
  window: string;
  whyThisWeek: string[];
  callToAction: string;
  focusMethod: string;
  closing: string;
}

export type AnnouncementTextPart = string | { bold: string };

export type AnnouncementBlock =
  | { type: "lg"; parts: AnnouncementTextPart[] }
  | { type: "md"; parts: AnnouncementTextPart[] }
  | { type: "sm"; parts: AnnouncementTextPart[] }
  | { type: "p"; parts: AnnouncementTextPart[] }
  | { type: "divider" }
  | { type: "bullets"; intro?: AnnouncementTextPart[]; items: AnnouncementTextPart[][] }
  | { type: "numbered"; items: AnnouncementTextPart[][] };

export interface Announcement {
  id: string;
  datetime: string;
  headline: string;
  /** When set, the headline is rendered as a link. */
  headlineHref?: string;
  body?: string[];
  blocks?: AnnouncementBlock[];
  times?: string[];
  link?: ContentLink;
  sourceName?: string;
  /** When true, card starts collapsed and expands on tap. */
  expandable?: boolean;
}

export interface BriefingEvent {
  title: string;
  summary: string;
  url: string;
  whatThisIs: string[];
  whatThisIsNot: string[];
  signupNote: string;
}

export type OrganiserActionBody = string | InlineContentLink;

export interface OrganiserMessage {
  datetime: string;
  sourceLabel: string;
  headline: string;
  context: string[];
  actions: {
    id: string;
    title: string;
    body: OrganiserActionBody[];
    links?: ContentLink[];
    /** Plain text hyperlinks shown under CTA buttons. */
    textLinks?: ContentLink[];
    emailTemplate?: {
      label?: string;
      subject: string;
      body: string;
    };
  }[];
  /** Links shown under a divider at the bottom of the Actions panel. */
  actionFooterLinks?: ContentLink[];
  notes: string[];
}

export interface ScientificBriefing {
  title: string;
  sections: {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
  /** Full briefing document URL — omit link until confirmed. */
  fullBriefingHref?: string | null;
}

export type CommunityCleanupPoint = string | InlineContentLink;

export interface CommunityCleanupMessage {
  title: string;
  points: CommunityCleanupPoint[];
}

export interface BringItem {
  id: string;
  item: string;
}

export interface CollectStep {
  step: number;
  text: string | InlineContentLink;
  title?: string;
  cta?: ContentLink;
}

export interface TrainingVideo {
  id: string;
  title: string;
  duration: string;
  url: string | null;
  note: string;
  tip?: {
    text: string;
    image: { src: string; alt: string };
  };
  sideImage?: { src: string; alt: string };
}

export interface TechniqueGuide {
  id: string;
  title: string;
  steps: string[];
  description?: string;
  /** Extra tips shown beneath numbered steps. */
  notes?: string[];
  images?: { src: string; alt: string }[];
  videos?: { title: string; url: string }[];
  instagramUrl?: string;
  cta?: ContentLink;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Optional phrase within answer to emphasise. */
  highlight?: string;
}

export interface CommunityImage {
  id: string;
  src: string;
  alt: string;
  /** Optional photo credit shown as a tiny caption line. */
  credit?: string;
}
