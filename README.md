# invest-guide

Educational ASX Risk–Reward Matrix web app (Next.js + TypeScript + Tailwind + SQLite caching).

## Disclaimer
This project is for education only and **not financial advice**. It does not recommend a single "best" investment and does not guarantee returns.

## Setup
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Project structure
- `apps/web`: Next.js app/router + UI (static-export compatible for GitHub Pages)
- `packages/core`: connectors + scoring model + analysis helpers
- `packages/db`: SQLite cache layer (`better-sqlite3`)
- `data/asx-universe.json`: local universe list
- `data/market/*.csv`: demo OHLCV data for first-run demo

## Data source model
Free/public-only connectors:
- Google News RSS connector (`google-news-rss`)
- Investor Relations report connector (`ir-document`) for public HTML/PDF URLs
- Market data from local CSV files (fallback path when free ASX endpoint reliability is uncertain)

All connector outputs retain source URLs for each claim/headline where possible.

## Adding tickers
Edit `data/asx-universe.json` and add `{ "code": "XXX", "companyName": "Company" }` entries.

## Adding source URLs for a ticker
Update `data/demo-analysis.json` (or wire your own prebuild pipeline) with public report/announcement sources and claims for each ticker.

## Manual notes
If you have legally-usable notes, paste them into your own stored workflow and link the source in the app integration layer (no paywalled scraping in this starter).

## Limitations
- ASX announcements endpoint support can vary; this starter degrades gracefully when unavailable.
- Some tickers may have incomplete market data (confidence score and completeness checklist reflect this).
- Keyword-based sentiment/catalyst/red-flag extraction is simplistic and intentionally transparent.

## Tests
- `npm run test` executes unit tests for scoring and the 3-month doubling frequency helper.


## Deploying to GitHub Pages
1. In GitHub: **Settings → Pages → Source = GitHub Actions**.
2. Push to `main` (or run the workflow manually via **workflow_dispatch**).
3. The workflow builds a static export and deploys it to Pages.

### URL pattern
- `https://<username>.github.io/invest-guide/`

### Deployment checklist
- Push to `main` triggers `.github/workflows/pages.yml`.
- App is served under `/invest-guide` (via `basePath` and `assetPrefix`).
- Refreshing deep links should avoid common static-host 404s (via `trailingSlash: true`).
- Assets load from the repo subpath.
- `.nojekyll` is created in the published output.
