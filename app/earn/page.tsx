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
    <main className="min-h-screen bg-zinc-950 px-5 py-10 pb-28 text-zinc-100">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-black/30">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Earn XLM</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Grow your farm</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Invite friends, increase your mining power, and earn more Stellar rewards together.
          </p>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Mining boost</p>
            <p className="mt-2 text-3xl font-bold">{miningRate} XLM</p>
            <p className="mt-1 text-xs text-zinc-500">per reward cycle</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <ReferralStats referrals={referrals} miningRate={miningRate} />
          <ReferralProgress referrals={referrals} target={nextTarget} />
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-xl shadow-black/20">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Your referral link</p>

          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <code className="block truncate text-xs text-zinc-300">
              {referralLink || "Loading referral link..."}
            </code>
          </div>

          <button
            type="button"
            onClick={copyReferralLink}
            disabled={!referralLink}
            className="mt-4 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-40"
          >
            {copied ? "Copied!" : "Copy referral link"}
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
