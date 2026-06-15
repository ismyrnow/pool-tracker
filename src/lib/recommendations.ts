export type PoolType = "chlorine" | "salt";

export interface TestReading {
  free_chlorine: number | null;
  combined_chlorine: number | null;
  ph: number | null;
  alkalinity: number | null;
  calcium_hardness: number | null;
  cya: number | null;
}

export interface ParameterStatus {
  parameter: string;
  value: number | null;
  unit: string;
  status: "good" | "low" | "high" | "untested";
  idealLow: number;
  idealHigh: number;
  recommendation: string | null;
}

type Range = { low: number; high: number };

function getRanges(poolType: PoolType): Record<string, Range> {
  return {
    free_chlorine: poolType === "salt" ? { low: 1, high: 3 } : { low: 2, high: 4 },
    combined_chlorine: { low: 0, high: 0.5 },
    ph: { low: 7.4, high: 7.6 },
    alkalinity: { low: 80, high: 120 },
    calcium_hardness: { low: 200, high: 400 },
    cya: { low: 30, high: 50 },
  };
}

const MESSAGES: Record<string, { low: string; high: string }> = {
  free_chlorine: {
    low: "Add chlorine and retest before swimming.",
    high: "Wait before swimming — chlorine is elevated.",
  },
  combined_chlorine: {
    low: "",
    high: "Shock the pool to break up chloramines.",
  },
  ph: {
    low: "Add soda ash to bring pH up.",
    high: "Add muriatic acid to bring pH down.",
  },
  alkalinity: {
    low: "Add baking soda to raise total alkalinity.",
    high: "Aerate or dilute to lower alkalinity.",
  },
  calcium_hardness: {
    low: "Add calcium chloride to raise hardness.",
    high: "Partially drain and refill with fresh water.",
  },
  cya: {
    low: "Add stabilizer to protect chlorine from UV.",
    high: "Partially drain and refill to lower CYA.",
  },
};

const LABELS: Record<string, { label: string; unit: string }> = {
  free_chlorine: { label: "Free Chlorine", unit: "ppm" },
  combined_chlorine: { label: "Combined Chlorine", unit: "ppm" },
  ph: { label: "pH", unit: "" },
  alkalinity: { label: "Alkalinity", unit: "ppm" },
  calcium_hardness: { label: "Calcium Hardness", unit: "ppm" },
  cya: { label: "CYA", unit: "ppm" },
};

export function buildRecommendations(reading: TestReading, poolType: PoolType): ParameterStatus[] {
  const ranges = getRanges(poolType);
  const keys = Object.keys(ranges) as (keyof TestReading)[];

  return keys.map((key) => {
    const value = reading[key] as number | null;
    const range = ranges[key];
    const { label, unit } = LABELS[key];
    const idealLow = range.low;
    const idealHigh = range.high;

    if (value === null) {
      return {
        parameter: label,
        value,
        unit,
        status: "untested",
        idealLow,
        idealHigh,
        recommendation: null,
      };
    }

    if (key === "combined_chlorine") {
      if (value >= range.high) {
        return {
          parameter: label,
          value,
          unit,
          status: "high",
          idealLow,
          idealHigh,
          recommendation: MESSAGES[key].high,
        };
      }
      return {
        parameter: label,
        value,
        unit,
        status: "good",
        idealLow,
        idealHigh,
        recommendation: null,
      };
    }

    if (value < range.low) {
      return {
        parameter: label,
        value,
        unit,
        status: "low",
        idealLow,
        idealHigh,
        recommendation: MESSAGES[key].low,
      };
    }
    if (value > range.high) {
      return {
        parameter: label,
        value,
        unit,
        status: "high",
        idealLow,
        idealHigh,
        recommendation: MESSAGES[key].high,
      };
    }
    return {
      parameter: label,
      value,
      unit,
      status: "good",
      idealLow,
      idealHigh,
      recommendation: null,
    };
  });
}
