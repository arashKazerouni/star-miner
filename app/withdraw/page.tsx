"use client";

import { FarmLogo } from "@/components/FarmLogo";
import BottomNav from "@/components/navigation/BottomNav";
import WithdrawalCard from "@/components/withdrawal/WithdrawalCard";
import { useUser } from "@/context/UserContext";
import { WITHDRAWAL_THRESHOLD } from "@/lib/withdrawal";

export default function WithdrawPage() {
  const { currentBalance } = useUser();
  const progress = Math.min((currentBalance / WITHDRAWAL_THRESHOLD) * 100, 100);
  const eligible = currentBalance >= WITHDRAWAL_THRESHOLD;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050713] px-4 py-6 pb-36 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,56,255,.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-md space-y-5">
        <header>
          <p className="text-xs uppercase tracking-[.35em] text-violet-300">FARM payouts</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Withdraw your FARM</h1>
          <p className="mt-2 text-sm text-slate-400">Convert your mining progress into real Stellar ecosystem rewards.</p>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.06] p-5 backdrop-blur-xl">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FarmLogo size={56} />
                <div>
                  <p className="text-xs text-slate-400">Available FARM</p>
                  <p className="mt-1 font-mono text-3xl font-black">{currentBalance.toFixed(4)}</p>
                </div>
              </div>
              <div className={`rounded-xl border px-3 py-2 ${eligible ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-black/20"}`}>
                <p className="text-[10px] uppercase text-slate-500">Status</p>
                <p className="text-sm font-bold">{eligible ? "Ready" : "Locked"}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Withdrawal progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Minimum withdrawal</span>
                <span>{WITHDRAWAL_THRESHOLD.toFixed(0)} FARM</span>
              </div>
            </div>
          </div>
        </section>

        <WithdrawalCard balance={currentBalance} threshold={WITHDRAWAL_THRESHOLD} />

        <section className="rounded-2xl border border-white/10 bg-white/[.04] p-4 backdrop-blur-xl">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <FarmLogo size={34} />
            </div>
            <div>
              <p className="text-sm font-bold">Secure Stellar withdrawal</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Use only a public Stellar address starting with G. Never share private keys or recovery phrases.</p>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
