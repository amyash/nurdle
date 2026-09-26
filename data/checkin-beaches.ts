/**
 * Predefined beaches for the Beach groups hub (check-in + clean-ups).
 * Coordinates are approximate coastline points for map markers only —
 * not used for GPS tracking.
 *
 * IDs must match rows seeded in supabase/migrations.
 * Add or rename beaches here — the hub UI and map render from this list.
 *
 * Optional `nest` (Nurdle Equipment Station) example:
 *   nest: {
 *     mapsUrl: "https://maps.app.goo.gl/...",
 *     // or multiple links:
 *     locationLinks: [{ label: "The Kiln Studios", url: "https://..." }],
 *     paragraphs: ["The equipment container is located…"],
 *     equipmentIntro: "Most NESTs are stocked with…",
 *     equipment: ["Mesh sieves", "Collection bags"],
 *     notes: ["Please return any borrowed equipment…"],
 *   },
 */
export interface BeachNestLocationLink {
  label: string;
  url: string;
}

/** Northumberland County Council nurdle drop-off (what3words). */
export interface CouncilDropoff {
  name: string;
  w3wUrl: string;
}

export const NORTHUMBERLAND_NURDLE_COLLECTION_URL =
  "https://www.northumberland.gov.uk/news/plastic-pellets-nurdles-countys-beaches-updated-august-19th";

export const NORTHUMBERLAND_DROPOFF_MAP_URL =
  "https://northumberland.maps.arcgis.com/apps/instant/basic/index.html?appid=9a0418203be54af9b382948c70f8367e";

export interface BeachNest {
  /** Single Google Maps link — shown as “Location” when `locationLinks` is omitted. */
  mapsUrl?: string | null;
  /** One or more location links (overrides `mapsUrl` when present). */
  locationLinks?: BeachNestLocationLink[];
  /** Intro / location paragraphs inside the expandable section. */
  paragraphs?: string[];
  /** Optional intro line above the equipment list. */
  equipmentIntro?: string | null;
  /** Kit available at this NEST. */
  equipment?: string[];
  /** Extra notes after the equipment list. */
  notes?: string[];
}

export type BeachRegion = "north-tyneside" | "south-tyneside";

export interface CheckinBeach {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  displayOrder: number;
  /** Card-list grouping on /beaches. */
  region: BeachRegion;
  /** Nurdle Equipment Station details — omit until known. */
  nest?: BeachNest | null;
  /** Council places to leave collected nurdles. */
  councilDropoffs?: CouncilDropoff[];
}

export const CHECKIN_EXPIRY_HOURS = 2;

const STANDARD_NEST_KIT = {
  equipmentIntro:
    "Most NESTs are stocked with a selection of the following items.",
  equipment: [
    "Mesh sieves",
    "Collection bags",
    "Gloves",
    "Buckets",
    "Soft brushes",
    "Other donated equipment",
  ],
  notes: [
    "Stock levels may vary, and some items may be temporarily unavailable.",
    "Please return any borrowed equipment to the NEST clean and in good condition so it's ready for the next volunteer.",
    "The mesh bags may be used by the charity Nurdle in response to future nurdle spills.",
  ],
} satisfies Pick<BeachNest, "equipmentIntro" | "equipment" | "notes">;

/** Shared Sunderland BID lockbox copy. Inline [label](url) becomes a link. */
function sunderlandBidNest(entry: "Seaburn" | "Roker", w3wWords: string): BeachNest {
  const w3wUrl = `https://what3words.com/${w3wWords.toLowerCase()}`;
  return {
    locationLinks: [{ label: "what3words", url: w3wUrl }],
    paragraphs: [
      "The NEST equipment box is located in the Coastal Clean Up Crew lockbox. The lockbox is owned by the BID and holds other volunteering equipment. There is an access code which is managed by BID. To request the code, please use this contact form and say that you would like to use the nurdle clean up equipment: [Volunteer With Us - Sunderland BID](https://sunderlandbid.co.uk/volunteer-with-us/)",
      "Once you have the code, the location of the lock box is:",
      `For ${entry} entry - W3W location is [${w3wWords}](${w3wUrl}).`,
    ],
    ...STANDARD_NEST_KIT,
  };
}

