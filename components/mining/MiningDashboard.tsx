"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MiningCore from "@/components/mining/MiningCore";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";

const stats = [
  ["Current Balance", "XLM"],
  ["Mining Rate", "XLM/hour"],
  ["Funded Balance", "XLM"],
];

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
      <aside className="fixed hidden h-screen w-60 border-r border-[var(--border-subtle)] bg-[var(--bg-surface-card)] p-6 md:block">
        <h2 className="text-xl font-bold">XLM Farm</h2>
        <nav className="mt-8 space-y-3 text-sm text-slate-400">
          <p className="text-white">Mining</p>
          <p>Profile</p>
          <p>Referrals</p>
          <p>Withdraw</p>
          <p>Deposit</p>
          <p>History</p>
          <p>Settings</p>
        </nav>
        <button onClick={handleLogout} className="absolute bottom-8 text-sm text-red-400">
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </aside>

      <section className="min-h-screen p-6 md:ml-60">
        <header className="mb-8 flex h-16 items-center justify-between border-b border-[var(--border-subtle)]">
          <h1 className="text-2xl font-semibold">Mining</h1>
          <div className="flex items-center gap-3">
            <span>🔔</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold">X</div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(([title, unit]) => (
            <div key={title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-card)] p-5">
              <p className="text-sm text-slate-400">{title}</p>
              <p className="mt-3 text-3xl font-bold tabular-nums">{title === "Current Balance" ? currentBalance : "12.5000"} <span className="text-sm text-slate-400">{unit}</span></p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-card)] p-6">
          <MiningCore balance={currentBalance} miningRate={user.miningRate} />
        </div>
      </section>
    </main>
  );
}
