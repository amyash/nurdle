import type {
  BeachNeed,
  BriefingEvent,
  BringItem,
  CollectStep,
  FaqItem,
  LatestUpdate,
  OrganiserMessage,
  TechniqueGuide,
  TrainingVideo,
} from "@/types";

export const whatsappCommunity = {
  label: "Join the community WhatsApp group",
  url: "https://chat.whatsapp.com/KXTZ6zO69si0vNqN0nrc1f",
};

/** Shown at the top — evidence / photos note. */
export const photosNote = {
  beforeLink:
    "Please take photos of the nurdles to document the damage. There will hopefully be legal action, an inquiry or investigation — the more evidence the better. There is a dedicated group called ",
  linkLabel: "PHOTOS ONLY",
  afterLink: " in the community WhatsApp.",
  url: "https://chat.whatsapp.com/Bu3PVQzDvbF03k6f0NTvgK",
};

/** Expandable briefing signup — shown near the top. */
export const briefingEvent: BriefingEvent = {
  title: "Nurdle Beaches Emergency Briefing",
  summary:
    "Sign up for the chance to attend an in-person briefing and brainstorming session on North Tyneside’s beach experience with the largest plastic bead spill in Northern Europe.",
  url: "https://www.eventbrite.co.uk/e/1995177197707?aff=oddtdtcreator",
  whatThisIs: [
    "A chance to hear from some of those working on the problem — many of whom will have been working all weekend and non-stop since this began. They/we will need support and a chance to pause and reflect on where we are.",
    "A chance to think through what we can expect over the next few weeks, months and year.",
  ],
  whatThisIsNot: [
    "We will stick to the issues on our beaches. If your primary interest is upriver — for example the marina and riverside — this isn’t for you.",
    "We’re not looking to hold an angry public meeting where we shout questions at each other. That wouldn’t be useful, and we then couldn’t invite people directly working on this.",
  ],
  signupNote:
    "Please submit a question and also tell us what you may be able to offer to make the event informative. Venue will be announced 6 hours in advance, within a 5-minute walk of Metro close to Tynemouth. If interest exceeds capacity, in-person places will be offered based on the question asked or by random ballot, with everyone else offered the chance to join online.",
};

/**
 * Leading organiser message — shown at the top.
 * Clearly community guidance, not official advice.
 */
export const organiserMessage: OrganiserMessage = {
  datetime: "2026-07-26T09:00:00+01:00",
  sourceLabel: "Community organiser message",
  headline:
    "Over 1 billion plastic pellets (nurdles) in the River Tyne — 24 tonnes — and now all over our beaches.",
  context: [
    "There are individual beach groups. There has been an unofficial request for help specifically on Monday and Tuesday.",
    "No organisation is officially leading this — hands are tied by Environment Agency advice not to touch. Efforts are being made to change this.",
    "Volunteers on the ground strongly believe North Tyneside Council have not grasped the emergency level of this. Contractors and workers should be out in force. Volunteers are needed — and pressure on the council is needed too.",
  ],
  actions: [
    {
      id: "join-cleanup",
      title: "1. Join a beach clean",
      body: [
        "Join the community WhatsApp group for beach-specific updates, or head down to help.",
        "Community advice: collect in bin bags and place next to the council bins. Large mesh bags work well with shovels; where appropriate use a dustpan and brush. Method is discussed on the group.",
        "You must join the group to know more about where help is needed.",
      ],
      links: [
        {
          label: "Open WhatsApp community link",
          href: "https://chat.whatsapp.com/KXTZ6zO69si0vNqN0nrc1f",
        },
      ],
    },
    {
      id: "write-reps",
      title: "2. Write to your MP, councillor and the Mayor",
      body: [
        "Contact all three. Ask for a large-scale effort at the right tide times to collect nurdles. People are needed specifically Monday and Tuesday for a large-scale cleanup — and the council should respond with numbers and the right gear.",
        "Find your local councillors, then write. Always include your name and address at the top.",
        "Residents in this constituency can write to MP Alan Campbell.",
      ],
      links: [
        {
          label: "Find your local councillors",
          href: "https://www.gov.uk/find-your-local-councillors",
        },
        {
          label: "Email MP Alan Campbell",
          href: "mailto:alan.campbell.mp@parliament.uk",
        },
      ],
    },
  ],
  notes: [
    "The council tractor is still being used on the beach and this is burying the nurdles deeper. Community organisers say this must stop.",
    "Nobody is able to officially lead this while EA advice is not to touch. This board shares community organiser information only.",
  ],
};

/** Short status line under the organiser message. */
export const latestUpdate: LatestUpdate = {
  datetime: "2026-07-26T10:00:00+01:00",
  summary:
    "This week is critical. Unofficial expert advice due to EA block. Join WhatsApp for beach teams.",
  source: "Community",
  window: "26 July – 1 August 2026",
  whyThisWeek: [
    "Tides are climbing higher each day. Nurdle lines get pushed further up the beach until the spring tide next Saturday.",
    "Collect from the high tide line daily this week — before those lines are pushed higher and become much harder to recover.",
    "Doing this now limits environmental impact and how long the cleanup lasts. The next thick lines may not return for about two weeks; a storm could scatter everything again.",
  ],
  callToAction:
    "We need teams of volunteers out after high tide, getting on this fast. We have clear guidance on what to do and which tools to use.",
  focusMethod:
    "At this stage, specifically clear the lines appearing on the beaches after high tide. Nurdles in soft sand will be collected by the tides and form these lines — so focus on that method.",
  closing:
    "Be kind to each other. Be patient with each other. We are all trying to figure this out — support each other.",
};

