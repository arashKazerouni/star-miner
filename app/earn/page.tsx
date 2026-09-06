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

const methods = [["⛏ Mining","Your passive FARM engine is always working"],["👥 Referrals","Invite miners and unlock stronger rewards"],["🎯 Missions","Future ecosystem campaigns and bonuses"],["🌟 Community","Help grow the Stellar Farm network"]];

export default function EarnPage(){
 const {user,currentBalance}=useUser();
 const [copied,setCopied]=useState(false);
 const referrals=user.referrals;
 const nextTarget=getNextReferralTarget(referrals);
 const referralLink=useMemo(()=>user.referralCode&&typeof window!=="undefined"?`${window.location.origin}/?ref=${user.referralCode}`:"",[user.referralCode]);
 const progress=Math.min((currentBalance/WITHDRAWAL_THRESHOLD)*100,100);
 const bonus=Math.max(user.miningRate-BASE_MINING_RATE,0);
 async function copyLink(){if(!referralLink)return;await navigator.clipboard.writeText(referralLink);setCopied(true);setTimeout(()=>setCopied(false),1500)}
 return <main className="relative min-h-screen overflow-hidden bg-[#050713] px-4 py-6 pb-36 text-white"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,56,255,.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,.12),transparent_30%)]"/><div className="relative z-10 mx-auto max-w-5xl space-y-5">
 <header><p className="text-xs uppercase tracking-[.35em] text-violet-300">Earn FARM</p><h1 className="mt-2 text-3xl font-bold">Build your mining empire</h1><p className="mt-2 text-sm text-slate-400">Every miner, referral, and action moves you closer to your FARM rewards.</p></header>
 <section className="rounded-3xl border border-white/10 bg-white/[.06] p-5 backdrop-blur-xl"><div className="flex items-center gap-4"><FarmLogo size={62}/><div><p className="text-xs text-slate-400">Current FARM</p><p className="text-4xl font-black">{currentBalance.toFixed(4)}</p><p className="text-xs text-violet-300">Stellar powered token economy</p></div></div><div className="mt-5 flex justify-between text-xs text-slate-400"><span>Withdrawal progress</span><span>{progress.toFixed(0)}%</span></div><div className="mt-2 h-3 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400" style={{width:`${progress}%`}}/></div></section>
 <section className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-white/[.05] p-5"><p className="text-sm text-slate-400">Mining power</p><p className="mt-2 text-2xl font-bold">{user.miningRate.toFixed(2)} <span className="text-sm">FARM/hr</span></p></div><div className="rounded-3xl border border-white/10 bg-white/[.05] p-5"><p className="text-sm text-slate-400">Referral boost</p><p className="mt-2 text-2xl font-bold">+{bonus.toFixed(2)} <span className="text-sm">FARM/hr</span></p></div></section>
 <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-white/[.05] p-5"><h2 className="text-xl font-bold">Invite & multiply</h2><p className="mt-2 text-sm text-slate-400">Grow your network and increase your mining strength.</p><div className="mt-5"><ReferralStats referrals={referrals} miningRate={user.miningRate}/><ReferralProgress referrals={referrals} target={nextTarget}/></div></div>
 <div className="rounded-3xl border border-white/10 bg-white/[.05] p-5 flex flex-col"><div><h2 className="text-xl font-bold">Your growth link</h2><p className="mt-2 text-sm text-slate-400">Share your link and invite new FARM miners.</p></div><div className="mt-4 rounded-xl bg-black/30 p-3 text-xs text-slate-300 truncate">{referralLink||"Loading..."}</div><div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-500/10 p-3"><p className="text-xs text-slate-300">Referral reward</p><p className="mt-1 font-bold">Boost your mining power with every active miner</p></div><button onClick={copyLink} className="mt-4 w-full rounded-xl bg-violet-600 py-3 font-bold transition hover:bg-violet-500">{copied?"Copied ✓":"Share & Earn"}</button></div></section>
 <section className="grid gap-3 sm:grid-cols-2">{methods.map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><h3 className="font-bold">{a}</h3><p className="mt-1 text-sm text-slate-400">{b}</p></div>)}</section></div><BottomNav/></main>
}
