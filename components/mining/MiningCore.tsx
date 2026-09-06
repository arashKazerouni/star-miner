import { FarmLogo } from "../FarmLogo";

type MiningCoreProps = {
  balance: number;
  miningRate: number;
  isMining?: boolean;
};

function formatRate(rate: number) {
  if (rate >= 0.01) return rate.toFixed(2);
  return rate.toExponential(2);
}

export default function MiningCore({ balance, miningRate }: MiningCoreProps) {
  return (
    <section className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-sm text-zinc-500">Your balance</p>

        <p className="mt-2 font-mono text-4xl font-medium tracking-tight">
          {balance.toFixed(7)}
        </p>

        <p className="mt-1 text-xs tracking-[0.2em] text-zinc-500">FARM</p>
      </div>

      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full border border-zinc-800" />
        <div className="absolute h-24 w-24 rounded-full border border-zinc-700" />
        <FarmLogo size={92} />
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Mining active
      </div>

      <p className="font-mono text-xs text-zinc-500">
        +{formatRate(miningRate)} FARM / hour
      </p>
    </section>
  );
}
