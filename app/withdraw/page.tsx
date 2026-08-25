import BottomNav from "@/components/navigation/BottomNav";
import WithdrawalCard from "@/components/withdrawal/WithdrawalCard";
import { WITHDRAWAL_THRESHOLD } from "@/lib/withdrawal";

export default function WithdrawPage() {
  const balance = 0.00012;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 pb-24 text-zinc-100">
      <div className="mx-auto max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Withdraw
        </p>

        <h1 className="mt-4 text-3xl font-medium">
          Your rewards
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
          Withdraw your STAR rewards once you reach
          the minimum balance.
        </p>

        <WithdrawalCard
          balance={balance}
          threshold={WITHDRAWAL_THRESHOLD}
        />
      </div>

      <BottomNav />
    </main>
  );
}