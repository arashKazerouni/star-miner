"use client";

import { useEffect, useState } from "react";

const REFRESH_MS = 30_000;

type PriceResponse = {
  price: number | null;
  updatedAt?: string;
};

function formatPrice(price: number) {
  if (price >= 1) return price.toFixed(4);
  if (price >= 0.01) return price.toFixed(6);
  if (price >= 0.000001) return price.toFixed(8);
  return price.toExponential(4);
}

export default function FarmXlmPrice({ compact = false }: { compact?: boolean }) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/farm-price", { cache: "no-store" });
        const data = (await response.json()) as PriceResponse;
        if (active && response.ok && typeof data.price === "number") {
          setPrice(data.price);
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

  return (
    <div className={compact ? "text-right" : "text-center"}>
      <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        Live FARM value
      </div>
      <div className="mt-1 font-bold tabular-nums text-white">
        {price !== null ? `1 FARM = ${formatPrice(price)} XLM` : loading ? "Loading live value..." : "Live value unavailable"}
      </div>
    </div>
  );
}
