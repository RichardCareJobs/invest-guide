import { describe, expect, it } from "vitest";
import { analyzeTicker, threeMonthDoublingFrequency } from "./scoring";

describe("scoring", () => {
  it("returns bounded risk and reward scores", () => {
    const marketData = Array.from({ length: 120 }).map((_, i) => ({
      date: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
      open: 10 + i * 0.1,
      high: 10.2 + i * 0.1,
      low: 9.8 + i * 0.1,
      close: 10 + i * 0.1,
      volume: 100000
    }));

    const result = analyzeTicker({
      code: "AAA",
      companyName: "AAA Ltd",
      marketData,
      docs: []
    });

    expect(result.riskScore).toBeGreaterThanOrEqual(0);
    expect(result.riskScore).toBeLessThanOrEqual(100);
    expect(result.rewardScore).toBeGreaterThanOrEqual(0);
    expect(result.rewardScore).toBeLessThanOrEqual(100);
  });

  it("computes three month doubling frequency", () => {
    const series = {
      AAA: [
        ...Array.from({ length: 64 }).map((_, i) => ({ date: `${i}`, open: 1, high: 1, low: 1, close: i < 63 ? 1 : 2.1, volume: 1 }))
      ]
    };
    const freq = threeMonthDoublingFrequency(series);
    expect(freq.checked).toBe(1);
    expect(freq.doubled).toBe(1);
    expect(freq.frequency).toBe(100);
  });
});
