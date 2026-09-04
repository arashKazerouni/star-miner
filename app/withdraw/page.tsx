"use client";

import BottomNav from "@/components/navigation/BottomNav";
import WithdrawalCard from "@/components/withdrawal/WithdrawalCard";
import { useUser } from "@/context/UserContext";
import { WITHDRAWAL_THRESHOLD } from "@/lib/withdrawal";

export default function WithdrawPage() {
  const { currentBalance } = useUser();

  return (
    <main className="min-h-screen bg-[#09090D] px-5 py-10 pb-28 text-white sm:px-6">
      <div className="mx-auto max-w-md">
        <section className="relative overflow-hidden rounded-3xl border border-[#22222D] bg-[#121217] p-6 shadow-2xl shadow-black/40">
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(108,56,255,0.25),transparent_70%)]" />

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.35em] text-[#64748B]">
              Stellar Farm
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              Withdraw XLM
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
              Convert your mined rewards into XLM when your balance reaches the withdrawal threshold.
            </p>

            <div className="mt-6 rounded-2xl border border-[#22222D] bg-[#0F0F14] p-4">
              <p className="text-xs uppercase tracking-widest text-[#64748B]">
                Available balance
              </p>
              <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-white">
                {currentBalance.toFixed(4)} XLM
              </p>
            </div>

            <div className="mt-5">
              <WithdrawalCard
                balance={currentBalance}
                threshold={WITHDRAWAL_THRESHOLD}
              />
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
