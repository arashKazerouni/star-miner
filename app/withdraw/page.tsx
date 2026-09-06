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
    <main className="relative z-0 min-h-screen bg-[#09090D] px-5 py-8 pb-36 text-white sm:px-6">
      <div className="mx-auto max-w-md">
        <header className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8B7CF6]">
            FARM payouts
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Withdraw XLM
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Request your mined balance to any Stellar public wallet and track
            every payout from one place.
          </p>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-[#292935] bg-[#121217] p-6 shadow-2xl">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#6C38FF]/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Available balance
                </p>
                <p className="mt-2 font-mono text-4xl font-bold tabular-nums">
                  {currentBalance.toFixed(6)}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">XLM</p>
              </div>
              <div
                className={`rounded-2xl border px-3 py-2 text-right ${eligible ? "border-[#3B2A67] bg-[#19152A]" : "border-[#292935] bg-[#0F0F14]"}`}
              >
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Status
                </p>
                <p
                  className={`mt-1 text-sm font-semibold ${eligible ? "text-[#B9ACFF]" : "text-slate-400"}`}
                >
                  {eligible ? "Eligible" : "Locked"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-[11px] text-slate-500">
                <span>Withdrawal threshold</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#24242D]">
                <div
                  className="h-full rounded-full bg-[#8B5CF6] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-600">
                <span>Minimum</span>
                <span className="font-mono">
                  {WITHDRAWAL_THRESHOLD.toFixed(6)} XLM
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5">
          <WithdrawalCard
            balance={currentBalance}
            threshold={WITHDRAWAL_THRESHOLD}
          />
        </div>

        <section className="mt-5 rounded-2xl border border-[#22222D] bg-[#0F0F14] p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B1730] text-sm text-[#B9ACFF]">
              <FarmLogo size={48} />
            </div>
            <div>
              <p className="text-sm font-semibold">
                Use a Stellar public address
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Only enter a wallet address beginning with G. Never share a
                secret key or recovery phrase.
              </p>
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
