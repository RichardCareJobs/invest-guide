import { readFile } from "node:fs/promises";
import path from "node:path";
import type { MarketPoint } from "../types";

const parseNumber = (value: string): number | null => {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const looksLikeHeader = (columns: string[]): boolean => {
  const first = (columns[0] ?? "").trim().toLowerCase();
  return first === "date";
};

export async function loadLocalMarketCsv(ticker: string): Promise<MarketPoint[]> {
  try {
    const fullPath = path.join(process.cwd(), "data", "market", `${ticker}.csv`);
    const content = await readFile(fullPath, "utf8");
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const dataLines = lines.filter((line, index) => {
      if (index !== 0) return true;
      const columns = line.split(",");
      return !looksLikeHeader(columns);
    });

    const points: MarketPoint[] = [];

    for (const line of dataLines) {
      const columns = line.split(",").map((col) => col.trim());
      const [date = "", openStr = "", highStr = "", lowStr = "", closeStr = "", volumeStr = ""] = columns;

      if (!date) continue;

      const open = parseNumber(openStr);
      const high = parseNumber(highStr);
      const low = parseNumber(lowStr);
      const close = parseNumber(closeStr);
      const volume = parseNumber(volumeStr);

      if (open === null || high === null || low === null || close === null || volume === null) {
        continue;
      }

      points.push({
        date,
        open,
        high,
        low,
        close,
        volume
      });
    }

    return points;
  } catch {
    return [];
  }
}
