import type {
  Announcement,
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
          href: "/how-to-clean",
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
        label: "EMAIL TEMPLATE FOR COUNCILLORS & MPs",
        subject:
          "URGENT: Port of Tyne Nurdle Disaster — Inadequate Official Response & Critical Action Needed",
        body: `Dear [Name of Councillor / MP],

I am writing to you as a constituent residing in [Your Town/Area] to express my deep frustration regarding the major plastic spill originating from the River Tyne. Following the vessel collision, over 24 tonnes—an estimated 1 billion raw plastic pellets ('nurdles')—were released into our marine ecosystem.

As reported by the BBC ("Plea for action over billion plastic pellets washed up on beaches"), and as witnessed firsthand by community members on the ground, the current response from local councils and national agencies is drastically insufficient.

What are our local councils and responsible agencies actually doing right now? The reality is that official action remains largely passive, reliant on monitoring and minimal surface measures, leaving unpaid volunteers to shoulder the physical burden of Northern Europe’s largest microplastic disaster.

Official Notice to Mariners logs and emergency records from the Port of Tyne expose severe systemic failures in the disaster response:

Timeline Delays & Administrative Lag: Significant operational gaps occurred between initial detection and deployment. Critical hours were lost to administrative approvals, risk assessments, and multi-agency coordination delays while billions of pellets drifted unchecked.

Reactive Containment: Rather than deploying immediate, large-scale booming systems at the river source, the response was reactive. Physical barriers arrived days late—long after ocean currents and winds had dispersed the plume across vast coastal stretches.

Resource & Logistics Constraints: There was a lack of pre-positioned, industrial-scale microplastic recovery equipment (such as specialised sifting or vacuum units).

Communication Bottlenecks: Fragmented information flow between initial observers, local authorities, and central environmental agencies severely delayed the escalation required for a disaster of this scale.

1. It is critical to understand the biological timeline of this spill: while raw plastic pellets are not inherently toxic when first dropped, they can become toxic the longer they remain in the water.

Toxin Accumulation Over Time: As floating nurdles drift, their hydrophobic surfaces act like sponges, absorbing persistent organic pollutants (POPs) and heavy metals from seawater.

Pathogen Reservoirs: Over weeks and years, nurdles develop a biological coating (biofilm or "Plastisphere") that could harbour dangerous human pathogens, including E. coli and Vibrio species, creating a growing public health hazard on public bathing beaches.

Seabed Burial: As bio-fouling increases their weight, wave action eventually sinks these pellets into seabed sediments, where they cause permanent ecological damage to benthic life that is virtually impossible to fix.

Indefinite Persistence: Unlike oil spills, which eventually dissipate or biodegrade, plastic pellets stay in nature indefinitely, continually breaking down into microplastics.

2. What Is Being Done Right Now Is Not Enough
A few static booms placed days late on the river do not stop the continuous re-deposition of nurdles with every high tide. Councils cannot rely on residents spending hours on their knees with kitchen sieves to solve an industrial marine disaster. We need active, high-capacity estuarine recovery machinery, skimmers, and specialised containment working directly in the river mouth now before these pellets permanently embed into our coastal ecosystems.

3. Urgent Demands for Local & Parliamentary Action
I call on you to urgently demand the following from the Councils, Defra, the Environment Agency, and the Maritime and Coastguard Agency (MCA):
Escalate River-Source Recovery.
Provide Full Support for Volunteer Logistics
Enforce Full Corporate Liability & Legislative Reform

Volunteers cannot be expected to carry the burden of a major industrial marine spill while official agency responses remain stalled in administrative delay. I look forward to hearing what direct steps you are taking to hold agencies accountable and escalate recovery efforts immediately.

Yours sincerely,
[Your Full Name]
[Your Full Postal Address & Postcode]
[Your Phone Number - Optional]`,
      },
    },
    {
      id: "sign-petition",
      title: "3. Sign zero plastic pellet loss petition",
      body: [
        "Help keep this issue on the national agenda by signing the official UK Parliament petition.",
      ],
      links: [
        {
          label: "Sign here",
          href: "https://petition.parliament.uk/petitions/759563",
        },
      ],
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
    id: "sally-what-now-jul-30",
    datetime: "2026-07-30T18:25:00+01:00",
    sourceName: "Sally Yonder · Community admin",
    headline: "⚡️ What now? ⚡️",
    blocks: [
      {
        type: "lg",
        parts: ["Is there an end?!"],
      },
      {
        type: "p",
        parts: [
          "We have it under good authority that the sense of urgency and the need for ‘two tidal sessions a day’ cleans will end on Monday as the tides switch. Instead there will be a need for weekly cleans for those that are able to support and continued individual collecting.",
        ],
      },
      {
        type: "p",
        parts: [
          "Sadly this does not mean the situation will go away it means that we will have these nurdles in our world for a long time to come but we have done our absolute best. Where others that are paid to act and failed this community has shown exceptional initiative, passion, creativity, leadership, skills, resilience - we’ve thrown the kitchen sink at it and we cannot be disheartened by that. Ever.",
        ],
      },
      {
        type: "p",
        parts: [
          "By Monday the expectation is that the groups that have formed within this near 2000 person strong WhatsApp Community - (and what fun we’ve had 🤝🙌🤯😅☹️⚡️😮‍💨😫😥) will be supported in splitting into their own sub groups - hopefully with an umbrella overview to support and continue pursing policy change and holding those in positions of responsibility accountable.",
        ],
      },
      {
        type: "lg",
        parts: ["⚡️We have one final push ⚡️"],
      },
      {
        type: "p",
        parts: [
          "I would like us to focus our attention also to the Port of Tyne specifically. According to the BBC It took three days to acknowledge the spill. It took a further two days - to get acting. Where fast acting efforts could have been made, our river, our seas, beaches and wild life were failed.",
        ],
      },
      {
        type: "p",
        parts: [
          "Not only this but there are STILL thousands of nurdles in the river despite voluntary efforts being made to step up, they have been asked instead to step down by the Port of Tyne.",
        ],
      },
      {
        type: "p",
        parts: [
          "The nurdles that are in the river can easily be collected - they are floating. We have it on good authority that they can be collected if given the chance to step in.",
        ],
      },
      {
        type: "lg",
        parts: ["⚡️Sign the community open letter ⚡️"],
      },
      {
        type: "p",
        parts: [
          "Urgently sign our Open Letter written on behalf of this community addressed to the Port of Tyne demanding that they allow trained volunteers into the river to do their job and clean the nurdles from the source.",
        ],
      },
      {
        type: "lg",
        parts: ["YOU ARE ALL NORTH EAST LEGENDS"],
      },
    ],
  },
  {
    id: "lou-morning-cleans-jul-29",
    datetime: "2026-07-29T21:30:00+01:00",
    sourceName: "Lou · Community admin",
    headline: "North Tyneside beaches having cleans in the morning:",
    blocks: [
      {
        type: "bullets",
        items: [
          [
            "Whitley Bay — Panama swim club from 6am (Guardian covering from 8am)",
          ],
          ["Cullercoats — from 7am"],
          ["Longsands — from early"],
          ["King Eddie's — from 7am"],
          ["Fish Quay — from early"],
        ],
      },
      {
        type: "bullets",
        intro: ["Small groups and individual nurdling at"],
        items: [
          ["Blyth from 6am (small group)"],
          ["Seaton Sluice morning anytime (individuals)"],
          ["Newbiggin"],
        ],
      },
      {
        type: "bullets",
        intro: ["Checking and keeping an eye on:"],
        items: [["Druridge Bay"]],
      },
      {
        type: "p",
        parts: [
          "If you can't Nurdle but can report back from these locations, especially the ones with fewer people with a rough nurdle count that's great. Use general channel or the specific channel for that beach.",
        ],
      },
    ],
  },
  {
    id: "community-press-release-jul-28",
    datetime: "2026-07-28T20:16:00+01:00",
    sourceName: "Community announcement",
    headline: "Community press release",
    headlineHref: "/press-release",
  },
  {
    id: "ntc-official-guidance-jul-28",
    datetime: "2026-07-28T07:46:00+01:00",
    sourceName: "Community announcement",
    expandable: true,
    headline: "Official Guidance from North Tyneside Council",
    body: [
      "This page contains the latest official updates and guidance from North Tyneside Council.",
    ],
    link: {
      label: "Open North Tyneside Council guidance",
      href: "https://www.northtyneside.gov.uk/plastic-pellets-beaches-nurdles",
    },
  },
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

