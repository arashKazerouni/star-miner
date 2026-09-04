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
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col justify-center">
        <div className="mb-12">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
            XLM Farm
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Farm your way
            <br />
            to Stellar.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">
            Start farming XLM, build your balance, and grow your account.
          </p>
        </div>

        <div className="space-y-3">
          <Link href={`/login${referralQuery}`} className="flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-950">
            Log in
          </Link>
          <Link href={`/register${referralQuery}`} className="flex w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3.5 text-sm font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
