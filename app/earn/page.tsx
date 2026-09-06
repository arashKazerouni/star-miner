"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";
import BottomNav from "@/components/navigation/BottomNav";
import ReferralStats from "@/components/referrals/ReferralStats";
import ReferralProgress from "@/components/referrals/ReferralProgress";
import { getNextReferralTarget } from "@/lib/referrals";
import { BASE_MINING_RATE, REFERRAL_MINING_BONUS } from "@/lib/mining";
import { WITHDRAWAL_THRESHOLD } from "@/lib/withdrawal";
import { FarmLogo } from "@/components/FarmLogo";

export default function EarnPage() {
  const { user, currentBalance } = useUser();
  const [copied, setCopied] = useState(false);
  const referrals = user.referrals;
  const miningRate = user.miningRate;
  const nextTarget = getNextReferralTarget(referrals);

  const referralLink = useMemo(
    () =>
      user.referralCode && typeof window !== "undefined"
        ? `${window.location.origin}/?ref=${user.referralCode}`
        : "",
    [user.referralCode],
  );

  const referralBonus = Math.max(miningRate - BASE_MINING_RATE, 0);
  const progressToWithdraw = Math.min(
    (currentBalance / WITHDRAWAL_THRESHOLD) * 100,
    100,
  );

  async function copyReferralLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="relative z-0 min-h-screen bg-[#09090D] px-5 py-8 pb-36 text-white">
      <div className="mx-auto max-w-md">
        <header className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8B7CF6]">
            Earn more FARM
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Grow your farm
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Build your mining rate by bringing more farmers into the network.
          </p>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-[#292935] bg-[#121217] p-6 shadow-2xl">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#6C38FF]/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Current balance
                </p>
                <p className="mt-2 text-4xl font-bold tabular-nums">
                  {currentBalance.toFixed(6)}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">FARM</p>
              </div>
              <div className="rounded-2xl border border-[#2B2744] bg-[#19152A] px-3 py-2 text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Mining rate
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-[#B9ACFF]">
                  {miningRate.toFixed(2)} / hr
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-[11px] text-slate-500">
                <span>Progress to minimum withdrawal</span>
                <span>{progressToWithdraw.toFixed(1)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#24242D]">
                <div
                  className="h-full rounded-full bg-[#8B5CF6] transition-all duration-500"
                  style={{ width: `${progressToWithdraw}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {currentBalance >= WITHDRAWAL_THRESHOLD
                  ? "Minimum withdrawal reached."
                  : `${(WITHDRAWAL_THRESHOLD - currentBalance).toFixed(2)} FARM remaining`}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Your referrals
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums">{referrals}</p>
            <p className="mt-1 text-xs text-slate-500">active farmers</p>
          </div>
          <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Referral boost
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums">
              +{referralBonus.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-slate-500">FARM / hour</p>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-[#22222D] bg-[#121217] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Referral rewards
              </p>
              <h2 className="mt-2 text-xl font-bold">
                Every farmer makes you stronger
              </h2>
            </div>
            <div className="rounded-xl bg-[#1A1728] px-3 py-2 text-center">
              <p className="text-lg font-bold text-[#B9ACFF]">
                +{REFERRAL_MINING_BONUS.toFixed(2)}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                FARM / hour
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Your base mining rate is {BASE_MINING_RATE.toFixed(2)} FARM/hour.
            Each successful referral adds {REFERRAL_MINING_BONUS.toFixed(2)}{" "}
            FARM/hour.
          </p>
          <div className="mt-5">
            <ReferralStats referrals={referrals} miningRate={miningRate} />
            <ReferralProgress referrals={referrals} target={nextTarget} />
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-[#22222D] bg-[#121217] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Invite & earn
          </p>
          <h2 className="mt-2 text-xl font-bold">Share your FARM link</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Send your personal link to a friend. Once they join through it, your
            referral count and mining rate increase.
          </p>
          <div className="mt-4 rounded-2xl border border-[#292935] bg-[#0F0F14] p-4">
            <code className="block truncate text-xs text-slate-300">
              {referralLink || "Loading referral link..."}
            </code>
          </div>
          <button
            type="button"
            onClick={copyReferralLink}
            disabled={!referralLink}
            className="mt-4 w-full rounded-2xl bg-[#6C38FF] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5A2EE5] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? "Referral link copied" : "Copy referral link"}
          </button>
        </section>

        <section className="mt-5 rounded-2xl border border-[#22222D] bg-[#0F0F14] p-4">
          <div className="flex gap-3">
            <div className="">
              <FarmLogo size={48} />
            </div>
            <div>
              <p className="text-sm font-semibold">Keep mining consistently</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your balance grows automatically while mining is active.
                Referrals are the main way to increase your earning rate.
              </p>
            </div>
          </div>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
