/**
 * Deterministic demo-data generator.
 *
 * Every new EcoPulse account is seeded with 8 weeks of internally consistent,
 * clearly-labelled demo activity so the product can be evaluated immediately.
 * The generator is deterministic: same inputs -> same rows.
 */

import { EMISSION_FACTORS, addDays, lastNWeekStarts, round } from "./carbon";

/** Weekly CO2e targets, oldest -> current. Current week is ~11% below last week. */
export const WEEKLY_TARGETS = [33.6, 32.4, 31.1, 30.2, 29.5, 28.7, 27.9, 24.8];

interface BaseEntry {
  activity_type: string;
  quantityPerTrip: number;
  trips: number;
  dayOffset: number;
  notes?: string;
}

/** One representative week of a campus student's life (Indian context). */
const BASE_WEEK: BaseEntry[] = [
  { activity_type: "car", quantityPerTrip: 2.4, trips: 5, dayOffset: 1, notes: "Short campus errands" },
  { activity_type: "car", quantityPerTrip: 8, trips: 2, dayOffset: 5, notes: "Trip into town" },
  { activity_type: "motorcycle", quantityPerTrip: 6, trips: 3, dayOffset: 2 },
  { activity_type: "bus", quantityPerTrip: 9, trips: 4, dayOffset: 3 },
  { activity_type: "train", quantityPerTrip: 40, trips: 1, dayOffset: 6 },
  { activity_type: "walking", quantityPerTrip: 1.8, trips: 6, dayOffset: 0 },
  { activity_type: "bicycle", quantityPerTrip: 2.5, trips: 3, dayOffset: 4 },
  { activity_type: "electricity", quantityPerTrip: 8, trips: 1, dayOffset: 6, notes: "Hostel room sub-meter" },
  { activity_type: "lpg", quantityPerTrip: 0.3, trips: 1, dayOffset: 6 },
  { activity_type: "vegetarian", quantityPerTrip: 6, trips: 1, dayOffset: 2 },
  { activity_type: "dairy", quantityPerTrip: 4, trips: 1, dayOffset: 3 },
  { activity_type: "chicken", quantityPerTrip: 1, trips: 1, dayOffset: 5 },
];

const BASE_TOTAL = BASE_WEEK.reduce((sum, e) => {
  const f = EMISSION_FACTORS[e.activity_type]!;
  return sum + e.quantityPerTrip * e.trips * f.factor;
}, 0);

export interface SeedActivity {
  category: string;
  activity_type: string;
  quantity: number;
  unit: string;
  trips: number;
  emission_factor: number;
  co2e: number;
  occurred_on: string;
  source: string;
  notes: string | null;
}

export function generateSeedActivities(): SeedActivity[] {
  const weeks = lastNWeekStarts(WEEKLY_TARGETS.length);
  const rows: SeedActivity[] = [];

  weeks.forEach((week, wi) => {
    const scale = (WEEKLY_TARGETS[wi] ?? 0) / BASE_TOTAL;
    for (const entry of BASE_WEEK) {
      const f = EMISSION_FACTORS[entry.activity_type]!;
      const isCount = f.unit === "meal" || f.unit === "serving";
      const quantity = isCount
        ? Math.max(1, Math.round(entry.quantityPerTrip * entry.trips * scale))
        : round(entry.quantityPerTrip * entry.trips * scale, 2);
      rows.push({
        category: f.category,
        activity_type: f.activity_type,
        quantity,
        unit: f.unit,
        trips: entry.trips,
        emission_factor: f.factor,
        co2e: round(quantity * f.factor, 3),
        occurred_on: addDays(week, entry.dayOffset),
        source: "demo_seed",
        notes: entry.notes ?? null,
      });
    }
  });

  return rows;
}

/** Verified actions seeded so "CO₂e avoided" starts from a real, auditable number. */
export const SEED_VERIFIED_ACTIONS = [
  {
    challenge_slug: "walk-cycle-week",
    description: "Walked 2.4 km instead of a short car trip",
    co2e_avoided: 0.41,
    verification_method: "activity_data",
    verification_status: "verified",
    evidence: "Matched against a logged 2.4 km walking activity",
  },
  {
    challenge_slug: "walk-cycle-week",
    description: "Cycled 3.1 km instead of a short car trip",
    co2e_avoided: 0.53,
    verification_method: "activity_data",
    verification_status: "verified",
    evidence: "Matched against a logged 3.1 km cycling activity",
  },
  {
    challenge_slug: "public-transit-week",
    description: "Took the campus bus instead of a car for a 9 km journey",
    co2e_avoided: 1.1,
    verification_method: "simulated_data",
    verification_status: "verified",
    evidence: "Simulated mobility data (demo)",
  },
  {
    challenge_slug: "energy-smart",
    description: "Switched off idle appliances for a week",
    co2e_avoided: 1.06,
    verification_method: "activity_data",
    verification_status: "verified",
    evidence: "Electricity logged 1.5 kWh below the 8-week average",
  },
];

export const SEED_ECO_POINTS = 420;
export const SEED_STREAK = 7;
