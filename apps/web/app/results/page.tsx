import Link from "next/link";
import { MatrixChart } from "@/components/MatrixChart";
import type { TickerAnalysis } from "@invest-guide/core";
import payload from "../../../../data/demo-analysis.json";

type Payload = {
  disclaimer: string;
  all: TickerAnalysis[];
  doublingRealityCheck: { requiredReturn: string; note: string; frequency: { checked: number; doubled: number; frequency: number | null } };
  saferAlternatives: string[];
};

export default async function ResultsPage({
  searchParams
}: {
  searchParams: Promise<{ universe?: string; beginner?: string }>;
}) {
  const params = await searchParams;
  const universe = params.universe ?? "ASX20";
  const beginner = params.beginner === "1";
  const data = payload as Payload;
  const ranked = data.all;

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold">Risk–Reward Matrix ({universe})</h1>
      <p className="mt-2 rounded bg-rose-950/50 p-3 text-sm">{data.disclaimer}</p>
      <MatrixChart items={ranked} />

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-left">
            <th>Ticker</th><th>Risk</th><th>Reward</th><th>Confidence</th><th>Why?</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((item) => (
            <tr key={item.code} className="border-b border-slate-800 align-top">
              <td><Link className="text-indigo-300" href={`/ticker/${item.code}/`}>{item.code}</Link></td>
              <td>{item.riskScore.toFixed(1)}</td>
              <td>{item.rewardScore.toFixed(1)}</td>
              <td>{item.confidence}</td>
              <td>
                <details>
                  <summary className="cursor-pointer">Expand</summary>
                  <ul className="list-disc pl-4">
                    {item.whyRisk.map((w) => <li key={w}>Risk: {w}</li>)}
                    {item.whyReward.map((w) => <li key={w}>Reward: {w}</li>)}
                  </ul>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="mt-8 rounded border border-slate-700 p-4">
        <h2 className="text-2xl font-semibold">Doubling in 3 months reality check</h2>
        <p className="mt-2">Required return: {data.doublingRealityCheck.requiredReturn}</p>
        <p>
          Historical frequency in loaded universe: {data.doublingRealityCheck.frequency.frequency === null ? "Unavailable" : `${data.doublingRealityCheck.frequency.frequency.toFixed(2)}%`}
          &nbsp;({data.doublingRealityCheck.frequency.doubled}/{data.doublingRealityCheck.frequency.checked} tickers)
        </p>
        <p className="text-slate-300">{data.doublingRealityCheck.note}</p>
      </section>

      <section className="mt-8 rounded border border-slate-700 p-4">
        <h2 className="text-2xl font-semibold">Alternatives that can reduce risk</h2>
        <ul className="mt-2 list-disc pl-5">
          {data.saferAlternatives.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </section>

      {beginner ? <p className="mt-6 text-sm text-slate-300">Beginner mode: focus on understanding uncertainty, diversification, and data quality before considering any action.</p> : null}
    </main>
  );
}
