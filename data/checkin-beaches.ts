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

export interface CheckinBeach {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  displayOrder: number;
  /** Beach WhatsApp invite — null until confirmed. */
  whatsappUrl: string | null;
  /** Nurdle Equipment Station details — omit until known. */
  nest?: BeachNest | null;
}

export const CHECKIN_EXPIRY_HOURS = 2;

/** Shared WhatsApp for the Whitley Bay coastline segments. */
const WHITLEY_BAY_WHATSAPP =
  "https://chat.whatsapp.com/H8NyTR4AThJIT014Wc5ooE";

const LONGSANDS_NEST: BeachNest = {
  mapsUrl: "https://maps.app.goo.gl/FoDtaM8pL6ooUK8d7",
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
    whatsappUrl: WHITLEY_BAY_WHATSAPP,
  },
  {
    id: "whitley-bay-north",
    name: "Whitley Bay North (Briardene)",
    slug: "whitley-bay-north",
    latitude: 55.0565,
    longitude: -1.4505,
    displayOrder: 2,
    whatsappUrl: WHITLEY_BAY_WHATSAPP,
  },
  {
    id: "whitley-bay-central",
    name: "Whitley Bay Central (Panama)",
    slug: "whitley-bay-central",
    // Former single Whitley Bay pin — Panama Dip / central promenade
    latitude: 55.0481,
    longitude: -1.4494,
    displayOrder: 3,
    whatsappUrl: WHITLEY_BAY_WHATSAPP,
  },
  {
    id: "whitley-bay-south",
    name: "Whitley Bay South",
    slug: "whitley-bay-south",
    latitude: 55.042,
    longitude: -1.4465,
    displayOrder: 4,
    whatsappUrl: WHITLEY_BAY_WHATSAPP,
  },
  {
    id: "browns-bay",
    name: "Brown’s Bay",
    slug: "browns-bay",
    // Between Whitley Bay South and Cullercoats
    latitude: 55.0403,
    longitude: -1.43,
    displayOrder: 5,
    whatsappUrl: WHITLEY_BAY_WHATSAPP,
  },
  {
    id: "cullercoats-bay",
    name: "Cullercoats Bay",
    slug: "cullercoats-bay",
    latitude: 55.0349,
    longitude: -1.4328,
    displayOrder: 6,
    whatsappUrl: "https://chat.whatsapp.com/LJIE5xqsqWmGAIl2pLt4t2",
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
    whatsappUrl: "https://chat.whatsapp.com/KtraHXq8Q3R6JrANxkzi8N",
    nest: LONGSANDS_NEST,
  },
  {
    id: "longsands-south",
    name: "Tynemouth Longsands — South",
    slug: "longsands-south",
    latitude: 55.0234,
    longitude: -1.4269,
    displayOrder: 8,
    whatsappUrl: "https://chat.whatsapp.com/KtraHXq8Q3R6JrANxkzi8N",
    nest: LONGSANDS_NEST,
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    slug: "king-edwards-bay",
    latitude: 55.0182,
    longitude: -1.4158,
    displayOrder: 9,
    whatsappUrl: "https://chat.whatsapp.com/K2lktDs5NAj7UG1SYoDYwh",
  },
  {
    id: "tynemouth-haven",
    name: "Tynemouth Haven",
    slug: "tynemouth-haven",
    latitude: 55.0156,
    longitude: -1.4204,
    displayOrder: 10,
    whatsappUrl: "https://chat.whatsapp.com/IUp4YAxs7Yo7vZAqeO6Z1I",
  },
  {
    id: "newbiggin",
    name: "Newbiggin",
    slug: "newbiggin",
    latitude: 55.1845,
    longitude: -1.5098,
    displayOrder: 11,
    whatsappUrl: "https://chat.whatsapp.com/F3BpZ4dw3gmGlqTM7rPftx",
  },
  {
    id: "blyth",
    name: "Blyth",
    slug: "blyth",
    latitude: 55.1422,
    longitude: -1.5085,
    displayOrder: 12,
    whatsappUrl: null,
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
    whatsappUrl: null,
  },
  {
    id: "cambois",
    name: "Cambois",
    slug: "cambois",
    latitude: 55.1528,
    longitude: -1.5185,
    displayOrder: 14,
    whatsappUrl: "https://chat.whatsapp.com/C9bWFyadyH15kgIR1QTBLQ",
  },
  {
    id: "fish-quay",
    name: "Fish Quay",
    slug: "fish-quay",
    latitude: 55.0097,
    longitude: -1.4372,
    displayOrder: 15,
    whatsappUrl: "https://chat.whatsapp.com/E3UFrnJFRE719lT7BztWoo",
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
        "The Fish Quay NEST is based at The Kiln Studios, around a two-minute walk from Fish Quay Beach. It serves as an equipment collection and drop-off point for volunteers.",
        "Equipment can be collected and returned during The Kiln Studios' opening hours. The NEST is located just inside the studio entrance and is clearly signposted. Equipment is stored securely inside when the studio is closed.",
        "Thanks to Ron, who has kindly offered space at The Kiln Studios to support the community response.",
        "Note: Throughout the day you might also find volunteer equipment at the painted blue buoys.",
        "Outside the regular opening times, volunteers can ask in the beach WhatsApp group, where a local PSC keyholder may be able to help.",
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
];

/** WhatsApp-only groups without check-in map points. */
export const otherBeachWhatsappGroups: {
  id: string;
  name: string;
  whatsappUrl: string | null;
}[] = [
  {
    id: "south-tyneside",
    name: "South Tyneside",
    whatsappUrl: "https://chat.whatsapp.com/Kfd0BABx0dTH9Q9UgUks4r",
  },
];

export const checkinBeachById = Object.fromEntries(
  checkinBeaches.map((beach) => [beach.id, beach]),
) as Record<string, CheckinBeach>;
