"use client";

import MiningCore from "@/components/mining/MiningCore";
import BottomNav from "@/components/navigation/BottomNav";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user, currentBalance } = useUser();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 pb-24 text-zinc-100">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <header className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
            Star Miner
          </p>
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