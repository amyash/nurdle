import type {
  Announcement,
  BeachNeed,
  BriefingEvent,
  BringItem,
  CollectStep,
  CommunityCleanupMessage,
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

/** Top of Beach cleanup page — community practical message. */
export const communityCleanupMessage: CommunityCleanupMessage = {
  title: "Community message",
  points: [
    "Please don’t wait to be organised or be told the perfect way to do this.",
    "If you are heading down and want help, ask in the WhatsApp group — but this is community-led grassroots stuff, so just get stuck in!",
    "This next week is crucial, so people are doing what they can when they can. Times for Monday and Tuesday have been suggested at 5am–8am and 4pm–6pm, but anytime is good.",
    "Basic tools required are sieves / dustpan and brushes, and bin bags. People are making mesh sieves, but they are not essential.",
    "After high tide is optimal — clear the tide line before it gets washed out again.",
    "Anything collected should ideally be bagged and left by council bins, marked as volunteer collections.",
    "Photos of what you’ve collected should ideally be posted in the PHOTOS ONLY section, in case we need evidence later on.",
    "Good is better than perfect in a crisis — do what you can when you can. Just don’t trample nurdles into the sand.",
    {
      beforeLink: "Submit your findings with ",
      linkLabel: "The Great Nurdle Hunt",
      href: "https://www.nurdlehunt.org.uk/take-part/submit-your-finds.html",
    },
  ],
};

/** Shown under How to collect — evidence / photos note. */
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

/**
 * Announcements feed — newest first.
 * Link to General WhatsApp for polls and day-of coordination.
 */
export const announcements: Announcement[] = [
  {
    id: "longsands-monday-times",
    datetime: "2026-07-26T19:07:00+01:00",
    headline: "Longsands Beach — volunteer times tomorrow",
    sourceName: "Community admin",
    body: [
      "We are asking that volunteers head to Longsands Beach tomorrow at the following times.",
      "We have equipment to distribute and techniques to share that can then be taken to the other beaches accordingly.",
      "Please vote for the time(s) you can make in the General WhatsApp group poll.",
    ],
    link: {
      label: "Open General WhatsApp to fill out the poll",
      href: "https://chat.whatsapp.com/KXTZ6zO69si0vNqN0nrc1f",
    },
  },
];

/** Longer situation update — shown below newer announcements. */
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

export const whatToBringIntro = "Whatever you have available.";

export const whatToBring: BringItem[] = [
  { id: "spades", item: "Spades" },
  { id: "sieves", item: "Sieves, colanders" },
  { id: "mesh", item: "Mesh bags" },
  { id: "buckets", item: "Large buckets" },
  { id: "sweep", item: "Brooms" },
  { id: "dustpan", item: "Dustpans and brushes" },
  { id: "gloves", item: "Gloves" },
  { id: "bags", item: "Heavy-duty bin bags" },
  {
    id: "labels",
    item: "Labels stating “volunteers collected” — labelling with tape and marker will suffice",
  },
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
  {
    id: "video-4",
    title: "How to scrape nurdles on wet sand with a broom",
    duration: "Watch on YouTube",
    url: "https://youtube.com/shorts/Ora2gOhBJcc",
    note: "",
  },
];

/** Written cleanup techniques with optional photos. */
export const techniqueGuides: TechniqueGuide[] = [
  {
    id: "bucket-float",
    title: "Bucket and seawater method",
    steps: [
      "Collect a bucket of sea water.",
      "Shovel sand (or seaweed) and nurdles mix into the bucket.",
      "When the nurdles float to the top, scoop them off with a sieve.",
      "Add the nurdles to a strong bin bag.",
      "When your bucket is full of sand, empty and refill with sea water.",
      "Shaking the seaweed releases the nurdles — then scoop them up and remove the sand.",
    ],
    images: [
      {
        src: "/techniques/bucket-seawater.png",
        alt: "Red bucket of seawater with a metal sieve holding floating white nurdles",
      },
    ],
  },
  {
    id: "spade-mesh",
    title: "Spade and mesh bag method",
    steps: [
      "Scoop the top layer of sand and nurdles with a spade.",
      "Put the mix into a mesh bag and wash it in seawater so sand falls through and nurdles stay in the bag.",
      "Empty nurdles into a strong bin bag labelled as a volunteer collection.",
    ],
    images: [
      {
        src: "/techniques/spade-scoop.png",
        alt: "Blue spade scooping sand mixed with white nurdles on the beach",
      },
      {
        src: "/techniques/mesh-bag-wash.png",
        alt: "Purple mesh bag being washed in shallow seawater while wearing a blue glove",
      },
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
  "Community information board — not an official council or emergency-service website. Participate at your own discretion.";
