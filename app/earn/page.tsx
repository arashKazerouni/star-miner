"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";
import BottomNav from "@/components/navigation/BottomNav";
import ReferralStats from "@/components/referrals/ReferralStats";
import ReferralProgress from "@/components/referrals/ReferralProgress";
import { getNextReferralTarget } from "@/lib/referrals";
import { BASE_MINING_RATE } from "@/lib/mining";
import { WITHDRAWAL_THRESHOLD } from "@/lib/withdrawal";
import { FarmLogo } from "@/components/FarmLogo";

const methods = [
  ["⛏ Mining", "Earn FARM continuously with your miner"],
  ["👥 Referrals", "Expand your network and unlock boosts"],
  ["🎯 Missions", "Future ecosystem challenges and rewards"],
  ["🌟 Community", "Participate in Star-Miner growth"],
];

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

  return <main className="min-h-screen bg-[#070711] px-5 py-10 pb-36 text-white">
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#9B8CFF]">FARM economy</p>
        <h1 className="mt-3 text-5xl font-black">Build your Star-Miner empire</h1>
        <p className="mt-4 text-lg text-slate-400">Earn FARM, grow your mining network, and unlock future ecosystem rewards.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-[#292944] bg-gradient-to-br from-[#19192D] to-[#0E0E17] p-8 lg:col-span-2">
          <div className="flex items-center gap-6"><FarmLogo size={88}/><div><p className="text-sm text-slate-500">Current FARM balance</p><p className="text-5xl font-black">{currentBalance.toFixed(4)}</p><p className="mt-2 text-[#9B8CFF]">Stellar powered rewards</p></div></div>
          <div className="mt-8 h-3 rounded-full bg-[#25253A]"><div className="h-full rounded-full bg-[#8B5CF6]" style={{width:`${progress}%`}}/></div>
          <p className="mt-3 text-sm text-slate-500">{progress.toFixed(1)}% toward withdrawal</p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-[#292944] bg-[#11111C] p-6"><p className="text-slate-500">Mining power</p><p className="mt-2 text-3xl font-bold">{user.miningRate.toFixed(2)} FARM/hr</p></div>
          <div className="rounded-3xl border border-[#292944] bg-[#11111C] p-6"><p className="text-slate-500">Referral boost</p><p className="mt-2 text-3xl font-bold">+{bonus.toFixed(2)} FARM/hr</p></div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#292944] bg-[#11111C] p-8">
          <h2 className="text-3xl font-bold">Invite friends. Multiply growth.</h2>
          <p className="mt-3 text-slate-400">Every miner strengthens the Star-Miner network.</p>
          <ReferralStats referrals={referrals} miningRate={user.miningRate}/>
          <ReferralProgress referrals={referrals} target={nextTarget}/>
        </div>
        <div className="rounded-3xl border border-[#292944] bg-[#11111C] p-8">
          <h2 className="text-2xl font-bold">Your invitation portal</h2>
          <div className="mt-5 rounded-2xl bg-[#090912] p-4 text-sm text-slate-300 truncate">{referralLink || "Loading..."}</div>
          <button onClick={copyLink} className="mt-5 w-full rounded-2xl bg-[#6C38FF] py-4 font-bold">{copied ? "Copied" : "Share & Earn"}</button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{methods.map(([title,text])=><div key={title} className="rounded-3xl border border-[#292944] bg-[#11111C] p-6"><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm text-slate-400">{text}</p></div>)}</section>
    </div>
    <BottomNav />
  </main>;
}
