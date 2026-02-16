import pdfParse from "pdf-parse";
import type { CacheDb } from "@invest-guide/db";
import type { Connector } from "./base";
import { sleep } from "./base";

const stripHtml = (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export class IrDocumentConnector implements Connector {
  name = "ir-document";

  constructor(private cache: CacheDb) {}

  async fetch(input: { ticker: string; irUrls?: string[] }) {
    const urls = input.irUrls ?? [];
    const docs = [];
    for (const sourceUrl of urls) {
      const cacheKey = sourceUrl;
      const cached = this.cache.get(this.name, input.ticker, cacheKey);
      if (cached) {
        docs.push({
          connector: this.name,
          ticker: input.ticker,
          fetchedAt: cached.fetchedAt,
          sourceUrl,
          rawText: cached.rawText,
          summary: cached.parsedSummary,
          claims: [{ label: "IR document", value: cached.parsedSummary, sourceUrl }],
          metadata: JSON.parse(cached.metadataJson) as Record<string, string>
        });
        continue;
      }
      await sleep(300);
      const res = await fetch(sourceUrl, { headers: { "User-Agent": "invest-guide-bot/0.1 (educational use)" } });
      if (!res.ok) continue;
      const ctype = res.headers.get("content-type") ?? "";
      let rawText = "";
      if (sourceUrl.toLowerCase().endsWith(".pdf") || ctype.includes("pdf")) {
        const buffer = Buffer.from(await res.arrayBuffer());
        const parsed = await pdfParse(buffer);
        rawText = parsed.text;
      } else {
        rawText = stripHtml(await res.text());
      }
      const summary = rawText.slice(0, 500);
      this.cache.upsert({
        source: this.name,
        ticker: input.ticker,
        cacheKey,
        rawText,
        parsedSummary: summary,
        metadataJson: JSON.stringify({ contentType: ctype }),
        sourceUrl,
        fetchedAt: new Date().toISOString()
      });
      docs.push({
        connector: this.name,
        ticker: input.ticker,
        fetchedAt: new Date().toISOString(),
        sourceUrl,
        rawText,
        summary,
        claims: [{ label: "IR document excerpt", value: summary.slice(0, 140), sourceUrl }],
        metadata: { contentType: ctype }
      });
    }
    return docs;
  }
}
