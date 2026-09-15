/**
 * Activity data provider adapters.
 *
 * Only the demo provider is active. Google Fit / Apple Health adapters are
 * declared so the integration surface is real and typed, but they honestly
 * report that they are not connected. Nothing here pretends to be live.
 */

export interface ProviderTrip {
  activity_type: "walking" | "bicycle" | "car" | "bus" | "train" | "motorcycle";
  distance_km: number;
  occurred_on: string;
}

export interface ActivityDataProvider {
  id: string;
  name: string;
  status: "active" | "not_connected";
  description: string;
  isAvailable(): boolean;
  fetchTrips(sinceISODate: string): Promise<ProviderTrip[]>;
}

export const DemoActivityProvider: ActivityDataProvider = {
  id: "demo",
  name: "Simulated mobility data (demo)",
  status: "active",
  description:
    "Generates deterministic simulated trips used to auto-verify challenge actions. Clearly labelled as demo data everywhere it appears.",
  isAvailable: () => true,
  async fetchTrips(sinceISODate: string) {
    // Deterministic, not random: a fixed simulated pattern from the given date.
    const pattern: Array<[ProviderTrip["activity_type"], number]> = [
      ["walking", 2.4],
      ["bicycle", 3.1],
      ["bus", 9],
      ["walking", 1.8],
    ];
    return pattern.map(([activity_type, distance_km], i) => ({
      activity_type,
      distance_km,
      occurred_on: sinceISODate,
      _index: i,
    })) as ProviderTrip[];
  },
};

const unavailable = (id: string, name: string, description: string): ActivityDataProvider => ({
  id,
  name,
  status: "not_connected",
  description,
  isAvailable: () => false,
  async fetchTrips() {
    throw new Error(`${name} is not connected in this build.`);
  },
});

export const FutureGoogleFitProvider = unavailable(
  "google_fit",
  "Google Fit",
  "Planned integration. Would import walking, cycling and transit distance automatically.",
);

export const FutureAppleHealthProvider = unavailable(
  "apple_health",
  "Apple Health",
  "Planned integration. Would import step and workout distance automatically.",
);

export const FutureGoogleMapsProvider = unavailable(
  "google_maps",
  "Google Maps Timeline",
  "Planned integration. Would classify trip mode and distance from location history.",
);

export const ACTIVITY_PROVIDERS: ActivityDataProvider[] = [
  DemoActivityProvider,
  FutureGoogleFitProvider,
  FutureAppleHealthProvider,
  FutureGoogleMapsProvider,
];
