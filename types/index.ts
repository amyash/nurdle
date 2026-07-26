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

export interface Announcement {
  id: string;
  datetime: string;
  headline: string;
  body: string[];
  times?: string[];
  link?: { label: string; href: string };
  sourceName?: string;
}

export interface BriefingEvent {
  title: string;
  summary: string;
  url: string;
  whatThisIs: string[];
  whatThisIsNot: string[];
  signupNote: string;
}

export interface OrganiserMessage {
  datetime: string;
  sourceLabel: string;
  headline: string;
  context: string[];
  actions: {
    id: string;
    title: string;
    body: string[];
    links?: { label: string; href: string }[];
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
}

export interface TrainingVideo {
  id: string;
  title: string;
  duration: string;
  url: string | null;
  note: string;
}

export interface TechniqueGuide {
  id: string;
  title: string;
  steps: string[];
  images?: { src: string; alt: string }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Optional phrase within answer to emphasise. */
  highlight?: string;
}
