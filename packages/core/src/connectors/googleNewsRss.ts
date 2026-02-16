import { XMLParser } from "fast-xml-parser";
import type { CacheDb } from "@invest-guide/db";
import type { Connector } from "./base";
import { sleep } from "./base";

export class GoogleNewsRssConnector implements Connector {
  name = "google-news-rss";

  constructor(private cache: CacheDb) {}

  async fetch(input: { ticker: string; companyName: string }) {
    const q = encodeURIComponent(`${input.ticker} ${input.companyName} ASX`);
    const sourceUrl = `https://news.google.com/rss/search?q=${q}&hl=en-AU&gl=AU&ceid=AU:en`;
    const cacheKey = `rss:${q}`;
    const cached = this.cache.get(this.name, input.ticker, cacheKey);
    if (cached) {
      return [
        {
          connector: this.name,
          ticker: input.ticker,
          fetchedAt: cached.fetchedAt,
          sourceUrl,
          rawText: cached.rawText,
          summary: cached.parsedSummary,
          metadata: JSON.parse(cached.metadataJson) as Record<string, string>,
          claims: JSON.parse(cached.metadataJson).claims as { label: string; value: string; sourceUrl: string }[]
        }
      ];
    }

    await sleep(250);
    const res = await fetch(sourceUrl, { headers: { "User-Agent": "invest-guide-bot/0.1 (educational use)" } });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser();
    const parsed = parser.parse(xml) as { rss?: { channel?: { item?: Array<Record<string, string>> } } };
    const items = parsed.rss?.channel?.item ?? [];
    const claims = items.slice(0, 8).map((item) => ({
      label: item.title ?? "Headline",
      value: item.pubDate ?? "",
      sourceUrl: item.link ?? sourceUrl
    }));
    const rawText = claims.map((c) => c.label).join(" | ");
    const summary = `Fetched ${claims.length} recent Google News headlines.`;
    this.cache.upsert({
      source: this.name,
      ticker: input.ticker,
      cacheKey,
      rawText,
      parsedSummary: summary,
      metadataJson: JSON.stringify({ claims }),
      sourceUrl,
      fetchedAt: new Date().toISOString()
    });

    return [
      {
        connector: this.name,
        ticker: input.ticker,
        fetchedAt: new Date().toISOString(),
        sourceUrl,
        rawText,
        summary,
        claims,
        metadata: { claimCount: claims.length }
      }
    ];
  }
}
