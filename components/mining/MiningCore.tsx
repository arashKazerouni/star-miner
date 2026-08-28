type MiningCoreProps = {
  balance: number;
  miningRate: number;
  isMining?: boolean;
};

export default function MiningCore({
  balance,
  miningRate,
}: MiningCoreProps) {
  return (
    <section className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-sm text-zinc-500">
          Your balance
        </p>

        <p className="mt-2 font-mono text-4xl font-medium tracking-tight">
          {balance.toFixed(6)}
        </p>

        <p className="mt-1 text-xs tracking-[0.2em] text-zinc-500">
          STAR
        </p>
      </div>

      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full border border-zinc-800" />

        <div className="absolute h-24 w-24 rounded-full border border-zinc-700" />

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
          <span className="text-lg">✦</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Mining active
      </div>

      <p className="font-mono text-xs text-zinc-500">
        +{miningRate.toFixed(6)} STAR / min
      </p>
    </section>
  );
}