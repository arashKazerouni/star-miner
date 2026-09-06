"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, ArrowUpRight, LogOut, Users } from "lucide-react";
import MiningCore from "@/components/mining/MiningCore";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { WITHDRAWAL_THRESHOLD } from "@/lib/withdrawal";

function formatRate(rate: number) {
  if (rate >= 0.001) return rate.toFixed(3);
  return rate.toFixed(6);
}

export default function MiningDashboard() {
  const { user, currentBalance } = useUser();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const progress = useMemo(
    () => Math.min((currentBalance / WITHDRAWAL_THRESHOLD) * 100, 100),
    [currentBalance],
  );

  async function handleLogout() {
    setLoggingOut(true);
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090D] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#6C38FF]/15 blur-[130px]" />
        <div className="absolute right-[-180px] top-[20%] h-[420px] w-[420px] rounded-full bg-[#10B981]/10 blur-[130px]" />
      </div>

      <section className="relative mx-auto min-h-screen max-w-5xl px-4 pb-28 sm:px-6 lg:px-8">
        <header className="flex h-20 items-center justify-between border-b border-[#22222D]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#64748B]">
              Stellar Farm
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              Mining Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Log out"
            className="flex items-center gap-2 rounded-xl border border-[#22222D] bg-[#121217] px-3 py-2.5 text-sm font-medium text-[#94A3B8] transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">
              {loggingOut ? "Logging out..." : "Log out"}
            </span>
          </button>
        </header>

        <div className="pt-6 sm:pt-8">
          <section className="relative overflow-hidden rounded-3xl border border-[#6C38FF]/25 bg-[radial-gradient(circle_at_75%_15%,rgba(108,56,255,0.24),transparent_42%),#121217] p-6 shadow-2xl shadow-black/30 sm:p-8">
            <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-[#8B5CF6]/10 sm:block" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Mining active
                </div>
                <p className="mt-6 text-sm text-[#64748B]">
                  Current FARM balance
                </p>
                <div className="mt-2 flex flex-wrap items-end gap-3">
                  <span className="font-mono text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                    {currentBalance.toFixed(7)}
                  </span>
                  <span className="mb-1 text-sm font-semibold tracking-[0.2em] text-[#8B5CF6]">
                    FARM
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#94A3B8]">
                  Rewards are accumulating automatically while your account is
                  active.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/earn"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6C38FF] px-4 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-[#5A2EE5]"
                  >
                    Earn more <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    href="/withdraw"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#2B2B38] bg-[#0F0F14] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#6C38FF]/40"
                  >
                    Withdraw <ArrowDownToLine size={16} />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-[#252531] bg-[#0F0F14]/80 p-5 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">
                      Mining rate
                    </p>
                    <p className="mt-2 font-mono text-2xl font-bold tabular-nums">
                      +{formatRate(user.miningRate)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#6C38FF]/10 px-3 py-2 text-xs font-semibold text-[#A78BFA]">
                    FARM / hour
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#22222D] bg-[#121217] p-3">
                    <p className="text-xs text-[#64748B]">Referrals</p>
                    <p className="mt-1 text-lg font-bold">{user.referrals}</p>
                  </div>
                  <div className="rounded-xl border border-[#22222D] bg-[#121217] p-3">
                    <p className="text-xs text-[#64748B]">Boost</p>
                    <p className="mt-1 text-lg font-bold text-emerald-400">
                      +{(user.referrals * 0.01).toFixed(2)} FARM/h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-2xl border border-[#22222D] bg-[#121217] p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">
                  Withdrawal progress
                </p>
                <p className="mt-2 text-sm text-[#94A3B8]">
                  Reach {WITHDRAWAL_THRESHOLD.toFixed(0)} FARM to unlock a
                  withdrawal request.
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-[#A78BFA]">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#22222D]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6C38FF] to-[#8B5CF6] transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          <section className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link
              href="/earn"
              className="group rounded-2xl border border-[#22222D] bg-[#121217] p-5 transition hover:-translate-y-0.5 hover:border-[#6C38FF]/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C38FF]/10 text-[#A78BFA]">
                  <Users size={18} />
                </span>
                <ArrowUpRight
                  size={17}
                  className="text-[#64748B] transition group-hover:text-white"
                />
              </div>
              <h2 className="mt-5 font-bold">Grow your rewards</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Invite friends and increase your mining rate with referral
                rewards.
              </p>
            </Link>
            <Link
              href="/withdraw"
              className="group rounded-2xl border border-[#22222D] bg-[#121217] p-5 transition hover:-translate-y-0.5 hover:border-emerald-400/30"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <ArrowDownToLine size={18} />
                </span>
                <ArrowUpRight
                  size={17}
                  className="text-[#64748B] transition group-hover:text-white"
                />
              </div>
              <h2 className="mt-5 font-bold">Manage withdrawals</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Check your eligibility, submit a Stellar wallet, and track
                requests.
              </p>
            </Link>
          </section>

          <section className="mt-4 rounded-3xl border border-[#22222D] bg-[#121217] p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#64748B]">
                  Live mining
                </p>
                <h2 className="mt-2 text-xl font-bold">Your FARM is growing</h2>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                Active
              </span>
            </div>
            <MiningCore balance={currentBalance} miningRate={user.miningRate} />
          </section>
        </div>
      </section>
    </main>
  );
}
