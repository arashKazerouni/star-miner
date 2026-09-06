export const BASE_MINING_RATE = 0.05;
export const REFERRAL_MINING_BONUS = 0.01;

export function calculateMiningRate(referrals: number) {
  const safeReferrals = Math.max(0, Math.floor(Number(referrals) || 0));
  return BASE_MINING_RATE + safeReferrals * REFERRAL_MINING_BONUS;
}

export function calculateMiningReward(
  miningRate: number,
  elapsedSeconds: number,
) {
  return miningRate * (elapsedSeconds / 3600);
}

export function calculateCurrentBalance(
  balance: number,
  miningRate: number,
  lastMiningUpdate: number,
  now = Date.now(),
) {
  const elapsedSeconds = Math.max((now - lastMiningUpdate) / 1000, 0);

  return balance + calculateMiningReward(miningRate, elapsedSeconds);
}
