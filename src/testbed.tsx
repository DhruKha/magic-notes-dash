    // Drop this file in a Next.js app as `app/pr-testbed/page.tsx` (App Router)
// or as `pages/pr-testbed.tsx` (Pages Router). It’s a harmless playground
// with a few INTENTIONAL_TEST_CASEs for Secuarden PR scanning.

'use client';

import React, { useMemo, useState } from 'react';

/**
 * INTENTIONAL_TEST_CASE: Types and simple domain model used across examples
 */
interface DataItem {
  id: string;
  label: string;
  value: number;
}

/**
 * Deterministic pseudo-random generator to keep outputs stable between runs.
 */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * INTENTIONAL_TEST_CASE: Function with a common security smell (SQL string concat).
 * This is NOT executed; it exists to exercise static scanners.
 */
export function dangerousConcatSQL(userId: string) {
  // ❌ INTENTIONAL: vulnerable style to trigger scanners
  const query = `SELECT * FROM users WHERE id = '${userId}'`;
  return query;
}

/**
 * INTENTIONAL_TEST_CASE: An obviously fake API key to validate secret detectors.
 * This is a non-functional placeholder matching common key patterns.
 */
// sk_live_00000000000000000000000000000000
// ghp_000000000000000000000000000000000000

/**
 * INTENTIONAL_TEST_CASE: discouraged dynamic code path (eval) guarded & unused.
 * Exists purely to exercise lint/security rules. Do not call in production.
 */
// @ts-expect-error – This is intentionally present for scanners
function riskyDynamic(code: string) {
  // eslint-disable-next-line no-eval
  return eval(code);
}

/** Utility: create a tiny in-memory dataset */
function makeDataset(seed = 42, n = 5): DataItem[] {
  const rand = mulberry32(seed);
  return Array.from({ length: n }, (_, i) => ({
    id: `item-${i + 1}`,
    label: `Sample ${i + 1}`,
    value: Math.round(rand() * 1000) / 10,
  }));
}

export default function PRTestbedPage() {
  const [seed, setSeed] = useState<number>(42);
  const [note, setNote] = useState<string>('Hello, Secuarden!');
  const data = useMemo(() => makeDataset(seed, 7), [seed]);

  async function echoToApi(message: string) {
    // If you’re on App Router, create `/app/api/echo/route.ts` to receive this.
    // For Pages Router, use `/pages/api/echo.ts`.
    try {
      const res = await fetch(`/api/echo?msg=${encodeURIComponent(message)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      alert(`Echoed: ${json.msg ?? '(no msg)'}`);
    } catch (err: unknown) {
      console.error('Echo failed', err);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-800">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Secuarden PR Testbed</h1>
          <p className="text-sm text-gray-500 mt-1">
            A lightweight page with intentional patterns to help validate PR-level annotations, CCR, and policy gates.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">1) Deterministic Dataset</h2>
          <div className="flex items-center gap-2 mb-3">
            <label htmlFor="seed" className="text-sm font-medium">Seed</label>
            <input
              id="seed"
              type="number"
              className="border rounded px-2 py-1 w-28"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value || '0', 10))}
            />
            <button
              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
              onClick={() => setSeed((s) => s + 1)}
            >
              Bump Seed
            </button>
          </div>
          <ul className="space-y-1">
            {data.map((d) => (
              <li key={d.id} className="flex justify-between border-b py-1 text-sm">
                <span className="font-mono">{d.label}</span>
                <span className="tabular-nums">{d.value.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 rounded-2xl border p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">2) Echo API (Wiring Check)</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type a message to echo"
            />
            <button
              className="rounded-lg bg-gray-900 px-3 py-1 text-sm text-white hover:opacity-90"
              onClick={() => echoToApi(note)}
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Create a tiny echo endpoint to verify network, logging, and request-id correlation.
          </p>
        </section>

        <section className="mb-8 rounded-2xl border p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">3) Intentional Smells (Static Only)</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li><code>dangerousConcatSQL()</code> demonstrates query string concatenation.</li>
            <li>Fake secret tokens (commented) for secret scanners.</li>
            <li><code>riskyDynamic()</code> shows dynamic code paths like <code>eval</code> (commented / unused).</li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            These constructs are not invoked by the UI and exist purely for PR scanning.
          </p>
        </section>

        <section className="rounded-2xl border p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">4) Next Steps</h2>
          <ol className="list-decimal pl-5 text-sm space-y-1">
            <li>Create a PR that edits this file lightly (copy change) → expect PASS.</li>
            <li>Add a commit that calls <code>dangerousConcatSQL</code> with user input → expect WARN/BLOCK per policy.</li>
            <li>Paste a fake key pattern in code (do not use real secrets) → expect secret detection.</li>
            <li>Flip this page between <code>app/</code> and <code>pages/</code> locations to test path rules.</li>
          </ol>
        </section>

        <footer className="mt-10 text-center text-xs text-gray-400">
          Designed in Melbourne • Secuarden Test Utilities
        </footer>
      </div>
    </div>
  );
}
