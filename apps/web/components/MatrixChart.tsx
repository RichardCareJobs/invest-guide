import Link from "next/link";
import type { TickerAnalysis } from "@invest-guide/core";

export function MatrixChart({ items }: { items: TickerAnalysis[] }) {
  return (
    <div className="relative mt-4 h-80 rounded border border-slate-700 bg-slate-900 p-4">
      <div className="absolute inset-x-4 top-1/2 h-px bg-slate-700" />
      <div className="absolute inset-y-4 left-1/2 w-px bg-slate-700" />
      {items.map((item) => {
        const left = `${Math.min(95, Math.max(5, item.riskScore))}%`;
        const bottom = `${Math.min(95, Math.max(5, item.rewardScore))}%`;
        return (
          <Link
            key={item.code}
            href={`/ticker/${item.code}/`}
            className="absolute -translate-x-1/2 translate-y-1/2 rounded bg-indigo-500 px-2 py-1 text-xs"
            style={{ left, bottom }}
          >
            {item.code}
          </Link>
        );
      })}
      <p className="absolute bottom-1 left-2 text-xs">Risk →</p>
      <p className="absolute left-1 top-2 text-xs">↑ Potential reward indicators</p>
    </div>
  );
}
