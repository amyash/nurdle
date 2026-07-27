import type {
  Announcement,
  BeachNeed,
  BriefingEvent,
  BringItem,
  CollectStep,
  CommunityCleanupMessage,
  CommunityImage,
  FaqItem,
  LatestUpdate,
  OrganiserMessage,
  ScientificBriefing,
  TechniqueGuide,
  TrainingVideo,
} from "@/types";

export const whatsappCommunity = {
  label: "Join the community WhatsApp group",
  url: "https://chat.whatsapp.com/KXTZ6zO69si0vNqN0nrc1f",
};

/** Top of Beach cleanup — North Shields tide times for today. */
export const northShieldsTideTimes = {
  title: "Today's tide times for North Shields, England",
  widgetSrc:
    "https://www.tidetimes.co.uk/widget?name=River%20Tyne%20(North%20Shields)&days=1",
  widgetCss: "https://www.tidetimes.co.uk/assets/widget.css",
  sourceUrl: "https://www.tidetimes.co.uk/river-tyne-north-shields-tide-times",
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
    "Photos of what you’ve collected should ideally be posted in the PHOTOS ONLY group of the WhatsApp community, in case we need evidence later on.",
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
  nurdleHunt: {
    beforeLink: "Submit your findings with ",
    linkLabel: "The Great Nurdle Hunt",
    href: "https://www.nurdlehunt.org.uk/take-part/submit-your-finds.html",
  },
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
  headline: "Over 1 Billion Plastic Pellets Released into the River Tyne",
  context: [
    "On 19 July 2026, following a collision between two vessels in the Port of Tyne, an estimated 24 tonnes of plastic pellets—known as nurdles—entered the River Tyne. Around one billion of these tiny plastic pellets have since washed up along beaches across the North East, prompting a huge community-led clean-up effort.",
    "This website brings together the latest community updates, practical guidance and resources to help volunteers respond to the spill. It has been created by volunteers to make it easier to find key information without having to search through hundreds of WhatsApp messages.",
    "The clean-up effort is currently being coordinated by the local community alongside organisations, councils and specialist contractors working on the wider response. Information on this site is updated regularly, but guidance can change quickly, so please check the latest updates before heading to the beach.",
  ],
  actions: [
    {
      id: "join-cleanup",
      title: "1. Join a beach clean",
      body: [
        "Join the community WhatsApp group for beach-specific updates, or head down to help.",
        {
          beforeLink:
            "Community advice: collect in bin bags and place next to the council bins. Large mesh bags work well with shovels; where appropriate use a dustpan and brush. See ",
          linkLabel: "Beach Cleanup",
          afterLink: " page for more info on equipment and methods.",
          href: "/beach-cleanup",
        },
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
        "Always include your name and address at the top.",
        {
          beforeLink:
            "Residents in North Tyneside constituency can write to MP Alan Campbell, or ",
          linkLabel: "find your local councillors",
          afterLink: "",
          href: "https://www.gov.uk/find-your-local-councillors",
        },
      ],
      links: [
        {
          label: "Email MP Alan Campbell",
          href: "mailto:alan.campbell.mp@parliament.uk",
        },
      ],
      emailTemplate: {
        subject:
          "URGENT: Disaster on the Tyne — Over 1 Billion Nurdles (24 Tonnes) on Our Beaches & Demands for Action",
        body: `Dear [Name of MP] MP /

Dear Regional Mayor Kim McGuinness kim@kimmcguinness.org

I am writing to you as a constituent residing in [Your Town/Area] regarding the catastrophic plastic spill originating from the River Tyne. Over 24 tonnes—more than 1 billion raw plastic pellets (‘nurdles’)—are now washing ashore across our local beaches. This is being recognised as the biggest plastic pollution disaster in the history of Northern Europe, yet the response on the ground fails to reflect the magnitude of this crisis.

While funding and money should not be a barrier given the severity and international scope of this disaster, our local response is failing our coastline in critical ways:

1. Lack of Targeted, Tidal-Based Cleanup: We are simply not seeing the necessary large-scale, coordinated cleanup efforts deployed at the appropriate times based on the tides. We need to see councils and relevant authorities responding in force with adequate personnel, proper gear, and specialist equipment.

2. Destructive Machinery Usage Must Stop: Council tractors are still actively being used on the beaches. Heavy machinery churns and compresses the sand, driving these microplastics deeper into lower sand layers where they become impossible to retrieve. This practice must stop immediately.

3. Unmet Community Need: Because no official organisation is leading on-the-ground volunteer operations—with hands currently tied by Environment Agency advice—local residents are stepping into the void. There is an urgent, unofficial call for help specifically for Monday 27th and Tuesday 28th to carry out manual recovery along individual beaches.

We cannot allow red tape to leave 1 billion pellets to wash back into the marine food web.

As my Member of Parliament, I urge you to take immediate action:

* Demand Council & Agency Scale-Up: Push Council, Defra, and the Environment Agency to deploy equipped, organised teams timed around local low/high tides, and immediately halt heavy tractor usage on affected beaches.

* Support Community & Volunteer Operations: Ensure authorities provide clear, safe guidance and logistical backing (such as proper sieves, vacuums, and disposal points) for community efforts, especially for the critical push this Monday and Tuesday.

* Enforce Polluter Liability & Legislative Reform: Ensure the responsible ship operators and insurers cover 100% of remediation costs, and push in Westminster to legally reclassify nurdles as hazardous cargo with mandatory sealed packaging requirements.

I look forward to hearing what urgent steps you are taking to ensure our beaches get the emergency response this crisis demands.

Yours sincerely,
[Your Full Name]
[Your Full Postal Address & Postcode]
[Your Phone Number - Optional]`,
      },
    },
  ],
  notes: [
    "The council tractor is still being used on the beach and this is burying the nurdles deeper. Community organisers say this must stop.",
    "Nobody is able to officially lead this while EA advice is not to touch. This board shares community organiser information only.",
  ],
};

