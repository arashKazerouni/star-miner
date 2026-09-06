"use client";

import { useEffect, useState } from "react";

const REFRESH_MS = 30_000;

type PriceResponse = {
  price: number | null;
  farmUsd: number | null;
  xlmUsd: number | null;
  inversePrice: number | null;
};

function formatNumber(value: number, digits = 8) {
  if (value >= 1) return value.toFixed(Math.min(digits, 4));
  if (value >= 0.01) return value.toFixed(Math.min(digits, 6));
  if (value >= 0.000001) return value.toFixed(digits);
  return value.toExponential(4);
}

function formatUsd(value: number) {
  if (value >= 1) return `$${value.toFixed(4)}`;
  if (value >= 0.01) return `$${value.toFixed(6)}`;
  return `$${value.toFixed(8)}`;
}

export default function FarmXlmPrice({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<PriceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/farm-price", { cache: "no-store" });
        const next = (await response.json()) as PriceResponse;
        if (active && response.ok && typeof next.price === "number") {
          setData(next);
        }
      } catch {
        // Keep the last known value visible if a refresh fails.
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    const interval = window.setInterval(load, REFRESH_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  if (compact) {
    return (
      <div className="text-right">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Live FARM value</div>
        <div className="mt-1 font-bold tabular-nums text-white">
          {data ? `1 FARM = ${formatNumber(data.price)} XLM` : loading ? "Loading live value..." : "Live value unavailable"}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        Live FARM market data
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-[#22222D] bg-[#0F0F14] px-3 py-3">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">FARM / XLM</div>
          <div className="mt-1 font-bold tabular-nums text-white">
            {data ? formatNumber(data.price) : loading ? "…" : "—"}
          </div>
        </div>
        <div className="rounded-xl border border-[#22222D] bg-[#0F0F14] px-3 py-3">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">1 FARM</div>
          <div className="mt-1 font-bold tabular-nums text-white">
            {data ? formatUsd(data.farmUsd ?? 0) : loading ? "…" : "—"}
          </div>
        </div>
        <div className="rounded-xl border border-[#22222D] bg-[#0F0F14] px-3 py-3">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">1 XLM</div>
          <div className="mt-1 font-bold tabular-nums text-white">
            {data ? `${formatUsd(data.xlmUsd ?? 0)} / ${formatNumber(data.inversePrice ?? 0)} FARM` : loading ? "…" : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