export const whatToBringIntro = "Whatever you have available.";

export const whatToBring: BringItem[] = [
  { id: "sweep", item: "Brooms" },
  { id: "buckets", item: "Large buckets" },
  { id: "spades", item: "Spades" },
  { id: "dustpan", item: "Dustpans and brushes" },
  { id: "mesh", item: "Mesh bags" },
  { id: "sieves", item: "Sieves, colanders" },
  { id: "bags", item: "Heavy-duty bin bags" },
  { id: "gloves", item: "Wear wellies and gloves" },
  {
    id: "labels",
    item: "Labels stating “volunteers collected” — labelling with tape and marker will suffice",
  },
  {
    id: "dress",
    item: "Dress appropriately depending on weather conditions",
  },
];

export const howToCollectIntro =
  "Avoid treading nurdles into the sand as best you can.";

/** Ecosystem care guidance shown under How to collect. */
export const ecosystemProtection = {
  title: "Protect our ecosystems when collecting Nurdles",
  blocks: [
    {
      heading: "On digging",
      text: "Please avoid digging or taking mechanical approaches.",
    },
    {
      heading: "Wet sand",
      text: "The damp intertidal band (the sand exposed between tides) is the most biologically productive part of the beach. It is packed with burrowing infauna — lugworms, ragworms, cockles, tellins, razor clams, sandhoppers — which are the main food supply for wading birds and inshore fish. Turning or excavating this sand kills and exposes those buried animals directly, and it flips oxygen-poor sediment up to the surface.",
    },
    {
      heading: "Move and remove as little seaweed as possible.",
      text: "Seaweed is a vital part of our beach ecosystem. It's home to lots of helpful tiny life forms and the local birds too! Pick it up, shake it into a bucket to catch nurdles, remove nurdles from under it, and put it back.",
    },
  ],
} as const;

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
    text: {
      beforeLink:
        "Bag nurdles into heavy-duty bin bags, label with 'volunteer collected', secure and leave at closest council-recommended collection point. (",
      linkLabel: "Report bags",
      afterLink: " that are not at a collection point.)",
      href: "https://www.northtyneside.gov.uk/residents/report-it",
    },
    cta: {
      label: "See collection points on Beaches",
      href: "/beaches",
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
  },
  {
    id: "bucket-float",
    title: "Bucket and sieve method",
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
    title: "Mesh filter bag method",
    steps: [
      "Scoop the top layer of sand and nurdles with a spade.",
      "Put the mix into a mesh bag and wash it in seawater so sand falls through and nurdles stay in the bag.",
      "Empty nurdles into a strong bin bag labelled as a volunteer collection.",
    ],
    notes: [
      "Do not overload the bags - wet sand is heavy, and will stretch even the strongest mesh. Better to do two trips with smaller loads down to the waterline, than one trip which stretches a bag out.",
      "Use small bags for carrying directly into the surf, bigger bags for fitting over a trug or bucket.",
      "If you find Nurdles are passing through mesh bags, use those bags for seaweed capture instead, stretched over a bucket",
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
  {
    id: "removing-nurdles-from-seaweed",
    title: "Removing nurdles from seaweed",
    steps: [],
    videos: [
      {
        title: "Part 1",
        url: "https://youtube.com/shorts/KD2v23qkGXk",
      },
      {
        title: "Part 2",
        url: "https://youtube.com/shorts/2pWfBVlE1aI",
      },
      {
        title: "Part 3",
        url: "https://youtube.com/shorts/zDBkq7Q3hQM",
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

/** Intro copy above the gallery on /photos. */
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

/** Community photos — masonry gallery on /photos. */
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