export const scientificBriefing: ScientificBriefing = {
  title: "Scientific Briefing for Volunteers",
  fullBriefingHref: "/docs/nurdles-spill-scientific-briefing.pdf",
  sections: [
    {
      heading: "Environmental risk",
      paragraphs: [
        "The environmental concern is high.",
        "Nurdles: absorb oil, absorb diesel residues, absorb persistent organic pollutants, adsorb heavy organic contaminants.",
        "Marine organisms mistake them for food.",
        "Affected wildlife may include: seabirds, fish, crabs, shellfish and marine mammals indirectly through the food chain. [1]",
        "Potential impacts include: Digestive blockage, starvation, reduced reproduction, transfer of pollutants through the food web and fragmentation into microplastics.",
        "These long-term ecological effects are why nurdle spills are treated as major environmental incidents.",
      ],
    },
    {
      heading: "Why is this considered a serious environmental incident?",
      paragraphs: [
        "Although each pellet is tiny, the scale is enormous:",
      ],
      bullets: [
        "Approximately 1,000,000,000 pellets. Roughly 25 tonnes.",
        "Capable of spreading over many kilometres of coastline.",
        "Extremely difficult to recover completely.",
        "Marine scientists regard nurdle spills as one of the most persistent forms of plastic pollution because the pellets continue circulating between beaches and the sea for years.",
      ],
    },
    {
      heading: "Key message",
      paragraphs: [
        "This incident is not simply a litter problem. It is a significant marine pollution event resulting from a shipping accident. Every properly collected bag of pellets helps reduce the amount available to enter the food chain or break down into microplastics.",
      ],
    },
    {
      heading: "Why were volunteers initially advised not to collect them?",
      paragraphs: ["Early in the response, authorities needed to:"],
      bullets: [
        "Assess the extent of contamination.",
        "Preserve evidence for the investigation.",
        "Avoid spreading pellets inadvertently.",
        "Prevent damage to sensitive habitats.",
        "Establish safe disposal procedures.",
      ],
    },
    {
      heading: "",
      paragraphs: [
        "As organised clean-up plans developed, volunteer participation became more structured in many areas.",
      ],
    },
  ],
};

