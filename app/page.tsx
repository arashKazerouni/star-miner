import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MiningDashboard from "@/components/mining/MiningDashboard";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return <MiningDashboard />;
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col justify-center">
        <div className="mb-12">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
            Star Miner
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Mine your way
            <br />
            to the stars.
          </h1>

          <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">
            Start mining, build your balance, and grow your Star Miner
            account.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="flex w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}