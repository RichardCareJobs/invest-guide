"use client";

import Link from "next/link";
import { useState } from "react";
import { GlossaryModal } from "@/components/GlossaryModal";

export default function HomePage() {
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [universe, setUniverse] = useState("ASX20");

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-4xl font-bold">ASX Risk–Reward Matrix (Educational)</h1>
      <p className="mt-4 max-w-3xl text-slate-300">
        This tool uses publicly available web sources to build an educational shortlist. It never provides a single “best” stock and never guarantees returns.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded border border-slate-800 p-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={beginnerMode} onChange={(e) => setBeginnerMode(e.target.checked)} />
          Beginner mode
        </label>
        <select value={universe} onChange={(e) => setUniverse(e.target.value)} className="rounded bg-slate-800 px-3 py-2">
          <option>ASX20</option>
          <option>ASX50</option>
          <option>ASX200</option>
        </select>
        <Link href={`/results/?universe=${universe}&beginner=${beginnerMode ? "1" : "0"}`} className="rounded bg-indigo-600 px-4 py-2 font-semibold">Run analysis</Link>
        <GlossaryModal />
      </div>

      {beginnerMode ? (
        <div className="mt-6 rounded border border-indigo-700 bg-indigo-950/40 p-4 text-sm">
          <p><strong>Beginner tip:</strong> “Safer + double quickly” is usually contradictory. This app shows ranges of risk and what assumptions are needed for extreme outcomes.</p>
        </div>
      ) : null}
    </main>
  );
}