/**
 * Announcements feed — newest first.
 * Link to General WhatsApp for polls and day-of coordination.
 */
export const announcements: Announcement[] = [
  {
    id: "alan-campbell-office-response",
    datetime: "2026-07-27T16:55:00+01:00",
    sourceName: "LMB",
    expandable: true,
    headline: "Response from Alan Campbell’s office.",
    blocks: [
      {
        type: "p",
        parts: [
          "I know many residents are deeply concerned about the environmental incident affecting our coastline following the collision of two ships at the Port of Tyne, which resulted in the release of millions of plastic pellets into the River Tyne.",
        ],
      },
      {
        type: "p",
        parts: ["I wanted to update you on what has happened so far."],
      },
      {
        type: "bullets",
        items: [
          [
            "I have spoken directly with the Secretary of State for Environment, Food and Rural Affairs (DEFRA) to raise the seriousness of this incident and the impact it is having on our communities and coastline.",
          ],
          [
            "I have been in regular contact with the Port of Tyne, the Environment Agency, and the two affected local authorities to ensure I receive the latest information and to press for a swift and effective response.",
          ],
          [
            "I have sought assurances that every possible effort is being made to clean up the pollution and to keep the public informed of any risks.",
          ],
          [
            "I have been advised that, at present, there is no evidence that the plastic pellets are toxic, but I recognise the significant concern surrounding their environmental impact and the effect on our beaches and wildlife.",
          ],
          [
            "I have formally asked DEFRA to provide any support necessary to local agencies undertaking the clean-up operation and to be prepared to step in with additional assistance if required.",
          ],
          [
            "I have also stressed the importance of ensuring that, should the ongoing investigation determine liability, the polluter pays for the clean-up and remediation work, rather than local taxpayers bearing the cost.",
          ],
          [
            "Finally, I have called for the Government to review the transportation of plastic pellets, often known as nurdles, and to consider whether current arrangements adequately reflect the environmental risks posed when spills occur.",
          ],
        ],
      },
      {
        type: "p",
        parts: [
          "I will continue to monitor the situation closely, press for a thorough clean-up of affected areas, and keep constituents informed as further information becomes available. Protecting our coastline and ensuring accountability for environmental damage remain my priorities.",
        ],
      },
    ],
  },
  {
    id: "high-tide-volunteer-windows-jul-27",
    datetime: "2026-07-27T15:08:00+01:00",
    sourceName: "Sally Yonder · Community admin",
    headline:
      "We will need volunteers on all the beaches just after high tide twice a day every day leading up to the highest tide on Saturday.",
    blocks: [
      {
        type: "md",
        parts: [
          "Suggested following times we are using as a guideline. This can be applied to all beaches, rocky inlets etc. you can come before or after, just come 🙏",
        ],
      },
      {
        type: "bullets",
        items: [
          ["⚡️ Monday 27th ~ 4pm -8pm"],
          ["⚡️ Tuesday 28th ~ 6am - 10am & 4pm - 8pm"],
          ["⚡️ Wednesday 29th ~ 6am - 10am & 4.45 - 9pm"],
          ["⚡️ Thursday 30th ~ 6am - 10am & 5.30pm - 9.30pm"],
          ["⚡️ Friday 31st ~ 6am - 10am & 6.15pm - 9.30pm"],
          ["⚡️ Saturday 1st ~ 6am - 10am & 6.30pm - 9.30pm"],
        ],
      },
      {
        type: "p",
        parts: [
          "This is community led: see the ‘group description’ for your beach and in ‘general’ for FAQs, guidelines, equipment to use and what to expect.",
        ],
      },
    ],
  },
  {
    id: "longsands-monday-volunteer-effort",
    datetime: "2026-07-26T19:06:00+01:00",
    sourceName: "Sally · Community admin",
    headline:
      "There is a major volunteer effort kicking off from 6am Monday morning",
    blocks: [
      {
        type: "md",
        parts: [
          "Longsands at the High Tide Line starting from Crusoe’s to clear nurdle plastic pollution from our beaches and everyone in Tynemouth has a part to play.",
        ],
      },
      {
        type: "sm",
        parts: [
          "More teams are being assembled and will branch off to other beaches, so watch out for information including ",
          { bold: "Monday afternoon after the second high tide." },
        ],
      },
      {
        type: "bullets",
        intro: [
          {
            bold: "Based on expert advice the organisers have come to the conclusion that:",
          },
        ],
        items: [
          [
            "The insurers' contractors are equipped and staffed only to handle the Fish Quay, and nearly all of the equipment needed in the North East is unlikely to be here for days. We can leave the Fish Quay to them, but ",
            {
              bold: "Tynemouth needs to step up — nobody else will.",
            },
          ],
          [
            "The tides this week, in particular Monday and Tuesday, present a golden opportunity to put a dent in this, which otherwise we will regret. Residents here would never forgive ourselves if we let that happen.",
          ],
          [
            "With each high tide this week, more and more pellets will refloat and form the neat lines along the high tide mark, making them easy for volunteers to sweep up.",
          ],
          [
            "It's been possible to locally manufacture enough filtering bags this weekend to support a big effort. Enough people who have already been volunteering have developed experience using them.",
          ],
          [
            "There's scope for less experienced volunteers to sweep up material with just a couple of minutes' training (",
            { bold: "without touching a single pellet" },
            "). You brush/scrape it; they will filter out the pellets.",
          ],
        ],
      },
      {
        type: "p",
        parts: [
          "So, if you have some time to spare before work, please come down. Don't expect perfection, but do come and help.",
        ],
      },
      {
        type: "lg",
        parts: ["A few do's and don'ts:"],
      },
      {
        type: "numbered",
        items: [
          [
            { bold: "Don't step on the nurdles." },
            " This is the one thing which can make the situation worse. With the beaches in heavy use, this has happened too much.",
          ],
          [
            {
              bold: "Do wear gloves (there will be plenty available, or bring your own).",
            },
            " It's not essential but helps the organisers minimise the amount of supervision less experienced volunteers need.",
          ],
          [{ bold: "Do wash your hands" }, " when finished."],
          [
            {
              bold: "Do leave the filtering to the more experienced volunteers",
            },
            " running the operation — this is more complicated.",
          ],
          [
            {
              bold: "If possible, bring a dustpan (and brush). You'll learn why...",
            },
          ],
        ],
      },
      {
        type: "p",
        parts: [
          "This is not a small problem. The effects are long term and will be reduced by prompt action.",
        ],
      },
      {
        type: "p",
        parts: [
          "The insurers have not brought enough resources to bear early enough, and there's nothing we can do about that. Nurdles that embed into the beaches will break down into microplastics over decades.",
        ],
      },
      {
        type: "p",
        parts: [
          "We will likely experience a sustained period of this material coming ashore. There is still a substantial amount in the Tyne and the sea which will come out in waves as the tides move. Even after the first stage of this ends, storms will bring it back several times over the coming years.",
        ],
      },
      {
        type: "lg",
        parts: [
          "We are still in the short window where volunteers will make a difference. Please consider helping.",
        ],
      },
      { type: "divider" },
      {
        type: "lg",
        parts: ["Longsands Beach — volunteer times"],
      },
      {
        type: "p",
        parts: [
          "We are asking that volunteers head to Longsands Beach at the following times.",
        ],
      },
      {
        type: "p",
        parts: [
          "We have equipment to distribute and techniques to share that can then be taken to the other beaches accordingly.",
        ],
      },
      {
        type: "p",
        parts: [
          "Please vote for the time(s) you can make in the General WhatsApp group poll.",
        ],
      },
    ],
    link: {
      label: "Open General WhatsApp to fill out the poll",
      href: "https://chat.whatsapp.com/KXTZ6zO69si0vNqN0nrc1f",
    },
  },
];
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
    region: "north-tyneside",
  },
  {
    id: "longsands",
    name: "Longsands",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: "Monday & Tuesday — details on group",
    whatsappUrl: "https://chat.whatsapp.com/KtraHXq8Q3R6JrANxkzi8N",
    region: "north-tyneside",
  },
  {
    id: "cullercoats",
    name: "Cullercoats",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: "Monday & Tuesday — details on group",
    whatsappUrl: "https://chat.whatsapp.com/LJIE5xqsqWmGAIl2pLt4t2",
    region: "north-tyneside",
  },
  {
    id: "seaton-sluice",
    name: "Seaton Sluice",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: "Monday & Tuesday — details on group",
    whatsappUrl: null,
    region: "north-tyneside",
  },
  {
    id: "cambois",
    name: "Cambois",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/C9bWFyadyH15kgIR1QTBLQ",
    region: "north-tyneside",
  },
  {
    id: "newbiggin",
    name: "Newbiggin",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/F3BpZ4dw3gmGlqTM7rPftx",
    region: "north-tyneside",
  },
  {
    id: "haven-beach",
    name: "Haven Beach",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/IUp4YAxs7Yo7vZAqeO6Z1I",
    region: "north-tyneside",
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/K2lktDs5NAj7UG1SYoDYwh",
    region: "north-tyneside",
  },
  {
    id: "fish-quay",
    name: "Fish Quay",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/E3UFrnJFRE719lT7BztWoo",
    region: "north-tyneside",
  },
  {
    id: "blyth",
    name: "Blyth",
    need: "Check WhatsApp for beach-specific updates",
    nextWindow: null,
    whatsappUrl: null,
    region: "north-tyneside",
  },
  {
    id: "browns-jackeys",
    name: "Brown’s Bay / Jackey’s Bay",
    need: "Check WhatsApp for beach-specific updates",
    nextWindow: null,
    whatsappUrl: null,
    region: "north-tyneside",
  },
  {
    id: "south-tyneside",
    name: "South Tyneside",
    need: "Help needed — join this beach WhatsApp group",
    nextWindow: null,
    whatsappUrl: "https://chat.whatsapp.com/Kfd0BABx0dTH9Q9UgUks4r",
    region: "south-tyneside",
  },
];

