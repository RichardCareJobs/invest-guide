"use client";

import { useState } from "react";

const TERMS: Array<{ term: string; meaning: string }> = [
  { term: "Volatility", meaning: "How sharply prices move up and down. Higher volatility means bigger price swings." },
  { term: "Drawdown", meaning: "The drop from a recent peak to a later low." },
  { term: "Liquidity", meaning: "How easy it is to buy or sell without moving the price too much." },
  { term: "Dilution", meaning: "When new shares are issued, each existing share represents a smaller ownership percentage." },
  { term: "Guidance", meaning: "Management's own expectation about future business performance." }
];

export function GlossaryModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="rounded bg-slate-700 px-3 py-2 text-sm"
        onClick={() => setOpen(true)}
      >
        Glossary
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Beginner glossary">
          <div className="w-full max-w-xl rounded bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-bold">Beginner Glossary</h3>
            <ul className="space-y-2 text-sm">
              {TERMS.map(({ term, meaning }) => (
                <li key={term}>
                  <strong>{term}:</strong> {meaning}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 rounded bg-indigo-600 px-3 py-2"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
