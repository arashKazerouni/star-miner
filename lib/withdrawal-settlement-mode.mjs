export function getWithdrawalSettlementMode(hasFarmTrustline) {
  return hasFarmTrustline ? "payment" : "claimable_balance";
}