export const beachGroupRegions = [
  { id: "north-tyneside" as const, title: "North Tyneside" },
  { id: "south-tyneside" as const, title: "South Tyneside" },
];

export const whatToBringIntro = "Whatever you have available.";

export const whatToBring: BringItem[] = [
  { id: "sweep", item: "Brooms" },
  { id: "buckets", item: "Large buckets" },
  { id: "spades", item: "Spades" },
  { id: "dustpan", item: "Dustpans and brushes" },
  { id: "mesh", item: "Mesh bags" },
  { id: "sieves", item: "Sieves, colanders" },
  { id: "gloves", item: "Wear wellies and gloves" },
  { id: "bags", item: "Heavy-duty bin bags" },
  {
    id: "labels",
    item: "Labels stating “volunteers collected” — labelling with tape and marker will suffice",
  },
];

export const howToCollectIntro =
  "Avoid treading nurdles into the sand as best you can.";

export const howToCollect: CollectStep[] = [
  {
    step: 1,
    text: "Get out after high tide, every day if you can, and focus on clearing nurdles left at the high tide line.",
  },
  {
    step: 2,
    text: "DON'T STEP ON THE NURDLES! (We can't emphasise this enough)",
  },
  {
    step: 3,
    text: "Wear gloves (and wash your hands when you're finished).",
  },
  {
    step: 4,
    text: "Use sweeping brushes and/or dustpan and brush to collect the nurdles (see tips on techniques below).",
  },
  {
    step: 5,
    text: "If possible/appropriate, leave the filtering to more experienced volunteers and focus on collecting.",
  },
  {
    step: 6,
    text: "Bag nurdles into heavy-duty bin bags, label with 'volunteer collected', secure and leave next to council bins for collection.",
  },
  {
    step: 7,
    text: "Report bagged litter to North Tyneside Council: On the interactive map on their ‘Report it’ portal (under fly tipping or overflowing bins in the Litter and Full bins section). Or use the QR code on the bin if available.",
    cta: {
      label: "Report rubbish bags",
      href: "https://www.northtyneside.gov.uk/residents/report-it",
    },
  },
];

