"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import MiningCore from "@/components/mining/MiningCore";
import FarmXlmPrice from "@/components/market/FarmXlmPrice";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";

function formatRate(rate: number) {
  if (rate >= 0.000001) return rate.toFixed(7);
  return rate.toExponential(2);
}

const stats = [
  ["Current Balance", "FARM"],
  ["Mining Rate", "FARM/hour"],
  ["Referrals", "users"],
] as const;

export default function MiningDashboard() {
  const { user, currentBalance } = useUser();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] text-white">
      <section className="min-h-screen p-3 max-w-2xl mx-auto">
        <header className="mb-8 flex h-16 items-center justify-between border-b border-[var(--border-subtle)]">
          <h1 className="text-2xl font-semibold">Mining</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              <LogOut size={18} />
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </header>

        <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <FarmXlmPrice />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(([title, unit]) => {
            const value =
              title === "Current Balance"
                ? currentBalance.toFixed(7)
                : title === "Mining Rate"
                  ? formatRate(user.miningRate)
                  : String(user.referrals);

            return (
              <div
                key={title}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-card)] p-5"
              >
                <p className="text-sm text-slate-400">{title}</p>
                <p className="mt-3 text-3xl font-bold tabular-nums w-full">
                  {value}{" "}
                  <span className="text-sm text-slate-400">{unit}</span>
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-card)] p-6">
          <MiningCore balance={currentBalance} miningRate={user.miningRate} />
        </div>
      </section>
    </main>
  );
}
