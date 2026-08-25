type ReferralStatsProps = {
  referrals: number;
  miningRate: number;
};

export default function ReferralStats({
  referrals,
  miningRate,
}: ReferralStatsProps) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-zinc-500">Friends invited</p>

          <p className="mt-2 text-3xl font-medium">
            {referrals}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500">Mining rate</p>

          <p className="mt-2 font-mono text-sm text-zinc-300">
            +{miningRate.toFixed(6)}
          </p>
        </div>
      </div>
    </section>
  );
}