/** Replace null urls with public video links when ready. */
export const trainingVideos: TrainingVideo[] = [
  {
    id: "video-2",
    title: "Sift nurdles in dry sand with mesh bag",
    duration: "Watch on YouTube",
    url: "https://youtube.com/shorts/No1TWSeSfUI",
    note: "",
  },
];

/** Written cleanup techniques with optional photos. */
export const techniqueGuides: TechniqueGuide[] = [
  {
    id: "scrape-wet",
    title: "Scrape nurdles up from wet sand",
    steps: [
      "Use a flat broom, back of rake or even plank of wood",
      "Carefully scrape up the lines of nurdles",
      "Sweep up nurdles and place in labelled bin bag",
    ],
    images: [
      {
        src: "/techniques/broom-scrape.webp",
        alt: "Wooden broom scraping white nurdles across wet beach sand",
      },
    ],
    videos: [
      {
        title: "Scrape nurdles on wet sand with broom",
        url: "https://youtu.be/Ora2gOhBJcc",
      },
      {
        title: "Scrape nurdles on wet sand with back of rake",
        url: "https://youtube.com/shorts/hiGc1oj68kA",
      },
      {
        title: "Scrape nurdles on wet sand with a plank",
        url: "https://youtu.be/XW4cJDxCEZk",
      },
    ],
  },
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
        src: "/techniques/bucket-seawater.webp",
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
        src: "/techniques/spade-scoop.webp",
        alt: "Blue spade scooping sand mixed with white nurdles on the beach",
      },
      {
        src: "/techniques/mesh-bag-wash.webp",
        alt: "Purple mesh bag being washed in shallow seawater while wearing a blue glove",
      },
    ],
  },
  {
    id: "keep-work-manageable",
    title: "Keep work manageable",
    steps: [],
    description:
      "Draw a square in the sand to work on, complete it, move on and repeat. Keeps the task bitesize and measurable.",
    images: [
      {
        src: "/techniques/sand-square.webp",
        alt: "Cleanup tools inside a square drawn in beach sand to mark a small work area",
      },
    ],
  },
  {
    id: "mesh-bag-tutorial",
    title: "Mesh bag tutorial",
    steps: [],
    description:
      "This quick video provides guidance on sewing mesh bags to filter out the sand and seawater, leaving the plastic pellets in the bag. We have a dedicated WhatsApp group for volunteers sewing mesh bags.",
    instagramUrl: "https://www.instagram.com/reels/DbQcPcBohWc/",
    cta: {
      label: "Mesh bag WhatsApp group",
      href: "https://chat.whatsapp.com/Cegcib5ZtWoAopGYGSTjuk",
    },
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
      "Community organiser advice is to collect in heavy-duty bin bags and place them next to the council bins. Make sure the bags are clearly labeled as having been volunteer collected. Join the WhatsApp group for the latest method discussion.",
    highlight: "Make sure the bags are clearly labeled as having been volunteer collected.",
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

/** Intro copy above the gallery on /community-images. */
export const communityImagesIntro = {
  heading: "Photos needed",
  paragraphs: [
    {
      parts: [
        {
          type: "text" as const,
          value:
            "Please take photos of the nurdles to document the damage. Remember to note the date, time and location. Recommended to use ",
        },
        {
          type: "link" as const,
          label: "what3words",
          href: "https://what3words.com/",
        },
        {
          type: "text" as const,
          value:
            " for exact location information. There is a dedicated group called ",
        },
        {
          type: "link" as const,
          label: "PHOTOS ONLY",
          href: "https://chat.whatsapp.com/Bu3PVQzDvbF03k6f0NTvgK",
        },
        {
          type: "text" as const,
          value: " in the community WhatsApp.",
        },
      ],
    },
    {
      parts: [
        {
          type: "text" as const,
          value: "Submit your findings with ",
        },
        {
          type: "link" as const,
          label: "The Great Nurdle Hunt",
          href: "https://www.nurdlehunt.org.uk/",
        },
        {
          type: "text" as const,
          value: ".",
        },
      ],
    },
  ],
  galleryCaption: "Photos from volunteers on our beaches.",
};

/** Community photos — masonry gallery on /community-images. */
export const communityImages: CommunityImage[] = [
  {
    id: "volunteers-broom",
    src: "/community/volunteers-broom.webp",
    alt: "Volunteers cleaning Longsands Beach with a yellow broom in the foreground and St George's Church behind",
  },
  {
    id: "caution-sign",
    src: "/community/caution-sign.webp",
    alt: "North Tyneside Council yellow caution sign about plastic pellets washed ashore",
  },
  {
    id: "handful-nurdles",
    src: "/community/handful-nurdles.webp",
    alt: "Open hand holding a cluster of white nurdles on a rocky beach",
  },
  {
    id: "crowd-tide-line",
    src: "/community/crowd-tide-line.webp",
    alt: "Large group of volunteers working along the high tide line on a sunny beach",
  },
  {
    id: "volunteer-blonde-mesh",
    src: "/community/volunteer-blonde-mesh.webp",
    alt: "Volunteer in gloves searching sand for nurdles beside a yellow bucket",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "bucket-filter",
    src: "/community/bucket-filter.webp",
    alt: "Two young volunteers filtering nurdles with a sieve over an orange bucket of seawater",
  },
  {
    id: "longsands-overview",
    src: "/community/longsands-overview.webp",
    alt: "Wide view of Longsands Beach with volunteers dotted along the shore",
  },
  {
    id: "beach-church-overview",
    src: "/community/beach-church-overview.webp",
    alt: "Elevated view of volunteers on the beach with St George’s Church on the cliff",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "scrubbing-rock",
    src: "/community/scrubbing-rock.webp",
    alt: "Volunteer in wellies scrubbing seaweed from a rock into a bin bag of nurdles",
  },
  {
    id: "bowl-nurdles",
    src: "/community/bowl-nurdles.webp",
    alt: "Close-up of collected white nurdles mixed with sand in a bowl",
  },
  {
    id: "rocky-shore-nurdles",
    src: "/community/rocky-shore-nurdles.webp",
    alt: "Nurdles scattered across seaweed-covered rocks on the shore",
  },
  {
    id: "volunteer-bags",
    src: "/community/volunteer-bags.webp",
    alt: "Pile of black bags labelled Volunteers Collected next to council bins on the promenade",
  },
  {
    id: "volunteer-kneeling-yellow",
    src: "/community/volunteer-kneeling-yellow.webp",
    alt: "Volunteer kneeling on the beach collecting nurdles with a yellow container, St George’s Church behind",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "nurdle-line-close",
    src: "/community/nurdle-line-close.webp",
    alt: "White nurdles forming lines along damp beach sand",
  },
  {
    id: "volunteer-sieve-cap",
    src: "/community/volunteer-sieve-cap.webp",
    alt: "Volunteer kneeling on the beach filtering sand through a metal sieve",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "volunteers-broom-dog",
    src: "/community/volunteers-broom-dog.webp",
    alt: "Volunteers cleaning the beach, one carrying a broom and bag",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "volunteers-group-seaweed",
    src: "/community/volunteers-group-seaweed.webp",
    alt: "Group of volunteers working along seaweed lines on a sunny beach",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "volunteers-green-bucket",
    src: "/community/volunteers-green-bucket.webp",
    alt: "Volunteers with a green bucket and yellow broom on the beach near Cullercoats",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "mesh-bag-bucket-shovel",
    src: "/community/mesh-bag-bucket-shovel.webp",
    alt: "Volunteer lifting a mesh bag from a water-filled bucket beside a shovel",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "mesh-bag-hands",
    src: "/community/mesh-bag-hands.webp",
    alt: "Gloved hands holding a mesh bag filled with seaweed and white nurdles",
  },
  {
    id: "beach-wide-volunteers",
    src: "/community/beach-wide-volunteers.webp",
    alt: "Wide view of many volunteers cleaning along the shoreline",
    credit: "Photo by Laura Moscrop",
  },
  {
    id: "volunteers-mesh-group",
    src: "/community/volunteers-mesh-group.webp",
    alt: "Volunteers kneeling on the beach sifting sand with mesh bags and bowls",
  },
  {
    id: "crowd-tide-line-clouds",
    src: "/community/crowd-tide-line-clouds.webp",
    alt: "Large group of volunteers cleaning along the high tide line under a cloudy sky",
  },
  {
    id: "volunteers-lighthouse-view",
    src: "/community/volunteers-lighthouse-view.webp",
    alt: "Volunteers cleaning the beach with St Mary’s Lighthouse visible in the distance",
  },
  {
    id: "promenade-briefing",
    src: "/community/promenade-briefing.webp",
    alt: "Volunteers gathered on the promenade for a beach cleanup briefing",
  },
  {
    id: "volunteers-line-sifting",
    src: "/community/volunteers-line-sifting.webp",
    alt: "Line of volunteers kneeling on the sand sifting for nurdles",
  },
  {
    id: "crowd-terrace-sky",
    src: "/community/crowd-terrace-sky.webp",
    alt: "Crowd of volunteers on the beach with terrace houses on the cliff behind",
  },
  {
    id: "busy-beach-dramatic-sky",
    src: "/community/busy-beach-dramatic-sky.webp",
    alt: "Busy beach cleanup with volunteers, bags and buckets under a dramatic sky",
  },
  {
    id: "seaweed-cleanup-cliffs",
    src: "/community/seaweed-cleanup-cliffs.webp",
    alt: "Volunteers rinsing seaweed and collecting nurdles near rocky cliffs",
  },
  {
    id: "beach-huddle-flag",
    src: "/community/beach-huddle-flag.webp",
    alt: "Large group of volunteers gathered on the sand beside a red and yellow flag",
  },
  {
    id: "long-line-tide-mark",
    src: "/community/long-line-tide-mark.webp",
    alt: "Long line of volunteers working along the tide mark on a wide sandy beach",
  },
  {
    id: "rnli-station-cleanup",
    src: "/community/rnli-station-cleanup.webp",
    alt: "Volunteers cleaning the beach in front of the RNLI lifeboat station",
  },
  {
    id: "rnli-clocktower-volunteers",
    src: "/community/rnli-clocktower-volunteers.webp",
    alt: "Volunteers with bags and buckets cleaning near the RNLI clock tower building",
  },
  {
    id: "volunteers-lighthouse-overcast",
    src: "/community/volunteers-lighthouse-overcast.webp",
    alt: "Volunteers sifting sand on an overcast beach with a lighthouse on the horizon",
  },
];
