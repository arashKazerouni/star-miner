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
  ["👥 Referrals", "Grow your network and unlock boosts"],
  ["🎯 Missions", "Future ecosystem challenges"],
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090D] px-5 py-8 pb-36 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#6C38FF]/20 blur-[120px]" />
        <div className="absolute right-[-180px] top-[30%] h-[420px] w-[420px] rounded-full bg-[#10B981]/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.18),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9B8CFF]">FARM economy</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">Grow your Star-Miner rewards</h1>
          <p className="mt-3 text-sm text-slate-400 lg:text-base">Mine FARM, invite miners, and build your place in the Stellar Farm ecosystem.</p>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center gap-5"><FarmLogo size={68}/><div><p className="text-xs text-slate-400">Your FARM balance</p><p className="mt-1 text-3xl font-bold">{currentBalance.toFixed(4)}</p><p className="mt-1 text-xs text-[#9B8CFF]">Powered by Stellar</p></div></div>
            <div className="mt-6 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#8B5CF6]" style={{width:`${progress}%`}}/></div>
          </div>
          <div className="grid gap-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"><p className="text-xs text-slate-400">Mining power</p><p className="mt-2 text-2xl font-bold">{user.miningRate.toFixed(2)} <span className="text-sm">FARM/hr</span></p></div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"><p className="text-xs text-slate-400">Referral boost</p><p className="mt-2 text-2xl font-bold">+{bonus.toFixed(2)} <span className="text-sm">FARM/hr</span></p></div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Invite & multiply</h2>
            <p className="mt-2 text-sm text-slate-400">Grow your mining network and increase rewards.</p>
            <div className="mt-5"><ReferralStats referrals={referrals} miningRate={user.miningRate}/><ReferralProgress referrals={referrals} target={nextTarget}/></div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Your referral link</h2>
            <div className="mt-4 rounded-xl bg-black/20 p-3 text-xs text-slate-300 truncate">{referralLink || "Loading..."}</div>
            <button onClick={copyLink} className="mt-4 w-full rounded-xl bg-[#6C38FF] py-3 text-sm font-semibold">{copied ? "Copied" : "Share & Earn"}</button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{methods.map(([title,text])=><div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"><h3 className="text-base font-semibold">{title}</h3><p className="mt-2 text-sm text-slate-400">{text}</p></div>)}</section>
      </div>
      <BottomNav />
    </main>
  );
}