const LONGSANDS_NEST: BeachNest = {
  locationLinks: [
    {
      label: "what3words",
      url: "https://w3w.co/physical.captions.branded",
    },
    {
      label: "Google Maps",
      url: "https://maps.app.goo.gl/NSEKW1VCppfncJ7b8",
    },
  ],
  paragraphs: [
    "The Longsands NEST is a community equipment station located at the ramp close to Crusoe's.",
    "The equipment box is stored overnight at the back of Crusoe's, near the brooms, and is usually put out each morning by volunteers.",
    "If you're able to help by putting the box out in the morning or returning it in the evening, please let the beach WhatsApp group know.",
  ],
  equipmentIntro:
    "Most NESTs are stocked with a selection of the following items.",
  equipment: [
    "Mesh sieves",
    "Collection bags",
    "Gloves",
    "Buckets",
    "Soft brushes",
    "Other donated equipment",
  ],
  notes: [
    "Stock levels may vary, and some items may be temporarily unavailable.",
    "Please return any borrowed equipment to the NEST clean and in good condition so it's ready for the next volunteer.",
    "The mesh bags may be used by the charity Nurdle in response to future nurdle spills.",
  ],
};

export const checkinBeaches: CheckinBeach[] = [
  {
    id: "cresswell-to-alnmouth",
    name: "Cresswell to Alnmouth (inc Druridge and Amble)",
    slug: "cresswell-to-alnmouth",
    // Druridge Bay — representative pin for the Cresswell–Alnmouth stretch
    latitude: 55.279,
    longitude: -1.567,
    displayOrder: 1,
    region: "north-tyneside",
    nest: {
      locationLinks: [
        {
          label: "Hauxley Nature Reserve on Google Maps",
          url: "https://maps.app.goo.gl/TSNvPPoaWgCJif7M6",
        },
        {
          label: "Druridge Bay Country Park on Google Maps",
          url: "https://maps.app.goo.gl/yutzuSCo2HwQwASy6",
        },
      ],
      paragraphs: [
        "Hauxley and Druridge Bay have the following NEST boxes.",
        "Hauxley: The Hauxley NEST can be found at the Hauxley Nature Reserve. You can ask at the centre if you can't find it.",
        "Druridge: The Druridge NEST can be found at Druridge Bay Country Park. You can ask at the centre if you can't find it.",
        "If you have any questions, the WhatsApp group for this beach may be able to help.",
      ],
      equipmentIntro:
        "Most NESTs are stocked with a selection of the following items.",
      equipment: [
        "Mesh sieves",
        "Disposable gloves",
        "Buckets",
        "Soft brushes",
        "Mesh filter bags handmade with donated materials by volunteers",
        "Other donated equipment",
      ],
      notes: [
        "Stock levels may vary, and some items may be temporarily unavailable.",
        "Please return any borrowed equipment to the NEST clean and in good condition so it's ready for the next volunteer.",
        "The mesh bags may be used by the charity Nurdle in response to future nurdle spills.",
        "If there is a problem at either of these NESTs please use the WhatsApp group for this location.",
      ],
    },
    councilDropoffs: [
      {
        name: "Amble Dunes",
        w3wUrl: "https://what3words.com/encoded.ourselves.bland",
      },
      {
        name: "Low Hauxley",
        w3wUrl: "https://what3words.com/salmon.scans.totals",
      },
      {
        name: "Druridge: boat compound car park opposite Drift Inn cafe",
        w3wUrl: "https://what3words.com/strongly.streetcar.gestures",
      },
      {
        name: "Druridge: Blakes Burn water outlet",
        w3wUrl: "https://what3words.com/bespoke.jammy.throwaway",
      },
      {
        name: "Cresswell village: public toilet block",
        w3wUrl: "https://what3words.com/river.entrusted.crackles",
      },
    ],
  },
  {
    id: "newbiggin",
    name: "Newbiggin",
    slug: "newbiggin",
    latitude: 55.1845,
    longitude: -1.5098,
    displayOrder: 2,
    region: "north-tyneside",
    nest: {
      locationLinks: [
        {
          label: "Newbiggin Maritime Centre (East) on Google Maps",
          url: "https://maps.app.goo.gl/m7pd12c8FPBhSYrF9",
        },
        {
          label: "Needle's Eye Cafe (West) – what3words",
          url: "https://what3words.com/latter.foreheads.printers",
        },
        {
          label: "Needle's Eye Cafe (West) on Google Maps",
          url: "https://share.google/s9J0ErPkBGIx3AWcX",
        },
      ],
      paragraphs: [
        "There are two NESTs at Newbiggin.",
        "East – Newbiggin Maritime Centre: to the left of the main entrance doors, just outside. The equipment store box is taken in at night and put out in the morning by the staff at the centre.",
        "West – Needle's Eye Cafe: the equipment storage box is located by the dog stick library on the pathway between the cafe and the beach. Thanks to Stephanie and Wayne for hosting. The box is put out when the cafe is open.",
      ],
      equipmentIntro:
        "Most NESTs are stocked with a selection of the following items.",
      equipment: [
        "Mesh sieves",
        "Collection bags",
        "Gloves",
        "Buckets",
        "Soft brushes",
        "Other donated equipment",
      ],
      notes: [
        "Stock levels may vary, and some items may be temporarily unavailable.",
        "Please return any borrowed equipment to the NEST clean and in good condition so it's ready for the next volunteer.",
        "The mesh bags may be used by the charity Nurdle in response to future nurdle spills.",
      ],
    },
    councilDropoffs: [
      {
        name: "Newbiggin Maritime Centre",
        w3wUrl: "https://what3words.com/gamer.finer.pools",
      },
    ],
  },
  {
    id: "cambois",
    name: "Cambois",
    slug: "cambois",
    latitude: 55.1528,
    longitude: -1.5185,
    displayOrder: 3,
    region: "north-tyneside",
    councilDropoffs: [
      {
        name: "Charlton's car park beach access",
        w3wUrl: "https://what3words.com/natively.fade.quarrel",
      },
    ],
  },
  {
    id: "blyth",
    name: "Blyth",
    slug: "blyth",
    latitude: 55.1422,
    longitude: -1.5085,
    displayOrder: 4,
    region: "north-tyneside",
    nest: {
      paragraphs: [
        "Thanks to Robin, who has generously offered to store the Blyth NEST equipment at his home.",
        "If you need to borrow or return equipment, please contact Robin on [07843 411770] to arrange a convenient time.",
        "As this is a volunteer's home, please be respectful and return all equipment clean and in good condition.",
      ],
      equipmentIntro:
        "Most NESTs are stocked with a selection of the following items.",
      equipment: [
        "Mesh sieves",
        "Collection bags",
        "Gloves",
        "Buckets",
        "Soft brushes",
        "Other donated equipment",
      ],
    },
    councilDropoffs: [
      {
        name: "Blyth Beach: Dave Stephens Centre",
        w3wUrl: "https://what3words.com/less.ants.degree",
      },
      {
        name: "Blyth: South Harbour",
        w3wUrl: "https://what3words.com/doors.anyone.farms",
      },
    ],
  },
  {
    id: "seaton-sluice",
    name: "Seaton Sluice",
    slug: "seaton-sluice",
    latitude: 55.0825,
    longitude: -1.4745,
    displayOrder: 5,
    region: "north-tyneside",
    nest: {
      locationLinks: [
        {
          label: "what3words",
          url: "https://what3words.com/aside.snow.long",
        },
      ],
      paragraphs: [
        "The Seaton Sluice NEST can be found at the Seaton Sluice Fountain Head car park next to the nurdle collection bin provided by the council.",
        "If you have any questions, the WhatsApp group for this beach may be able to help or get in touch with Jennifer Stobbs at [07746 099109] or jenstobbs@hotmail.co.uk.",
      ],
      equipmentIntro:
        "Most NESTs are stocked with a selection of the following items.",
      equipment: [
        "Mesh sieves",
        "Collection bags",
        "Gloves",
        "Buckets",
        "Soft brushes",
        "Other donated equipment",
      ],
      notes: [
        "Stock levels may vary, and some items may be temporarily unavailable.",
        "Please return any borrowed equipment to the NEST clean and in good condition so it's ready for the next volunteer.",
        "The mesh bags may be used by the charity Nurdle in response to future nurdle spills.",
      ],
    },
  },
  {
    id: "st-marys-lighthouse",
    name: "St Mary’s Lighthouse",
    slug: "st-marys-lighthouse",
    latitude: 55.0718,
    longitude: -1.4495,
    displayOrder: 6,
    region: "north-tyneside",
  },
  {
    id: "whitley-bay-north",
    name: "Whitley Bay North (Briardene)",
    slug: "whitley-bay-north",
    latitude: 55.0565,
    longitude: -1.4505,
    displayOrder: 7,
    region: "north-tyneside",
  },
  {
    id: "whitley-bay-central",
    name: "Whitley Bay Central (Panama)",
    slug: "whitley-bay-central",
    // Former single Whitley Bay pin — Panama Dip / central promenade
    latitude: 55.0481,
    longitude: -1.4494,
    displayOrder: 8,
    region: "north-tyneside",
    nest: {
      locationLinks: [
        {
          label: "Panama Swimming Club on Google Maps",
          url: "https://www.google.com/maps/search/?api=1&query=Panama+Swimming+Club+Northern+Promenade+Whitley+Bay",
        },
      ],
      paragraphs: [
        "Panama club are storing nurdle equipment and putting it out for volunteers to use.",
      ],
      equipmentIntro:
        "Most NESTs are stocked with a selection of the following items:",
      equipment: [
        "Mesh sieves",
        "Collection bags",
        "Gloves",
        "Buckets",
        "Soft brushes",
        "Other donated equipment",
      ],
      notes: [
        "Stock levels may vary, and some items may be temporarily unavailable.",
        "Please return any borrowed equipment to the NEST clean and in good condition so it's ready for the next volunteer.",
        "The mesh bags may be used by the charity Nurdle in response to future nurdle spills.",
      ],
    },
  },
  {
    id: "whitley-bay-south",
    name: "Whitley Bay South",
    slug: "whitley-bay-south",
    latitude: 55.042,
    longitude: -1.4465,
    displayOrder: 9,
    region: "north-tyneside",
  },
  {
    id: "browns-bay",
    name: "Brown’s Bay",
    slug: "browns-bay",
    // Between Whitley Bay South and Cullercoats
    latitude: 55.0403,
    longitude: -1.43,
    displayOrder: 10,
    region: "north-tyneside",
  },
  {
    id: "cullercoats-bay",
    name: "Cullercoats Bay",
    slug: "cullercoats-bay",
    latitude: 55.0349,
    longitude: -1.4328,
    displayOrder: 11,
    region: "north-tyneside",
    nest: {
      mapsUrl: "https://maps.app.goo.gl/TCt1biSsvFaLMcwq8",
      paragraphs: [
        "The equipment container is located at the bottom of the beach access ramp at Cullercoats Bay, next to the lifebuoy housing and council bins.",
        "The container is usually unlocked between 6:00–8:00 am and locked between 9:00–11:00 pm. Should this not be the case, volunteers can ask in the beach WhatsApp group, where a local PSC keyholder may be able to help.",
      ],
      equipmentIntro:
        "Most NESTs are stocked with a selection of the following items:",
      equipment: [
        "Mesh sieves",
        "Collection bags",
        "Gloves",
        "Buckets",
        "Soft brushes",
        "Other donated equipment",
      ],
      notes: [
        "Stock levels may vary, and some items may be temporarily unavailable.",
        "Please return any borrowed equipment to the NEST clean and in good condition so it's ready for the next volunteer.",
        "The mesh bags may be used by the charity Nurdle in response to future nurdle spills.",
      ],
    },
  },
  {
    id: "longsands-north",
    name: "Tynemouth Longsands — North",
    slug: "longsands-north",
    latitude: 55.0288,
    longitude: -1.4296,
    displayOrder: 12,
    region: "north-tyneside",
    nest: LONGSANDS_NEST,
  },
  {
    id: "longsands-south",
    name: "Tynemouth Longsands — South",
    slug: "longsands-south",
    latitude: 55.0234,
    longitude: -1.4269,
    displayOrder: 13,
    region: "north-tyneside",
    nest: LONGSANDS_NEST,
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    slug: "king-edwards-bay",
    latitude: 55.0182,
    longitude: -1.4158,
    displayOrder: 14,
    region: "north-tyneside",
  },
  {
    id: "tynemouth-haven",
    name: "Tynemouth Haven",
    slug: "tynemouth-haven",
    latitude: 55.0156,
    longitude: -1.4204,
    displayOrder: 15,
    region: "north-tyneside",
  },
  {
    id: "fish-quay",
    name: "Fish Quay",
    slug: "fish-quay",
    latitude: 55.0097,
    longitude: -1.4372,
    displayOrder: 16,
    region: "north-tyneside",
    nest: {
      locationLinks: [
        {
          label: "Search The Kiln Studios on Google Maps",
          url: "https://www.google.com/maps/search/?api=1&query=The+Kiln+Studios+North+Shields",
        },
        {
          label: "Search Mooring buoy art monument on Google Maps",
          url: "https://www.google.com/maps/search/?api=1&query=Mooring+buoy+art+monument+Fish+Quay",
        },
      ],
      paragraphs: [
        "The Fish Quay NEST is based at The Kiln Studios (The Kiln Studios, Northumberland Street, NE30 1DS), around a two-minute walk from Fish Quay Beach. It serves as an equipment collection and drop-off point for volunteers.",
        "Inside the studio: Thursday 11:30–7, Friday 11:30–9, Saturday 10:30–7, Sunday 10:30–5, Monday 12–5.",
        "Behind the grey shutter outside of these hours — the shutter is left unlocked so equipment is accessible when no one is at the studio.",
        "Returning equipment: ideally, the last person to use the equipment should return it to the drop-off/pick-up point at the end of the day.",
        "As the equipment is accessible at any time, anyone can collect or return it, even when no one is at the studio.",
      ],
      equipmentIntro:
        "Most NESTs are stocked with a selection of the following items.",
      equipment: [
        "Mesh sieves",
        "Collection bags",
        "Gloves",
        "Buckets",
        "Soft brushes",
        "Other donated equipment",
      ],
      notes: [
        "Stock levels may vary, and some items may be temporarily unavailable.",
        "Please return any borrowed equipment to the NEST clean and in good condition so it's ready for the next volunteer.",
        "The mesh bags may be used by the charity Nurdle in response to future nurdle spills.",
      ],
    },
  },
  {
    id: "south-shields",
    name: "Littlehaven and Sandhaven",
    slug: "littlehaven-south-shields",
    // Keep id south-shields so existing cleanup/check-in rows stay valid
    latitude: 55.0042,
    longitude: -1.4245,
    displayOrder: 17,
    region: "south-tyneside",
    nest: {
      locationLinks: [
        {
          label: "South Shields Surf School on Google Maps",
          url: "https://maps.app.goo.gl/U1nHkcd5cFUv7Pjw9",
        },
        {
          label: "The Sand Dancer on Google Maps",
          url: "https://maps.app.goo.gl/7EQMhVz1m4N7iutT7",
        },
      ],
      paragraphs: [
        "There is equipment available to borrow from South Shields Surf School during their opening hours, including large brooms and mesh filter bags.",
        "There are sieves and paper bags to borrow for collecting nurdles, available from The Sand Dancer pub during their opening hours. There is a table just inside each entrance with a small crate containing the kit.",
      ],
    },
  },
  {
    id: "seaburn",
    name: "Seaburn",
    slug: "seaburn",
    latitude: 54.9369,
    longitude: -1.3667,
    displayOrder: 18,
    region: "south-tyneside",
    nest: sunderlandBidNest("Seaburn", "Cave.Vets.Other"),
  },
  {
    id: "roker",
    name: "Roker",
    slug: "roker",
    latitude: 54.9215,
    longitude: -1.3665,
    displayOrder: 19,
    region: "south-tyneside",
    nest: sunderlandBidNest("Roker", "Activism.Tinsel.Foam"),
  },
];

/** WhatsApp-only groups without check-in map points. */
export const otherBeachWhatsappGroups: {
  id: string;
  name: string;
}[] = [{ id: "marina", name: "Marina" }];

export const checkinBeachById = Object.fromEntries(
  checkinBeaches.map((beach) => [beach.id, beach]),
) as Record<string, CheckinBeach>;

export const beachRegionLabels: Record<BeachRegion, string> = {
  "north-tyneside": "North Tyneside",
  "south-tyneside": "South Tyneside",
};

export const beachRegionOrder: BeachRegion[] = [
  "north-tyneside",
  "south-tyneside",
];

export function beachesInRegion(region: BeachRegion): CheckinBeach[] {
  return checkinBeaches.filter((beach) => beach.region === region);
}
