/**
 * Electricity bill OCR abstraction.
 *
 * No real OCR vendor is wired up in this build, so `DemoBillOcrProvider` is used.
 * It is labelled "demo OCR" in the UI at every step — it never claims to have
 * actually read the uploaded image.
 */

export interface BillExtraction {
  provider: "demo" | "vendor";
  billing_period_start: string;
  billing_period_end: string;
  kwh: number;
  amount_inr: number | null;
  confidence: number;
  is_demo: boolean;
}

export interface BillOcrProvider {
  id: string;
  label: string;
  isReal: boolean;
  extract(file: File): Promise<BillExtraction>;
}

function monthWindow(reference = new Date()) {
  const end = new Date(reference);
  end.setUTCDate(1);
  end.setUTCDate(0); // last day of previous month
  const start = new Date(end);
  start.setUTCDate(1);
  return {
    billing_period_start: start.toISOString().slice(0, 10),
    billing_period_end: end.toISOString().slice(0, 10),
  };
}

/**
 * Deterministic demo extraction. Values come from a fixed hostel sub-meter bill,
 * nudged slightly by the file size so different uploads look different while
 * remaining reproducible for the same file.
 */
export const DemoBillOcrProvider: BillOcrProvider = {
  id: "demo",
  label: "Demo OCR (no real text recognition)",
  isReal: false,
  async extract(file: File): Promise<BillExtraction> {
    await new Promise((r) => setTimeout(r, 900));
    const variance = (file.size % 17) - 8; // -8 .. +8
    const kwh = Math.max(18, 42 + variance);
    const { billing_period_start, billing_period_end } = monthWindow();
    return {
      provider: "demo",
      billing_period_start,
      billing_period_end,
      kwh,
      amount_inr: Math.round(kwh * 8.1),
      confidence: file.type.startsWith("image/") ? 0.82 : 0.44,
      is_demo: true,
    };
  },
};

export const billOcr: BillOcrProvider = DemoBillOcrProvider;
export const LOW_CONFIDENCE_THRESHOLD = 0.7;
