/**
 * EcoPulse deterministic carbon calculation engine.
 *
 * CO2e = quantity x emission factor. No AI, no randomness, fully reproducible.
 * Factors are indicative demo values for the Indian context and are also stored
 * in the `emission_factors` table so they can be reconfigured without a rebuild.
 */

export type Category = "transport" | "energy" | "food" | "other";

export interface EmissionFactor {
  category: Category;
  activity_type: string;
  label: string;
  unit: string;
  factor: number;
  source: string;
}

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  car: {
    category: "transport",
    activity_type: "car",
    label: "Car",
    unit: "km",
    factor: 0.171,
    source: "Indicative India road transport factor (demo dataset)",
  },
  motorcycle: {
    category: "transport",
    activity_type: "motorcycle",
    label: "Motorcycle",
    unit: "km",
    factor: 0.072,
    source: "Indicative India road transport factor (demo dataset)",
  },
  bus: {
    category: "transport",
    activity_type: "bus",
    label: "Bus",
    unit: "km",
    factor: 0.049,
    source: "Indicative India public transport factor (demo dataset)",
  },
  train: {
    category: "transport",
    activity_type: "train",
    label: "Train / Metro",
    unit: "km",
    factor: 0.041,
    source: "Indicative India rail factor (demo dataset)",
  },
  bicycle: {
    category: "transport",
    activity_type: "bicycle",
    label: "Bicycle",
    unit: "km",
    factor: 0,
    source: "Zero direct tailpipe emissions",
  },
  walking: {
    category: "transport",
    activity_type: "walking",
    label: "Walking",
    unit: "km",
    factor: 0,
    source: "Zero direct tailpipe emissions",
  },
  electricity: {
    category: "energy",
    activity_type: "electricity",
    label: "Electricity",
    unit: "kWh",
    factor: 0.71,
    source: "Indicative India grid emission factor (demo dataset)",
  },
  lpg: {
    category: "energy",
    activity_type: "lpg",
    label: "LPG",
    unit: "kg",
    factor: 2.98,
    source: "Indicative LPG combustion factor (demo dataset)",
  },
  vegetarian: {
    category: "food",
    activity_type: "vegetarian",
    label: "Vegetarian meal",
    unit: "meal",
    factor: 0.9,
    source: "Indicative per-meal factor (demo dataset)",
  },
  dairy: {
    category: "food",
    activity_type: "dairy",
    label: "Dairy serving",
    unit: "serving",
    factor: 0.6,
    source: "Indicative per-serving factor (demo dataset)",
  },
  chicken: {
    category: "food",
    activity_type: "chicken",
    label: "Chicken meal",
    unit: "meal",
    factor: 2.3,
    source: "Indicative per-meal factor (demo dataset)",
  },
  fish: {
    category: "food",
    activity_type: "fish",
    label: "Fish meal",
    unit: "meal",
    factor: 1.8,
    source: "Indicative per-meal factor (demo dataset)",
  },
  red_meat: {
    category: "food",
    activity_type: "red_meat",
    label: "Red meat meal",
    unit: "meal",
    factor: 6.5,
    source: "Indicative per-meal factor (demo dataset)",
  },
};

export const FACTOR_LIST = Object.values(EMISSION_FACTORS);

export const factorsFor = (category: Category) =>
  FACTOR_LIST.filter((f) => f.category === category);

export interface CalculationResult {
  activity_type: string;
  category: Category;
  quantity: number;
  unit: string;
  emission_factor: number;
  co2e: number;
  explanation: string;
  source: string;
}

export function round(value: number, dp = 2): number {
  const p = 10 ** dp;
  return Math.round(value * p) / p;
}

/** Deterministic: quantity x factor. Always reproducible. */
export function calculateCo2e(activityType: string, quantity: number): CalculationResult {
  const f = EMISSION_FACTORS[activityType];
  if (!f) throw new Error(`Unknown activity type: ${activityType}`);
  const co2e = round(quantity * f.factor, 3);
  return {
    activity_type: f.activity_type,
    category: f.category,
    quantity: round(quantity, 2),
    unit: f.unit,
    emission_factor: f.factor,
    co2e,
    explanation: `${round(quantity, 2)} ${f.unit} × ${f.factor} kg CO₂e/${f.unit} = ${co2e} kg CO₂e`,
    source: f.source,
  };
}

/* ---------- date / week helpers (ISO weeks starting Monday) ---------- */

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function weekStart(input: Date | string): string {
  const d = typeof input === "string" ? new Date(`${input}T00:00:00Z`) : new Date(input);
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - day);
  d.setUTCHours(0, 0, 0, 0);
  return toISODate(d);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export function lastNWeekStarts(n: number, from: Date = new Date()): string[] {
  const current = weekStart(from);
  return Array.from({ length: n }, (_, i) => addDays(current, -7 * (n - 1 - i)));
}

export function formatWeekLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
}

/* ---------- aggregation ---------- */

export interface ActivityRow {
  id: string;
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

export interface WeeklyBucket {
  week_start: string;
  label: string;
  transport: number;
  energy: number;
  food: number;
  other: number;
  total: number;
}

export function aggregateWeeks(activities: ActivityRow[], weeks: string[]): WeeklyBucket[] {
  const map = new Map<string, WeeklyBucket>();
  for (const w of weeks) {
    map.set(w, {
      week_start: w,
      label: formatWeekLabel(w),
      transport: 0,
      energy: 0,
      food: 0,
      other: 0,
      total: 0,
    });
  }
  for (const a of activities) {
    const w = weekStart(a.occurred_on);
    const bucket = map.get(w);
    if (!bucket) continue;
    const known = ["transport", "energy", "food"];
    const key = (known.includes(a.category) ? a.category : "other") as
      | "transport"
      | "energy"
      | "food"
      | "other";
    bucket[key] += Number(a.co2e);
    bucket.total += Number(a.co2e);
  }
  return [...map.values()].map((b) => ({
    ...b,
    transport: round(b.transport),
    energy: round(b.energy),
    food: round(b.food),
    other: round(b.other),
    total: round(b.total),
  }));
}

export function percentChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return round(((current - previous) / previous) * 100, 1);
}

export const CATEGORY_LABEL: Record<string, string> = {
  transport: "Transport",
  energy: "Energy",
  food: "Food",
  other: "Other",
};
