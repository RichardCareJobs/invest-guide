export type SourceClaim = { label: string; value: string; sourceUrl: string };

export type ConnectorDocument = {
  connector: string;
  ticker: string;
  fetchedAt: string;
  sourceUrl: string;
  rawText: string;
  summary: string;
  claims: SourceClaim[];
  metadata: Record<string, string | number | boolean>;
};

export type MarketPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type TickerAnalysis = {
  code: string;
  companyName: string;
  riskScore: number;
  rewardScore: number;
  confidence: "High" | "Medium" | "Low";
  volatility30d?: number;
  volatility90d?: number;
  maxDrawdown90d?: number;
  momentum30d?: number;
  momentum90d?: number;
  liquidityProxy?: number;
  catalysts: string[];
  redFlags: string[];
  headlines: SourceClaim[];
  sources: SourceClaim[];
  dataCompleteness: { label: string; available: boolean }[];
  whyRisk: string[];
  whyReward: string[];
};
