/**
 * Official North Tyneside Council nurdle / bagged-waste collection points.
 *
 * Coordinates are approximate pedestrian-access positions inferred from
 * OpenStreetMap landmarks and council map descriptions — they are NOT
 * official council-issued lat/lng values. Adjust here if signs on site differ.
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
  sourceUrl: string;
  displayOrder: number;
};

export const COUNCIL_GUIDANCE_URL =
  "https://www.northtyneside.gov.uk/plastic-pellets-beaches-nurdles";

export const collectionPoints: CollectionPoint[] = [
  {
    id: "whitley-bay",
    name: "Whitley Bay",
    beachId: "whitley-bay",
    // East of Coquet Park First School toward The Links promenade
    latitude: 55.0519,
    longitude: -1.4528,
    description:
      "On The Links/promenade, roughly opposite Coquet Park First School and close to the eastern end of St Mary’s Avenue.",
    landmarkUsed: "Coquet Park First School / The Links promenade (OSM)",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 1,
  },
  {
    id: "cullercoats-bay",
    name: "Cullercoats Bay",
    beachId: "cullercoats-bay",
    // Western side of the bay near Dove Marine Laboratory / upper path
    latitude: 55.0348,
    longitude: -1.4331,
    description:
      "On the western side of the bay, close to the Dove Marine Laboratory and the upper coastal path.",
    landmarkUsed: "Dove Marine Laboratory, Cullercoats (OSM)",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 2,
  },
  {
    id: "longsands-north",
    name: "Tynemouth Longsands — North",
    beachId: "longsands-north",
    // Northern end of Longsands / northern promenade access
    latitude: 55.0298,
    longitude: -1.4292,
    description:
      "At the northern end of Longsands, close to the northern promenade access.",
    landmarkUsed: "Northern Longsands / promenade access (OSM beach extent)",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 3,
  },
  {
    id: "longsands-south",
    name: "Tynemouth Longsands — South",
    beachId: "longsands-south",
    // Southern end near Grand Parade / Crusoe’s / main southern access
    latitude: 55.0235,
    longitude: -1.426,
    description:
      "At the southern end of Longsands, close to Grand Parade and the main southern beach access.",
    landmarkUsed: "Crusoe’s / Grand Parade southern beach access (OSM)",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 4,
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    beachId: "king-edwards-bay",
    // South-western corner / main path and steps access
    latitude: 55.0188,
    longitude: -1.417,
    description:
      "At the main access in the south-western corner of the beach, close to the bottom of the paths or steps.",
    landmarkUsed: "King Edward’s Bay SW beach access (OSM)",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 5,
  },
  {
    id: "tynemouth-haven",
    name: "The Haven / Prior’s Haven",
    beachId: "tynemouth-haven",
    // Immediately beside Tynemouth Sailing Club
    latitude: 55.01646,
    longitude: -1.41823,
    description: "Immediately beside Tynemouth Sailing Club.",
    landmarkUsed: "Tynemouth Sailing Club, Prior’s Haven (OSM)",
    sourceUrl: COUNCIL_GUIDANCE_URL,
    displayOrder: 6,
  },
];

export function directionsUrl(point: CollectionPoint): string {
  const query = `${point.latitude},${point.longitude}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
