import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MiningDashboard from "@/components/mining/MiningDashboard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return <MiningDashboard />;

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

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C38FF] text-lg font-black shadow-[0_0_30px_rgba(108,56,255,0.35)]">
            F
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide">Stellar Farm</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#64748B]">
              FARM ecosystem
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href={`/login${referralQuery}`}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#94A3B8] transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href={`/register${referralQuery}`}
            className="rounded-lg bg-[#6C38FF] px-4 py-2.5 text-sm font-semibold shadow-[0_4px_20px_rgba(108,56,255,0.25)] transition hover:bg-[#5A2EE5]"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-16 text-center lg:px-8 lg:pb-28 lg:pt-24">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#6C38FF]/25 bg-[#6C38FF]/10 px-3.5 py-2 text-xs font-medium text-[#C4B5FD] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          Built by ❤️ for the Stellar ecosystem
        </div>

        <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
          Grow with{" "}
          <span className="bg-gradient-to-r from-white via-[#C4B5FD] to-[#8B5CF6] bg-clip-text text-transparent">
            Stellar.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#94A3B8] sm:text-lg">
          Stellar Farm is a yield-focused platform built around XLM-based
          participation, transparent on-chain activity, and the FARM ecosystem.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/register${referralQuery}`}
            className="rounded-xl bg-[#6C38FF] px-7 py-4 text-sm font-bold shadow-[0_8px_35px_rgba(108,56,255,0.3)] transition hover:-translate-y-0.5 hover:bg-[#5A2EE5]"
          >
            Start your journey <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={`/login${referralQuery}`}
            className="rounded-xl border border-[#22222D] bg-[#121217]/80 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:border-[#353545] hover:bg-[#181820]"
          >
            Access dashboard
          </Link>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["FARM", "Native ecosystem token"],
            ["XLM", "Stellar-based participation"],
            ["7 decimals", "Precision token display"],
          ].map(([value, label]) => (
            <div
              key={value}
              className="rounded-2xl border border-[#22222D] bg-[#121217]/70 p-5 text-left backdrop-blur"
            >
              <div className="text-lg font-bold">{value}</div>
              <div className="mt-1 text-xs text-[#64748B]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8B5CF6]">
            The ecosystem
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Designed around participation.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#64748B]">
            A focused experience for users who want to participate, earn
            rewards, and follow activity within the Stellar ecosystem.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: "01",
              title: "Participate",
              text: "Connect with a platform centered on XLM-based participation and the Stellar network.",
            },
            {
              icon: "02",
              title: "Earn rewards",
              text: "Explore farming and reward mechanisms built into the Stellar Farm experience.",
            },
            {
              icon: "03",
              title: "Stay transparent",
              text: "Keep activity grounded in transparent on-chain infrastructure and clear protocol rules.",
            },
          ].map((item) => (
            <div
              key={item.icon}
              className="group rounded-2xl border border-[#22222D] bg-[#121217] p-6 transition hover:-translate-y-1 hover:border-[#6C38FF]/40 hover:shadow-[0_20px_60px_rgba(108,56,255,0.08)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6C38FF]/10 text-xs font-bold text-[#A78BFA]">
                {item.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#6C38FF]/20 bg-[radial-gradient(circle_at_80%_20%,rgba(108,56,255,0.22),transparent_45%),#121217] p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#10B981]">
              FARM token
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A utility token for the Stellar Farm ecosystem.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#94A3B8]">
              FARM is issued on the Stellar network and is designed to support
              ecosystem participation, farming, liquidity, and reward
              mechanisms. Availability and utility depend on the platform&apos;s
              technical implementation and protocol rules.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs text-[#64748B]">
              <span className="rounded-full border border-[#22222D] bg-[#0F0F14] px-3 py-2">
                Stellar asset
              </span>
              <span className="rounded-full border border-[#22222D] bg-[#0F0F14] px-3 py-2">
                Live issuance
              </span>
              <span className="rounded-full border border-[#22222D] bg-[#0F0F14] px-3 py-2">
                Utility-focused
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#22222D] px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Stellar Farm</span>
          <span>
            Digital assets involve risk. Review the protocol and token
            conditions before participating.
          </span>
        </div>
      </footer>
    </main>
  );
}
