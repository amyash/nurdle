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
}

export const CHECKIN_EXPIRY_HOURS = 2;

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
    id: "st-marys-lighthouse",
    name: "St Mary’s Lighthouse",
    slug: "st-marys-lighthouse",
    latitude: 55.0718,
    longitude: -1.4495,
    displayOrder: 1,
    region: "north-tyneside",
  },
  {
    id: "whitley-bay-north",
    name: "Whitley Bay North (Briardene)",
    slug: "whitley-bay-north",
    latitude: 55.0565,
    longitude: -1.4505,
    displayOrder: 2,
    region: "north-tyneside",
  },
  {
    id: "whitley-bay-central",
    name: "Whitley Bay Central (Panama)",
    slug: "whitley-bay-central",
    // Former single Whitley Bay pin — Panama Dip / central promenade
    latitude: 55.0481,
    longitude: -1.4494,
    displayOrder: 3,
    region: "north-tyneside",
  },
  {
    id: "whitley-bay-south",
    name: "Whitley Bay South",
    slug: "whitley-bay-south",
    latitude: 55.042,
    longitude: -1.4465,
    displayOrder: 4,
    region: "north-tyneside",
  },
  {
    id: "browns-bay",
    name: "Brown’s Bay",
    slug: "browns-bay",
    // Between Whitley Bay South and Cullercoats
    latitude: 55.0403,
    longitude: -1.43,
    displayOrder: 5,
    region: "north-tyneside",
  },
  {
    id: "cullercoats-bay",
    name: "Cullercoats Bay",
    slug: "cullercoats-bay",
    latitude: 55.0349,
    longitude: -1.4328,
    displayOrder: 6,
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
    displayOrder: 7,
    region: "north-tyneside",
    nest: LONGSANDS_NEST,
  },
  {
    id: "longsands-south",
    name: "Tynemouth Longsands — South",
    slug: "longsands-south",
    latitude: 55.0234,
    longitude: -1.4269,
    displayOrder: 8,
    region: "north-tyneside",
    nest: LONGSANDS_NEST,
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    slug: "king-edwards-bay",
    latitude: 55.0182,
    longitude: -1.4158,
    displayOrder: 9,
    region: "north-tyneside",
  },
  {
    id: "tynemouth-haven",
    name: "Tynemouth Haven",
    slug: "tynemouth-haven",
    latitude: 55.0156,
    longitude: -1.4204,
    displayOrder: 10,
    region: "north-tyneside",
  },
  {
    id: "newbiggin",
    name: "Newbiggin",
    slug: "newbiggin",
    latitude: 55.1845,
    longitude: -1.5098,
    displayOrder: 11,
    region: "north-tyneside",
  },
  {
    id: "blyth",
    name: "Blyth",
    slug: "blyth",
    latitude: 55.1422,
    longitude: -1.5085,
    displayOrder: 12,
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
  },
  {
    id: "seaton-sluice",
    name: "Seaton Sluice",
    slug: "seaton-sluice",
    latitude: 55.0825,
    longitude: -1.4745,
    displayOrder: 13,
    region: "north-tyneside",
    nest: {
      locationLinks: [
        {
          label: "what3words",
          url: "https://what3words.com/rugs.tigers.rare",
        },
      ],
      paragraphs: [
        "The Seaton Sluice NEST can be found at the Seaton Sluice Boating Association which is to the right of the Kings Arm's pub. You can find the supplies just inside the gate and they are accessible during opening hours, typically between 9am and 6/7pm.",
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
    id: "cambois",
    name: "Cambois",
    slug: "cambois",
    latitude: 55.1528,
    longitude: -1.5185,
    displayOrder: 14,
    region: "north-tyneside",
  },
  {
    id: "fish-quay",
    name: "Fish Quay",
    slug: "fish-quay",
    latitude: 55.0097,
    longitude: -1.4372,
    displayOrder: 15,
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
    name: "Littlehaven (South Shields)",
    slug: "littlehaven-south-shields",
    // Keep id south-shields so existing cleanup/check-in rows stay valid
    latitude: 55.0042,
    longitude: -1.4245,
    displayOrder: 16,
    region: "south-tyneside",
  },
  {
    id: "roker",
    name: "Roker",
    slug: "roker",
    latitude: 54.9215,
    longitude: -1.3665,
    displayOrder: 17,
    region: "south-tyneside",
  },
  {
    id: "seaburn",
    name: "Seaburn",
    slug: "seaburn",
    latitude: 54.9369,
    longitude: -1.3667,
    displayOrder: 18,
    region: "south-tyneside",
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
