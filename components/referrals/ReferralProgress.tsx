type ReferralProgressProps = {
  referrals: number;
  target: number;
};

export default function ReferralProgress({
  referrals,
  target,
}: ReferralProgressProps) {
  const progress = Math.min((referrals / target) * 100, 100);

  return (
    <div className="mt-10">
      <div className="mb-3 flex justify-between text-xs text-zinc-500">
        <span>Next reward</span>
        <span>
          {referrals} / {target}
        </span>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-zinc-900">
        <div
          className="h-full rounded-full bg-zinc-100 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}