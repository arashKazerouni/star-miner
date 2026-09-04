"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MiningCore from "@/components/mining/MiningCore";
import BottomNav from "@/components/navigation/BottomNav";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";

export default function MiningDashboard() {
  const { user, currentBalance } = useUser();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 pb-24 text-zinc-100">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <header className="mb-16 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            Star Miner
          </p>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-xs font-medium text-zinc-400 transition hover:text-white disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </header>

        <MiningCore
          balance={currentBalance}
          miningRate={user.miningRate}
        />
      </div>

      <BottomNav />
    </main>
  );
}
