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

const methods = [["⛏ Mining","Earn FARM continuously"],["👥 Referrals","Unlock mining boosts"],["🎯 Missions","Future rewards"],["🌟 Community","Grow together"]];

export default function EarnPage(){
 const {user,currentBalance}=useUser();
 const [copied,setCopied]=useState(false);
 const referrals=user.referrals;
 const nextTarget=getNextReferralTarget(referrals);
 const referralLink=useMemo(()=>user.referralCode&&typeof window!=="undefined"?`${window.location.origin}/?ref=${user.referralCode}`:"",[user.referralCode]);
 const progress=Math.min((currentBalance/WITHDRAWAL_THRESHOLD)*100,100);
 const bonus=Math.max(user.miningRate-BASE_MINING_RATE,0);
 async function copyLink(){if(!referralLink)return;await navigator.clipboard.writeText(referralLink);setCopied(true);setTimeout(()=>setCopied(false),1500)}
 return <main className="relative min-h-screen overflow-hidden bg-[#09090D] px-5 py-10 pb-36 text-white">
  <div className="pointer-events-none absolute inset-0"><div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#6C38FF]/20 blur-[120px]"/><div className="absolute right-[-180px] top-[18%] h-[480px] w-[480px] rounded-full bg-[#10B981]/10 blur-[120px]"/><div className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.18),transparent_62%)]"/><div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"/></div>
  <div className="relative z-10 mx-auto max-w-6xl space-y-8">
   <header><p className="text-xs uppercase tracking-[0.35em] text-[#9B8CFF]">FARM economy</p><h1 className="mt-3 text-3xl font-black lg:text-4xl">Build your Star-Miner empire</h1><p className="mt-3 text-base text-[#94A3B8]">Earn FARM, grow your network, and unlock future rewards.</p></header>
   <section className="grid gap-6 lg:grid-cols-3"><div className="rounded-3xl border border-[#292944] bg-[#121217]/80 p-6 backdrop-blur lg:col-span-2"><div className="flex items-center gap-5"><FarmLogo size={72}/><div><p className="text-sm text-slate-500">FARM balance</p><p className="text-4xl font-black">{currentBalance.toFixed(4)}</p></div></div><div className="mt-6 h-2 rounded-full bg-[#24242D]"><div className="h-full rounded-full bg-[#8B5CF6]" style={{width:`${progress}%`}}/></div></div><div className="grid gap-4"><div className="rounded-3xl border border-[#292944] bg-[#121217]/80 p-5"><p className="text-sm text-slate-500">Mining power</p><p className="text-2xl font-bold">{user.miningRate.toFixed(2)}</p></div><div className="rounded-3xl border border-[#292944] bg-[#121217]/80 p-5"><p className="text-sm text-slate-500">Referral boost</p><p className="text-2xl font-bold">+{bonus.toFixed(2)}</p></div></div></section>
   <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-3xl border border-[#292944] bg-[#121217]/80 p-6"><h2 className="text-2xl font-bold">Invite friends</h2><ReferralStats referrals={referrals} miningRate={user.miningRate}/><ReferralProgress referrals={referrals} target={nextTarget}/></div><div className="rounded-3xl border border-[#292944] bg-[#121217]/80 p-6"><h2 className="text-xl font-bold">Your referral link</h2><div className="mt-4 rounded-xl bg-[#09090D] p-3 text-sm truncate">{referralLink||"Loading..."}</div><button onClick={copyLink} className="mt-4 w-full rounded-xl bg-[#6C38FF] py-3 font-bold">{copied?"Copied":"Share & Earn"}</button></div></section>
   <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{methods.map(([a,b])=><div key={a} className="rounded-2xl border border-[#292944] bg-[#121217]/80 p-5"><h3 className="font-bold">{a}</h3><p className="mt-2 text-sm text-slate-400">{b}</p></div>)}</section>
  </div><BottomNav/></main>
}
