/**
 * Official North Tyneside Council nurdle / bagged-waste collection points.
 *
 * Coordinates come from the supplied Google Maps pins (resolved from short
 * links) where available. North Longsands uses The View’s OpenStreetMap
 * location because that Google short link resolved to a place name without
 * numeric coordinates. Positions may still need on-site confirmation.
 *
 * Source guidance:
 * https://www.northtyneside.gov.uk/plastic-pellets-beaches-nurdles
 */

export type CollectionPoint = {
  id: string;
  name: string;
  /** Optional link to a volunteer check-in beach id (same coastline area). */
  beachId?: string;
  latitude: number;
  longitude: number;
  description: string;
  /** Landmark used to choose the approximate coordinate. */
  landmarkUsed: string;
  /** Google Maps pin / directions link for this collection point. */
  mapsUrl: string;
  sourceUrl: string;
  displayOrder: number;
};

export const COUNCIL_GUIDANCE_URL =
  "https://www.northtyneside.gov.uk/plastic-pellets-beaches-nurdles";

export const collectionPoints: CollectionPoint[] = [
  {
    id: "whitley-bay",
    name: "Whitley Bay",
    // Shared council point for the Whitley Bay coastline segments
    beachId: "whitley-bay-central",
    latitude: 55.0534426,
    longitude: -1.4505963,
    description: "Promenade by skate park",
    landmarkUsed: "Rendezvous Cafe Google Maps pin",
    mapsUrl: "https://maps.app.goo.gl/JcnLM3QkjZFboinY8?g_st=ic",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 1,
  },
  {
    id: "cullercoats-bay",
    name: "Cullercoats Bay",
    beachId: "cullercoats-bay",
    latitude: 55.0346892,
    longitude: -1.4323818,
    description: "By Dove Marine Laboratory.",
    landmarkUsed: "Dove Marine Laboratory Google Maps pin",
    mapsUrl: "https://maps.app.goo.gl/EcUgmcufJkYYRMxE6?g_st=ic",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 2,
  },
  {
    id: "longsands-north",
    name: "Tynemouth Longsands — North",
    beachId: "longsands-north",
    // Google short link resolved to a place name (NE30 4NT) without lat/lng;
    // using The View, Grand Parade coordinates from OpenStreetMap.
    latitude: 55.0304417,
    longitude: -1.430378,
    description: "By The View.",
    landmarkUsed: "The View, Grand Parade (OSM); Google pin short link",
    mapsUrl: "https://maps.app.goo.gl/8CL1Kis9GV6LXZxj8?g_st=ic",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 3,
  },
  {
    id: "longsands-south",
    name: "Tynemouth Longsands — South",
    beachId: "longsands-south",
    latitude: 55.0234182,
    longitude: -1.4247676,
    description: "By Crusoe’s Cafe.",
    landmarkUsed: "Crusoe’s Cafe Google Maps pin",
    mapsUrl: "https://maps.app.goo.gl/cEE8QFKqPnBScJdf6?g_st=ic",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 4,
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    beachId: "king-edwards-bay",
    latitude: 55.0190519,
    longitude: -1.4208298,
    description: "On ramp by Riley’s Fish Shack.",
    landmarkUsed: "Riley’s Fish Shack ramp Google Maps pin",
    mapsUrl: "https://maps.app.goo.gl/1vhBv6Mp9cmznYXj8?g_st=ic",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 5,
  },
  {
    id: "tynemouth-haven",
    name: "The Haven / Prior’s Haven",
    beachId: "tynemouth-haven",
    latitude: 55.0163475,
    longitude: -1.4181355,
    description: "By Tynemouth Sailing Club.",
    landmarkUsed: "Tynemouth Sailing Club Google Maps pin",
    mapsUrl: "https://maps.app.goo.gl/VumTbkX7diGnTShn8?g_st=ic",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 6,
  },
];

export function directionsUrl(point: CollectionPoint): string {
  return point.mapsUrl;
}

/** Whitley Bay coastline check-in beaches that share the skate-park collection point. */
const WHITLEY_BAY_COLLECTION_BEACH_IDS = new Set([
  "st-marys-lighthouse",
  "whitley-bay-north",
  "whitley-bay-central",
  "whitley-bay-south",
  "browns-bay",
]);

export function collectionPointForBeach(
  beachId: string,
): CollectionPoint | undefined {
  const direct = collectionPoints.find((point) => point.beachId === beachId);
  if (direct) return direct;
  if (WHITLEY_BAY_COLLECTION_BEACH_IDS.has(beachId)) {
    return collectionPoints.find((point) => point.id === "whitley-bay");
  }
  return undefined;
}

export function collectionPointLabel(point: CollectionPoint): string {
  return point.description.replace(/\.$/, "");
}
