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
  const nextTarget = getNextReferralTarget(referrals);

  const referralLink = useMemo(() => user.referralCode && typeof window !== "undefined" ? `${window.location.origin}/?ref=${user.referralCode}` : "", [user.referralCode]);
  const progress = Math.min((currentBalance / WITHDRAWAL_THRESHOLD) * 100, 100);
  const bonus = Math.max(user.miningRate - BASE_MINING_RATE, 0);

  async function copyLink() {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="min-h-screen bg-[#09090D] px-5 py-8 pb-36 text-white">
      <div className="mx-auto max-w-md space-y-5">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8B7CF6]">Earn more FARM</p>
          <h1 className="mt-2 text-4xl font-bold">Build your FARM empire</h1>
          <p className="mt-2 text-slate-400">Invite miners, complete missions, and increase your earning power.</p>
        </header>

        <section className="rounded-3xl border border-[#292935] bg-[#121217] p-6">
          <div className="flex items-center gap-4">
            <FarmLogo size={64} />
            <div>
              <p className="text-xs text-slate-500">Your FARM balance</p>
              <p className="text-3xl font-bold">{currentBalance.toFixed(4)}</p>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-[#24242D]"><div className="h-full rounded-full bg-[#8B5CF6]" style={{width:`${progress}%`}} /></div>
          <p className="mt-2 text-xs text-slate-500">{progress.toFixed(1)}% toward withdrawal</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-4"><p className="text-xs text-slate-500">Mining rate</p><p className="mt-2 text-xl font-bold">{user.miningRate.toFixed(2)}</p><p className="text-xs text-slate-500">FARM/hr</p></div>
          <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-4"><p className="text-xs text-slate-500">Referral boost</p><p className="mt-2 text-xl font-bold">+{bonus.toFixed(2)}</p><p className="text-xs text-slate-500">FARM/hr</p></div>
        </section>

        <section className="rounded-3xl border border-[#292935] bg-[#121217] p-5">
          <h2 className="text-2xl font-bold">Invite friends. Earn together.</h2>
          <p className="mt-2 text-sm text-slate-400">Every successful referral increases your mining power and helps grow the Star-Miner network.</p>
          <div className="mt-5"><ReferralStats referrals={referrals} miningRate={user.miningRate}/><ReferralProgress referrals={referrals} target={nextTarget}/></div>
        </section>

        <section className="rounded-3xl border border-[#292935] bg-[#121217] p-5">
          <h2 className="text-xl font-bold">Your invitation link</h2>
          <div className="mt-4 rounded-xl bg-[#0F0F14] p-3 text-xs text-slate-300 truncate">{referralLink || "Loading..."}</div>
          <button onClick={copyLink} className="mt-4 w-full rounded-2xl bg-[#6C38FF] py-3 font-semibold">{copied ? "Copied" : "Copy link"}</button>
        </section>

        <section className="rounded-2xl border border-[#22222D] bg-[#0F0F14] p-4 text-sm text-slate-400">
          <b className="text-white">More ways to earn coming soon</b><br/>Missions, ecosystem rewards, and future FARM utilities will expand your opportunities.
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
