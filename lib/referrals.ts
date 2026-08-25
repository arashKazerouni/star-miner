export const BASE_MINING_RATE = 0.000001;

export function calculateMiningRate(referrals: number) {
  return BASE_MINING_RATE + referrals * 0.000001;
}

export function getNextReferralTarget(referrals: number) {
  const targets = [1, 3, 5, 10, 25, 50];

  return targets.find((target) => target > referrals) ?? 50;
}

export function getReferralProgress(referrals: number) {
  const nextTarget = getNextReferralTarget(referrals);

  return Math.min((referrals / nextTarget) * 100, 100);
}