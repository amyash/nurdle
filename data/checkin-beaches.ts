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
 *     locationLabel: "Promenade by the skate park",
 *     mapsUrl: "https://maps.google.com/?q=...",
 *     equipment: ["Buckets", "Mesh bags", "Shovels"],
 *   },
 */
export interface BeachNest {
  /** Short place description shown under the NEST heading. */
  locationLabel?: string | null;
  /** Google Maps link for the station. */
  mapsUrl?: string | null;
  /** Kit available at this NEST. */
  equipment?: string[];
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
    id: "cullercoats-bay",
    name: "Cullercoats Bay",
    slug: "cullercoats-bay",
    latitude: 55.0349,
    longitude: -1.4328,
    displayOrder: 5,
    whatsappUrl: "https://chat.whatsapp.com/LJIE5xqsqWmGAIl2pLt4t2",
  },
  {
    id: "longsands-north",
    name: "Tynemouth Longsands — North",
    slug: "longsands-north",
    latitude: 55.0288,
    longitude: -1.4296,
    displayOrder: 6,
    whatsappUrl: "https://chat.whatsapp.com/KtraHXq8Q3R6JrANxkzi8N",
  },
  {
    id: "longsands-south",
    name: "Tynemouth Longsands — South",
    slug: "longsands-south",
    latitude: 55.0234,
    longitude: -1.4269,
    displayOrder: 7,
    whatsappUrl: "https://chat.whatsapp.com/KtraHXq8Q3R6JrANxkzi8N",
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    slug: "king-edwards-bay",
    latitude: 55.0182,
    longitude: -1.4158,
    displayOrder: 8,
    whatsappUrl: "https://chat.whatsapp.com/K2lktDs5NAj7UG1SYoDYwh",
  },
  {
    id: "tynemouth-haven",
    name: "Tynemouth Haven",
    slug: "tynemouth-haven",
    latitude: 55.0156,
    longitude: -1.4204,
    displayOrder: 9,
    whatsappUrl: "https://chat.whatsapp.com/IUp4YAxs7Yo7vZAqeO6Z1I",
  },
  {
    id: "newbiggin",
    name: "Newbiggin",
    slug: "newbiggin",
    latitude: 55.1845,
    longitude: -1.5098,
    displayOrder: 10,
    whatsappUrl: "https://chat.whatsapp.com/F3BpZ4dw3gmGlqTM7rPftx",
  },
  {
    id: "blyth",
    name: "Blyth",
    slug: "blyth",
    latitude: 55.1422,
    longitude: -1.5085,
    displayOrder: 11,
    whatsappUrl: null,
  },
  {
    id: "seaton-sluice",
    name: "Seaton Sluice",
    slug: "seaton-sluice",
    latitude: 55.0825,
    longitude: -1.4745,
    displayOrder: 12,
    whatsappUrl: null,
  },
  {
    id: "cambois",
    name: "Cambois",
    slug: "cambois",
    latitude: 55.1528,
    longitude: -1.5185,
    displayOrder: 13,
    whatsappUrl: "https://chat.whatsapp.com/C9bWFyadyH15kgIR1QTBLQ",
  },
  {
    id: "fish-quay",
    name: "Fish Quay",
    slug: "fish-quay",
    latitude: 55.0097,
    longitude: -1.4372,
    displayOrder: 14,
    whatsappUrl: "https://chat.whatsapp.com/E3UFrnJFRE719lT7BztWoo",
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
  {
    id: "browns-jackeys",
    name: "Brown’s Bay / Jackey’s Bay",
    whatsappUrl: null,
  },
];

export const checkinBeachById = Object.fromEntries(
  checkinBeaches.map((beach) => [beach.id, beach]),
) as Record<string, CheckinBeach>;
