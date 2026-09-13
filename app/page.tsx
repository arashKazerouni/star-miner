import Link from "next/link";

const FARM_ASSET_URL = "https://stellar.expert/explorer/public/asset/FARM-GBF7ZMNV4L2PFQRHJEMQLH7FEYMIP4ZSUKQ42ZOCYL5MI5P234C2NMNB";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const referralQuery = ref ? `?ref=${encodeURIComponent(ref)}` : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090D] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#6C38FF]/20 blur-[120px]" />
        <div className="absolute right-[-180px] top-[18%] h-[480px] w-[480px] rounded-full bg-[#10B981]/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.18),transparent_62%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6C38FF] text-base font-black shadow-[0_0_30px_rgba(108,56,255,0.35)] sm:h-10 sm:w-10 sm:text-lg">F</div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold tracking-wide">Stellar Farm</div>
            <div className="hidden text-[10px] uppercase tracking-[0.28em] text-[#64748B] sm:block">FARM ecosystem</div>
          </div>
        </Link>
        <nav className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Link href={`/login${referralQuery}`} className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#94A3B8] transition hover:text-white sm:px-4">Log in</Link>
          <Link href={`/register${referralQuery}`} className="rounded-lg bg-[#6C38FF] px-3.5 py-2.5 text-sm font-semibold shadow-[0_4px_20px_rgba(108,56,255,0.25)] transition hover:bg-[#5A2EE5] sm:px-4">Get started</Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-[#6C38FF]/25 bg-[#6C38FF]/10 px-3 py-2 text-xs font-medium text-[#C4B5FD] backdrop-blur sm:px-3.5"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.8)]" /><span>Built by ❤️ for the Stellar ecosystem</span></div>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:mt-7 sm:text-6xl sm:leading-[1.02] lg:text-8xl">Grow with <span className="bg-gradient-to-r from-white via-[#C4B5FD] to-[#8B5CF6] bg-clip-text text-transparent">Stellar.</span></h1>
        <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-6 text-[#94A3B8] sm:mt-7 sm:px-0 sm:text-lg sm:leading-7">Stellar Farm is a yield-focused platform built around XLM-based participation, transparent on-chain activity, and the FARM ecosystem.</p>
        <div className="mx-auto mt-7 flex w-full max-w-md flex-col justify-center gap-3 sm:mt-9 sm:max-w-none sm:flex-row">
          <Link href={`/register${referralQuery}`} className="w-full rounded-xl bg-[#6C38FF] px-7 py-3.5 text-sm font-bold shadow-[0_8px_35px_rgba(108,56,255,0.3)] transition hover:-translate-y-0.5 hover:bg-[#5A2EE5] sm:w-auto sm:py-4">Start your journey <span aria-hidden="true">→</span></Link>
          <Link href={`/login${referralQuery}`} className="w-full rounded-xl border border-[#22222D] bg-[#121217]/80 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-[#353545] hover:bg-[#181820] sm:w-auto sm:py-4">Access dashboard</Link>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mb-8 max-w-xl sm:mb-10"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B5CF6]">The ecosystem</p><h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">Designed around participation.</h2><p className="mt-3 text-sm leading-6 text-[#64748B]">A focused experience for users who want to participate, earn rewards, and follow activity within the Stellar ecosystem.</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[{icon:"01",title:"Participate",text:"Connect with a platform centered on XLM-based participation and the Stellar network."},{icon:"02",title:"Earn rewards",text:"Explore farming and reward mechanisms built into the Stellar Farm experience."},{icon:"03",title:"Stay transparent",text:"Keep activity grounded in transparent on-chain infrastructure and clear protocol rules."}].map((item)=>(<div key={item.icon} className="group rounded-2xl border border-[#22222D] bg-[#121217] p-5 transition hover:-translate-y-1 hover:border-[#6C38FF]/40 hover:shadow-[0_20px_60px_rgba(108,56,255,0.08)] sm:p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6C38FF]/10 text-xs font-bold text-[#A78BFA]">{item.icon}</div><h3 className="mt-5 text-lg font-bold sm:mt-6">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#64748B]">{item.text}</p></div>))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#6C38FF]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(108,56,255,0.22),transparent_45%),#121217] p-6 sm:p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#10B981]">FARM token</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">A utility token for the Stellar Farm ecosystem.</h2>
            <p className="mt-4 text-sm leading-7 text-[#94A3B8]">FARM is issued on the Stellar network and is designed to support ecosystem participation, farming, liquidity, and reward mechanisms. Availability and utility depend on the platform&apos;s technical implementation and protocol rules.</p>
            <div className="mt-6 flex flex-wrap gap-2.5 text-xs text-[#64748B] sm:mt-7 sm:gap-3"><span className="rounded-full border border-[#22222D] bg-[#0F0F14] px-3 py-2">Stellar asset</span><span className="rounded-full border border-[#22222D] bg-[#0F0F14] px-3 py-2">Live issuance</span><span className="rounded-full border border-[#22222D] bg-[#0F0F14] px-3 py-2">Utility-focused</span></div>
            <div className="mt-6"><a href={FARM_ASSET_URL} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#6C38FF]/30 bg-[#6C38FF]/10 px-5 py-3 text-sm font-semibold text-[#C4B5FD] transition hover:border-[#8B5CF6]/60 hover:bg-[#6C38FF]/20 sm:w-auto">View FARM asset <span aria-hidden="true">↗</span></a></div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#22222D] px-4 py-7 sm:px-6 sm:py-8 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-3 text-center text-xs leading-5 text-[#64748B] sm:flex-row sm:items-center sm:justify-between sm:text-left"><span>© {new Date().getFullYear()} Stellar Farm</span><span className="max-w-2xl sm:text-right">Digital assets involve risk. Review the protocol and token conditions before participating.</span></div></footer>
    </main>
  );
}
