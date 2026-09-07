import test from "node:test";
import assert from "node:assert/strict";

function calculateLiveBalance(balance, miningRate, lastMiningUpdate, now) {
  const elapsedSeconds = Math.max((now - lastMiningUpdate) / 1000, 0);
  return balance + miningRate * (elapsedSeconds / 3600);
}

test("live balance is derived from the latest persisted mining snapshot", () => {
  const snapshotBalance = 10;
  const rate = 0.05;
  const lastUpdate = 1_000_000;

  const afterFiveSeconds = calculateLiveBalance(
    snapshotBalance,
    rate,
    lastUpdate,
    lastUpdate + 5_000,
  );
  const afterTenSeconds = calculateLiveBalance(
    snapshotBalance,
    rate,
    lastUpdate,
    lastUpdate + 10_000,
  );

  assert.ok(afterTenSeconds > afterFiveSeconds);
  assert.equal(afterTenSeconds, 10 + 0.05 * (10 / 3600));
});
