import Database from "better-sqlite3";

export type CachedRecord = {
  source: string;
  ticker: string;
  cacheKey: string;
  rawText: string;
  parsedSummary: string;
  metadataJson: string;
  sourceUrl: string;
  fetchedAt: string;
};

export class CacheDb {
  private db: Database.Database;

  constructor(path = "./invest-guide.sqlite") {
    this.db = new Database(path);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS source_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        ticker TEXT NOT NULL,
        cache_key TEXT NOT NULL,
        raw_text TEXT NOT NULL,
        parsed_summary TEXT NOT NULL,
        metadata_json TEXT NOT NULL,
        source_url TEXT NOT NULL,
        fetched_at TEXT NOT NULL,
        UNIQUE(source, ticker, cache_key)
      );
    `);
  }

  upsert(record: CachedRecord): void {
    this.db
      .prepare(
        `INSERT INTO source_cache (source, ticker, cache_key, raw_text, parsed_summary, metadata_json, source_url, fetched_at)
         VALUES (@source, @ticker, @cacheKey, @rawText, @parsedSummary, @metadataJson, @sourceUrl, @fetchedAt)
         ON CONFLICT(source, ticker, cache_key) DO UPDATE SET
           raw_text = excluded.raw_text,
           parsed_summary = excluded.parsed_summary,
           metadata_json = excluded.metadata_json,
           source_url = excluded.source_url,
           fetched_at = excluded.fetched_at`
      )
      .run(record);
  }

  get(source: string, ticker: string, cacheKey: string): CachedRecord | null {
    const row = this.db
      .prepare(
        `SELECT source, ticker, cache_key as cacheKey, raw_text as rawText, parsed_summary as parsedSummary,
         metadata_json as metadataJson, source_url as sourceUrl, fetched_at as fetchedAt
         FROM source_cache WHERE source = ? AND ticker = ? AND cache_key = ?`
      )
      .get(source, ticker, cacheKey) as CachedRecord | undefined;
    return row ?? null;
  }
}
