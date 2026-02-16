"use client";

import { useState } from "react";

const TERMS = [
  ["Volatility", "How sharply prices move up/down. Higher volatility means larger swings."],
  ["Drawdown", "The drop from a recent peak to a later low."],
  ["Liquidity", "How easy it is to buy/sell without moving price much."],
  ["Dilution", "When new shares are issued, reducing each old share's ownership."],
  ["Guidance", "Management's own expectation for future performance."]
];

export function GlossaryModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="rounded bg-slate-700 px-3 py-2 text-sm" onClick={() => setOpen(true)}>Glossary</button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-w-xl rounded bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-bold">Beginner Glossary</h3>
            <ul className="space-y-2 text-sm">
              {TERMS.map(([term, meaning]) => (
                <li key={term}><strong>{term}:</strong> {meaning}</li>
              ))}
            </ul>
            <button className="mt-4 rounded bg-indigo-600 px-3 py-2" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
