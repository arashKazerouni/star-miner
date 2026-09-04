type WithdrawalCardProps = {
  balance: number;
  threshold: number;
};

export default function WithdrawalCard({
  balance,
  threshold,
}: WithdrawalCardProps) {
  const available = balance >= threshold;
  const remaining = Math.max(threshold - balance, 0);

  return (
    <section className="mt-10">
      <div className="border-b border-zinc-900 pb-6">
        <p className="text-sm text-zinc-500">
          Available balance
        </p>

        <p className="mt-2 font-mono text-3xl">
          {balance.toFixed(6)}
          <span className="ml-2 text-sm text-zinc-500">
            XLM
          </span>
        </p>
      </div>

      <div className="py-6">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">
            Minimum withdrawal
          </span>

          <span className="font-mono">
            {threshold.toFixed(6)} XLM
          </span>
        </div>
      </div>

      {available ? (
        <div className="rounded-2xl border border-zinc-800 p-5">
          <p className="text-sm text-white">
            Withdrawal unlocked
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Your balance is eligible for withdrawal.
          </p>

          <button className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]">
            Withdraw
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-900 p-5">
          <p className="text-sm text-zinc-300">
            Withdrawal locked
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            You need{" "}
            <span className="font-mono text-zinc-300">
              {remaining.toFixed(6)} XLM
            </span>{" "}
            more to unlock withdrawals.
          </p>
        </div>
      )}
    </section>
  );
}