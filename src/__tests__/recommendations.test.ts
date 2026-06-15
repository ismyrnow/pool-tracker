import { describe, expect, test } from "bun:test";
import { buildRecommendations } from "../lib/recommendations";
import type { TestReading } from "../lib/recommendations";

const base: TestReading = {
  free_chlorine: 3,
  combined_chlorine: 0,
  ph: 7.4,
  alkalinity: 100,
  calcium_hardness: 300,
  cya: 40,
};

const fc = (results: ReturnType<typeof buildRecommendations>) =>
  results.find((r) => r.parameter === "Free Chlorine")!;

const ph = (results: ReturnType<typeof buildRecommendations>) =>
  results.find((r) => r.parameter === "pH")!;

const cc = (results: ReturnType<typeof buildRecommendations>) =>
  results.find((r) => r.parameter === "Combined Chlorine")!;

describe("buildRecommendations — chlorine pool", () => {
  test("all values in range → all good, no recommendations", () => {
    const results = buildRecommendations(base, "chlorine");
    for (const r of results) {
      expect(r.status).toBe("good");
      expect(r.recommendation).toBeNull();
    }
  });

  test("free chlorine too low → low status + recommendation", () => {
    const result = fc(buildRecommendations({ ...base, free_chlorine: 1 }, "chlorine"));
    expect(result.status).toBe("low");
    expect(result.recommendation).toBeTruthy();
  });

  test("free chlorine too high → high status + recommendation", () => {
    const result = fc(buildRecommendations({ ...base, free_chlorine: 6 }, "chlorine"));
    expect(result.status).toBe("high");
    expect(result.recommendation).toBeTruthy();
  });

  test("ph out of range high → high status", () => {
    const result = ph(buildRecommendations({ ...base, ph: 8.0 }, "chlorine"));
    expect(result.status).toBe("high");
  });

  test("combined chlorine above 0.5 → high", () => {
    const result = cc(buildRecommendations({ ...base, combined_chlorine: 0.8 }, "chlorine"));
    expect(result.status).toBe("high");
  });

  test("null value → untested status", () => {
    const result = fc(buildRecommendations({ ...base, free_chlorine: null }, "chlorine"));
    expect(result.status).toBe("untested");
    expect(result.value).toBeNull();
  });
});

describe("buildRecommendations — salt pool", () => {
  test("FC=1.5 is good (salt range 1–3), would be low for chlorine (2–4)", () => {
    const result = fc(buildRecommendations({ ...base, free_chlorine: 1.5 }, "salt"));
    expect(result.status).toBe("good");
    expect(result.idealLow).toBe(1);
    expect(result.idealHigh).toBe(3);
  });

  test("FC=1.5 is low for chlorine pool (range 2–4)", () => {
    const result = fc(buildRecommendations({ ...base, free_chlorine: 1.5 }, "chlorine"));
    expect(result.status).toBe("low");
    expect(result.idealLow).toBe(2);
    expect(result.idealHigh).toBe(4);
  });
});
