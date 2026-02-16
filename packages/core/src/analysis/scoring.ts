import type { ConnectorDocument, MarketPoint, TickerAnalysis } from "../types";

const RED_FLAGS = ["capital raising", "trading halt", "downgrade", "litigation", "insolvency", "suspension", "debt covenant"];
const CATALYSTS = ["contract", "guidance upgrade", "takeover", "approval", "new product", "expansion", "acquisition", "record revenue"];
const POSITIVE_WORDS = ["growth", "beats", "strong", "improved", "upgrade", "profit"];
const NEGATIVE_WORDS = ["loss", "weak", "delay", "downgrade", "risk", "fall"];

const stdDev = (vals: number[]): number => {
  if (vals.length < 2) return 0;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (vals.length - 1);
  return Math.sqrt(variance);
};

const pctChange = (start: number, end: number): number => ((end - start) / start) * 100;

export function computeMetrics(points: MarketPoint[]) {
  const closes = points.map((p) => p.close);
  const returns = closes.slice(1).map((c, i) => (c - closes[i]!) / closes[i]!);
  const vol30 = stdDev(returns.slice(-30)) * Math.sqrt(252) * 100;
  const vol90 = stdDev(returns.slice(-90)) * Math.sqrt(252) * 100;
  const highWater = Math.max(...closes.slice(-90));
  const lowAfter = Math.min(...closes.slice(-90));
  const maxDrawdown90 = highWater === 0 ? 0 : ((lowAfter - highWater) / highWater) * 100;
  const m30 = closes.length > 30 ? pctChange(closes[closes.length - 31]!, closes[closes.length - 1]!) : 0;
  const m90 = closes.length > 90 ? pctChange(closes[closes.length - 91]!, closes[closes.length - 1]!) : 0;
  const avgDollarVol = points.slice(-30).reduce((sum, p) => sum + p.close * p.volume, 0) / Math.max(points.slice(-30).length, 1);

  return { vol30, vol90, maxDrawdown90, m30, m90, avgDollarVol };
}

const bounded = (n: number) => Math.max(0, Math.min(100, n));

export function analyzeTicker(input: {
  code: string;
  companyName: string;
  marketData: MarketPoint[];
  docs: ConnectorDocument[];
}): TickerAnalysis {
  const textBlob = input.docs.map((d) => `${d.summary} ${d.rawText}`).join(" ").toLowerCase();
  const redFlags = RED_FLAGS.filter((k) => textBlob.includes(k));
  const catalysts = CATALYSTS.filter((k) => textBlob.includes(k));
  const sentimentScore = POSITIVE_WORDS.reduce((acc, w) => acc + (textBlob.includes(w) ? 1 : 0), 0) -
    NEGATIVE_WORDS.reduce((acc, w) => acc + (textBlob.includes(w) ? 1 : 0), 0);

  const metrics = input.marketData.length > 10 ? computeMetrics(input.marketData) : null;
  const riskRaw = metrics
    ? 0.35 * Math.min(metrics.vol30, 100) +
      0.25 * Math.min(metrics.vol90, 100) +
      0.2 * Math.abs(Math.min(metrics.maxDrawdown90, 0)) +
      0.1 * (metrics.avgDollarVol > 1_000_000 ? 15 : 40) +
      0.1 * redFlags.length * 12
    : 55 + redFlags.length * 8;

  const rewardRaw = metrics
    ? 0.35 * (metrics.m30 + 50) + 0.25 * (metrics.m90 + 50) + 0.2 * catalysts.length * 12 + 0.2 * (sentimentScore + 5) * 6
    : 45 + catalysts.length * 10 + sentimentScore * 4;

  const completeness = [
    { label: "Market data (OHLCV)", available: Boolean(metrics) },
    { label: "Google News RSS", available: input.docs.some((d) => d.connector === "google-news-rss") },
    { label: "IR document/report", available: input.docs.some((d) => d.connector === "ir-document") }
  ];
  const availableCount = completeness.filter((x) => x.available).length;
  const confidence = availableCount >= 3 ? "High" : availableCount === 2 ? "Medium" : "Low";

  const claims = input.docs.flatMap((d) => d.claims);

  return {
    code: input.code,
    companyName: input.companyName,
    riskScore: bounded(riskRaw),
    rewardScore: bounded(rewardRaw),
    confidence,
    volatility30d: metrics?.vol30,
    volatility90d: metrics?.vol90,
    maxDrawdown90d: metrics?.maxDrawdown90,
    momentum30d: metrics?.m30,
    momentum90d: metrics?.m90,
    liquidityProxy: metrics?.avgDollarVol,
    catalysts,
    redFlags,
    headlines: claims.slice(0, 10),
    sources: claims,
    dataCompleteness: completeness,
    whyRisk: [
      `30d volatility: ${metrics ? metrics.vol30.toFixed(1) : "Unavailable"}%`,
      `90d max drawdown: ${metrics ? metrics.maxDrawdown90.toFixed(1) : "Unavailable"}%`,
      `Red flag signals found: ${redFlags.length}`
    ],
    whyReward: [
      `30d momentum: ${metrics ? metrics.m30.toFixed(1) : "Unavailable"}%`,
      `Catalyst keyword count: ${catalysts.length}`,
      `Headline sentiment proxy: ${sentimentScore}`
    ]
  };
}

export function threeMonthDoublingFrequency(seriesMap: Record<string, MarketPoint[]>): { checked: number; doubled: number; frequency: number | null } {
  let checked = 0;
  let doubled = 0;
  for (const points of Object.values(seriesMap)) {
    if (points.length < 64) continue;
    checked += 1;
    for (let i = 0; i < points.length - 63; i += 1) {
      const r = (points[i + 63]!.close - points[i]!.close) / points[i]!.close;
      if (r >= 1) {
        doubled += 1;
        break;
      }
    }
  }
  if (!checked) return { checked: 0, doubled: 0, frequency: null };
  return { checked, doubled, frequency: (doubled / checked) * 100 };
}
