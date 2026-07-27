export type SourceLabel =
  | "Official"
  | "Community"
  | "Awaiting confirmation";

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
  body?: string[];
  blocks?: AnnouncementBlock[];
  times?: string[];
  link?: { label: string; href: string };
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

export type OrganiserActionBody =
  | string
  | {
      beforeLink: string;
      linkLabel: string;
      afterLink?: string;
      href: string;
    };

export interface OrganiserMessage {
  datetime: string;
  sourceLabel: string;
  headline: string;
  context: string[];
  actions: {
    id: string;
    title: string;
    body: OrganiserActionBody[];
    links?: { label: string; href: string }[];
    emailTemplate?: {
      label: string;
      subject: string;
      body: string;
    };
  }[];
  notes: string[];
}

export interface BeachNeed {
  id: string;
  name: string;
  need: string;
  nextWindow: string | null;
  /** Beach WhatsApp invite link — null until confirmed. */
  whatsappUrl: string | null;
  region: "north-tyneside" | "south-tyneside";
}

export type CommunityCleanupPoint =
  | string
  | {
      beforeLink: string;
      linkLabel: string;
      afterLink?: string;
      href: string;
    };

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
  text: string;
  title?: string;
  cta?: {
    label: string;
    href: string;
  };
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
  images?: { src: string; alt: string }[];
  videos?: { title: string; url: string }[];
  instagramUrl?: string;
  cta?: { label: string; href: string };
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
