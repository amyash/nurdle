/**
 * Predefined beaches for Volunteer Beach Check-in.
 * Coordinates are approximate coastline points for map markers only —
 * not used for GPS tracking.
 *
 * IDs must match rows seeded in supabase/migrations.
 */
export interface CheckinBeach {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  displayOrder: number;
}

export const CHECKIN_EXPIRY_HOURS = 2;

export const checkinBeaches: CheckinBeach[] = [
  {
    id: "whitley-bay",
    name: "Whitley Bay",
    slug: "whitley-bay",
    latitude: 55.0481,
    longitude: -1.4494,
    displayOrder: 1,
  },
  {
    id: "cullercoats-bay",
    name: "Cullercoats Bay",
    slug: "cullercoats-bay",
    latitude: 55.0349,
    longitude: -1.4328,
    displayOrder: 2,
  },
  {
    id: "longsands-north",
    name: "Tynemouth Longsands — North",
    slug: "longsands-north",
    latitude: 55.0288,
    longitude: -1.4296,
    displayOrder: 3,
  },
  {
    id: "longsands-south",
    name: "Tynemouth Longsands — South",
    slug: "longsands-south",
    latitude: 55.0234,
    longitude: -1.4269,
    displayOrder: 4,
  },
  {
    id: "king-edwards-bay",
    name: "King Edward’s Bay",
    slug: "king-edwards-bay",
    latitude: 55.0182,
    longitude: -1.4158,
    displayOrder: 5,
  },
  {
    id: "tynemouth-haven",
    name: "Tynemouth Haven",
    slug: "tynemouth-haven",
    latitude: 55.0156,
    longitude: -1.4204,
    displayOrder: 6,
  },
  {
    id: "newbiggin",
    name: "Newbiggin",
    slug: "newbiggin",
    latitude: 55.1845,
    longitude: -1.5098,
    displayOrder: 7,
  },
  {
    id: "blyth",
    name: "Blyth",
    slug: "blyth",
    latitude: 55.1422,
    longitude: -1.5085,
    displayOrder: 8,
  },
  {
    id: "seaton-sluice",
    name: "Seaton Sluice",
    slug: "seaton-sluice",
    latitude: 55.0825,
    longitude: -1.4745,
    displayOrder: 9,
  },
];

export const checkinBeachById = Object.fromEntries(
  checkinBeaches.map((beach) => [beach.id, beach]),
) as Record<string, CheckinBeach>;