export const beachesNeedingHelp: BeachNeed[] = [
  {
    id: "whitley-bay",
    name: "Whitley Bay",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: "Monday & Tuesday — details on group",
    whatsappUrl: "https://chat.whatsapp.com/H8NyTR4AThJIT014Wc5ooE",
  },
  {
    id: "longsands",
    name: "Longsands",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: "Monday & Tuesday — details on group",
    whatsappUrl: "https://chat.whatsapp.com/KtraHXq8Q3R6JrANxkzi8N",
  },
  {
    id: "cullercoats",
    name: "Cullercoats",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: "Monday & Tuesday — details on group",
    whatsappUrl: "https://chat.whatsapp.com/LJIE5xqsqWmGAIl2pLt4t2",
  },
  {
    id: "haven-beach",
    name: "Haven Beach",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/IUp4YAxs7Yo7vZAqeO6Z1I",
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/K2lktDs5NAj7UG1SYoDYwh",
  },
  {
    id: "fish-quay",
    name: "Fish Quay",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/E3UFrnJFRE719lT7BztWoo",
  },
  {
    id: "blyth",
    name: "Blyth",
    need: "Check WhatsApp for beach-specific updates",
    nextWindow: null,
    whatsappUrl: null,
  },
  {
    id: "browns-jackeys",
    name: "Brown’s Bay / Jackey’s Bay",
    need: "Check WhatsApp for beach-specific updates",
    nextWindow: null,
    whatsappUrl: null,
  },
];

export const whatToBring: BringItem[] = [
  { id: "sweep", item: "Sweeping brushes" },
  { id: "dustpan", item: "Dustpans and brushes" },
  { id: "gloves", item: "Gloves" },
  { id: "bags", item: "Heavy-duty bin bags" },
  { id: "labels", item: "Labels stating “volunteers collected”" },
];

export const howToCollectIntro =
  "Avoid treading nurdles into the sand as best you can.";

export const howToCollect: CollectStep[] = [
  { step: 1, text: "Get out after high tide — this week daily collection matters most." },
  { step: 2, text: "Focus on clearing the nurdle lines left on the beach after high tide." },
  { step: 3, text: "Use sweeping brushes, dustpans and brushes — see collection techniques below." },
  { step: 4, text: "Bag into heavy-duty bin bags and label them “volunteers collected”." },
  { step: 5, text: "Place filled bags next to the council bins (community advice)." },
];

/** Replace null urls with public video links when ready. */
export const trainingVideos: TrainingVideo[] = [
  {
    id: "video-1",
    title: "How to scrape nurdles on wet sand with a plank",
    duration: "Watch on YouTube",
    url: "https://youtu.be/XW4cJDxCEZk",
    note: "",
  },
  {
    id: "video-2",
    title: "How to sift nurdles in dry sand with mesh bag",
    duration: "Watch on YouTube",
    url: "https://youtube.com/shorts/No1TWSeSfUI",
    note: "",
  },
  {
    id: "video-3",
    title: "How to scrape nurdles on hard wet sand using back of rake",
    duration: "Watch on YouTube",
    url: "https://youtube.com/shorts/hiGc1oj68kA",
    note: "",
  },
];

/** Written technique — for when you don’t have a rake or sieve for scraping. */
export const techniqueGuides: TechniqueGuide[] = [
  {
    id: "bucket-float",
    title: "If without rake or sieve — bucket and seawater method",
    steps: [
      "Collect a bucket of sea water.",
      "Shovel sand (or seaweed) and nurdles mix into the bucket.",
      "When the nurdles float to the top, scoop them off with a sieve.",
      "Add the nurdles to a strong bin bag.",
      "When your bucket is full of sand, empty and refill with sea water.",
    ],
  },
];

export const faqs: FaqItem[] = [
  {
    id: "safe",
    question: "Is it safe to collect?",
    answer:
      "Environment Agency advice has been not to touch, which is why no organisation can officially lead. Community volunteers are still collecting at their own discretion. Check weather and tides, and leave if conditions feel unsafe.",
  },
  {
    id: "bins",
    question: "Where do filled bags go?",
    answer:
      "Community organiser advice: collect in bin bags and place them next to the council bins. Make sure the bags are clearly labeled. Join the WhatsApp group for the latest method discussion.",
    highlight: "Make sure the bags are clearly labeled.",
  },
  {
    id: "when",
    question: "When should I go?",
    answer:
      "There is an unofficial request for help specifically on Monday and Tuesday. Check tide times and the WhatsApp group before you travel.",
  },
  {
    id: "pressure",
    question: "How do I press the council to do more?",
    answer:
      "Write to your MP, your councillor and the Mayor — all three. Ask for a large-scale tide-based cleanup with proper numbers and equipment. Include your name and address at the top.",
  },
  {
    id: "who",
    question: "Who runs this cleanup?",
    answer:
      "No organisation is officially leading this while EA advice restricts action. This is a community volunteer effort. This page is not an official council or emergency-service site.",
  },
];

export const siteDisclaimer =
  "Community information board — not an official council or emergency-service website. The leading message is from a community organiser. Participate at your own discretion.";
