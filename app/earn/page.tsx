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
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-8 pb-28 text-zinc-100">
      <div className="mx-auto max-w-md space-y-6">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Earn XLM
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Grow your mining power
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Invite friends, build your network, and unlock higher Stellar rewards.
          </p>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/30 p-4">
            <p className="text-xs text-zinc-500">Current mining boost</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              +{miningRate} XLM/min
            </p>
          </div>
        </section>

        <ReferralStats referrals={referrals} miningRate={miningRate} />
        <ReferralProgress referrals={referrals} target={nextTarget} />

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-5 backdrop-blur-xl">
          <p className="text-sm text-zinc-400">Your referral link</p>

          <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <code className="block truncate text-xs text-zinc-500">
              {referralLink || "Loading referral link..."}
            </code>

            <button
              type="button"
              onClick={copyReferralLink}
              disabled={!referralLink}
              className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              {copied ? "Copied ✓" : "Copy Referral Link"}
            </button>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
