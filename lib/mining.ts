export const BASE_MINING_RATE = 0.000001;

export function calculateMiningReward(
  miningRate: number,
  elapsedSeconds: number
) {
  return miningRate * (elapsedSeconds / 60);
}

export function calculateCurrentBalance(
  balance: number,
  miningRate: number,
  lastMiningUpdate: number
) {
  const elapsedSeconds =
    (Date.now() - lastMiningUpdate) / 1000;

  return (
    balance +
    calculateMiningReward(miningRate, elapsedSeconds)
  );
}