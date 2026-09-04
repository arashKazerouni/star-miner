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
    <main className="min-h-screen bg-zinc-950 px-6 py-10 pb-24 text-zinc-100">
      <div className="mx-auto max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Earn</p>

        <h1 className="mt-4 text-3xl font-medium">Invite & Earn</h1>

        <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
          Invite friends and increase your mining rate.
        </p>

        <ReferralStats referrals={referrals} miningRate={miningRate} />
        <ReferralProgress referrals={referrals} target={nextTarget} />

        <div className="mt-12 rounded-2xl border border-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Your referral link</p>

          <div className="mt-4 flex items-center justify-between gap-4">
            <code className="truncate text-xs text-zinc-500">
              {referralLink || "Loading referral link..."}
            </code>

            <button
              type="button"
              onClick={copyReferralLink}
              disabled={!referralLink}
              className="shrink-0 text-xs text-white disabled:text-zinc-700"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
