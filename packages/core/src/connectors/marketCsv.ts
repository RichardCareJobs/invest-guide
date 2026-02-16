import { readFile } from "node:fs/promises";
import path from "node:path";
import type { MarketPoint } from "../types";

export async function loadLocalMarketCsv(ticker: string): Promise<MarketPoint[]> {
  try {
    const fullPath = path.join(process.cwd(), "data", "market", `${ticker}.csv`);
    const content = await readFile(fullPath, "utf8");
    const rows = content.trim().split(/\r?\n/).slice(1);
    return rows.map((line) => {
      const [date, open, high, low, close, volume] = line.split(",");
      return {
        date,
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume)
      };
    });
  } catch {
    return [];
  }
}
