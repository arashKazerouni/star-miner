"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import BottomNav from "@/components/navigation/BottomNav";
import ReferralStats from "@/components/referrals/ReferralStats";
import ReferralProgress from "@/components/referrals/ReferralProgress";
import { getNextReferralTarget } from "@/lib/referrals";

export default function EarnPage() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const referrals = user.referrals;
  const miningRate = user.miningRate;
  const nextTarget = getNextReferralTarget(referrals);
  const referralLink =
    user.referralCode && typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${user.referralCode}`
      : "";

  async function copyReferralLink() {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="relative z-0 min-h-screen bg-[#09090D] px-5 py-10 pb-36 text-white">
      <div className="mx-auto max-w-md">
        <section className="relative overflow-hidden rounded-3xl border border-[#22222D] bg-[#121217] p-6 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#6C38FF]/20 blur-3xl" />
          <p className="relative text-xs uppercase tracking-[0.35em] text-slate-500">Earn XLM</p>
          <h1 className="relative mt-4 text-4xl font-bold tracking-tight">Grow your farm</h1>
          <p className="relative mt-3 text-sm leading-6 text-slate-400">
            Invite farmers, increase your mining power, and unlock more Stellar rewards.
          </p>
          <div className="mt-6 rounded-2xl border border-[#22222D] bg-[#0F0F14] p-5">
            <p className="text-xs uppercase tracking-widest text-slate-500">Mining boost</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{miningRate} XLM</p>
            <p className="mt-1 text-xs text-[#10B981]">Active reward multiplier</p>
          </div>
        </section>
        <section className="mt-6 space-y-4">
          <ReferralStats referrals={referrals} miningRate={miningRate} />
          <ReferralProgress referrals={referrals} target={nextTarget} />
        </section>
        <section className="mt-8 rounded-3xl border border-[#22222D] bg-[#121217] p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Your referral link</p>
          <div className="mt-4 rounded-2xl border border-[#22222D] bg-[#0F0F14] p-4">
            <code className="block truncate text-xs text-slate-300">{referralLink || "Loading referral link..."}</code>
          </div>
          <button type="button" onClick={copyReferralLink} disabled={!referralLink} className="mt-4 w-full rounded-xl bg-[#6C38FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5A2EE5] disabled:opacity-40">
            {copied ? "Copied!" : "Copy referral link"}
          </button>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
