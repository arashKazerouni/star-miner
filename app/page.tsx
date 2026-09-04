import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MiningDashboard from "@/components/mining/MiningDashboard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) return <MiningDashboard />;

  const { ref } = await searchParams;
  const referralQuery = ref ? `?ref=${encodeURIComponent(ref)}` : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090D] px-6 py-10 text-white">
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.15),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-xl flex-col justify-center">
        <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-8 shadow-[0_0_40px_rgba(108,56,255,0.08)]">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6C38FF] text-2xl font-bold shadow-[0_4px_20px_rgba(108,56,255,0.35)]">
              X
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.35em] text-slate-400">
              Stellar Farm
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight">
              Farm XLM.
              <br />
              Grow your Stellar journey.
            </h1>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-slate-400">
              Start mining rewards, build your balance, and participate in the Stellar ecosystem.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={`/register${referralQuery}`}
              className="flex w-full items-center justify-center rounded-lg bg-[#6C38FF] px-5 py-3.5 text-sm font-semibold transition hover:bg-[#5A2EE5]"
            >
              Create account
            </Link>

            <Link
              href={`/login${referralQuery}`}
              className="flex w-full items-center justify-center rounded-lg border border-[#22222D] bg-[#0F0F14] px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-[#353545]"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
