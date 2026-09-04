"use client";

import { useUser } from "@/context/UserContext";
import BottomNav from "@/components/navigation/BottomNav";
import ReferralStats from "@/components/referrals/ReferralStats";
import ReferralProgress from "@/components/referrals/ReferralProgress";
import { calculateMiningRate, getNextReferralTarget } from "@/lib/referrals";

export default function EarnPage() {
  const { user, addReferral } = useUser();
  const referrals = user.referrals;
  const miningRate = user.miningRate;
  const nextTarget = getNextReferralTarget(referrals);

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
              starminer.app/ref/demo
            </code>

            <button className="shrink-0 text-xs text-white">Copy</button>
          </div>
        </div>

        <button
          onClick={addReferral}
          className="mt-4 w-full rounded-2xl bg-white py-4 text-sm font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]"
        >
          Simulate Referral
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
