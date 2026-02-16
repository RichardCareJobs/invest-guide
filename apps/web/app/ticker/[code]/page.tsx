import type { TickerAnalysis } from "@invest-guide/core";
import payload from "../../../../../data/demo-analysis.json";

export async function generateStaticParams() {
  const all = (payload as { all: TickerAnalysis[] }).all;
  return all.map((x) => ({ code: x.code }));
}

export default async function TickerPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const item = (payload as { all: TickerAnalysis[] }).all.find((x) => x.code === code);

  if (!item) {
    return <main className="p-8">Ticker not found.</main>;
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">{item.code} deep dive</h1>
      <p className="mt-2 rounded bg-rose-950/50 p-2 text-sm">Not financial advice. High risk. Past performance ≠ future results.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded border border-slate-700 p-4">
          <h2 className="font-semibold">Key risk flags</h2>
          <ul className="list-disc pl-5">{item.redFlags.length ? item.redFlags.map((r) => <li key={r}>{r}</li>) : <li>No red-flag keywords found in sampled docs.</li>}</ul>
        </section>
        <section className="rounded border border-slate-700 p-4">
          <h2 className="font-semibold">Catalysts</h2>
          <ul className="list-disc pl-5">{item.catalysts.length ? item.catalysts.map((c) => <li key={c}>{c}</li>) : <li>No catalyst keywords found in sampled docs.</li>}</ul>
        </section>
      </div>

      <section className="mt-6 rounded border border-slate-700 p-4">
        <h2 className="font-semibold">Volatility metrics</h2>
        <ul>
          <li>30d volatility: {item.volatility30d?.toFixed(2) ?? "Unavailable"}</li>
          <li>90d volatility: {item.volatility90d?.toFixed(2) ?? "Unavailable"}</li>
          <li>90d max drawdown: {item.maxDrawdown90d?.toFixed(2) ?? "Unavailable"}</li>
        </ul>
      </section>

      <section className="mt-6 rounded border border-slate-700 p-4">
        <h2 className="font-semibold">Recent headlines and announcement snippets</h2>
        <ul className="list-disc pl-5">
          {item.headlines.map((h, i) => (
            <li key={`${h.sourceUrl}-${i}`}>
              <a href={h.sourceUrl} target="_blank" className="text-indigo-300 underline" rel="noreferrer">{h.label}</a> — {h.value}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
