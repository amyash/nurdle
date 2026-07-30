import { checkinBeachById } from "@/data/checkin-beaches";
import type {
  WildlifeAnimalType,
  WildlifeCondition,
  WildlifeImpactStats,
  WildlifeReportPublic,
  WildlifeReportStatus,
} from "@/types/wildlife";

export type RpcWildlifeReportRow = {
  id: string;
  beach_id: string;
  date_observed: string;
  time_observed: string | null;
  animal_type: string;
  species: string | null;
  animal_count: number;
  condition: string;
  description: string;
  has_supporting_evidence: boolean;
  status: string;
  verified_at: string | null;
  submitted_at: string;
};

export type RpcWildlifeStatsRow = {
  verified_reports: number | string;
  animals_reported: number | string;
  species_recorded: number | string;
  awaiting_review: number | string;
};

export function mapWildlifeReportRow(
  row: RpcWildlifeReportRow,
): WildlifeReportPublic | null {
  const beach = checkinBeachById[row.beach_id];
  if (!beach) return null;
  return {
    id: row.id,
    beachId: row.beach_id,
    beachName: beach.name,
    dateObserved: row.date_observed,
    timeObserved: row.time_observed,
    animalType: row.animal_type as WildlifeAnimalType,
    species: row.species,
    count: row.animal_count,
    condition: row.condition as WildlifeCondition,
    description: row.description,
    hasSupportingEvidence: row.has_supporting_evidence,
    status: row.status as WildlifeReportStatus,
    verifiedAt: row.verified_at,
    submittedAt: row.submitted_at,
    latitude: beach.latitude,
    longitude: beach.longitude,
  };
}

export function mapWildlifeStatsRow(
  row: RpcWildlifeStatsRow | null | undefined,
): WildlifeImpactStats {
  return {
    verifiedReports: Number(row?.verified_reports ?? 0),
    animalsReported: Number(row?.animals_reported ?? 0),
    speciesRecorded: Number(row?.species_recorded ?? 0),
    awaitingReview: Number(row?.awaiting_review ?? 0),
  };
}
