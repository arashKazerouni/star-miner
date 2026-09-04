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
    <main className="min-h-screen bg-zinc-950 px-5 py-10 pb-28 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Stellar Farm
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Earn More XLM
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Grow your mining power by inviting friends and building your farm network.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-2xl shadow-black/30">
          <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Mining boost
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              +{miningRate} XLM
              <span className="ml-2 text-sm font-normal text-zinc-500">/ day</span>
            </p>
          </div>

          <ReferralStats referrals={referrals} miningRate={miningRate} />
          <ReferralProgress referrals={referrals} target={nextTarget} />
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Your referral link
          </p>

          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
            <code className="block truncate text-xs text-zinc-300">
              {referralLink || "Loading referral link..."}
            </code>
          </div>

          <button
            type="button"
            onClick={copyReferralLink}
            disabled={!referralLink}
            className="mt-3 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-40"
          >
            {copied ? "Copied!" : "Copy Referral Link"}
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
