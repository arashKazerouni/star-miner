export const WITHDRAWAL_THRESHOLD = 0.001;

export function canWithdraw(balance: number) {
  return balance >= WITHDRAWAL_THRESHOLD;
}

export function getRemainingAmount(balance: number) {
  return Math.max(WITHDRAWAL_THRESHOLD - balance, 0);
}