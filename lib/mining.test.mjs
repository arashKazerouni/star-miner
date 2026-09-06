import test from "node:test";
import assert from "node:assert/strict";
import {
  BASE_MINING_RATE,
  REFERRAL_MINING_BONUS,
  calculateMiningRate,
  calculateMiningReward,
} from "./mining.ts";

test("base mining rate is calibrated for roughly 16.7 days to reach 0.001 FARM", () => {
  assert.equal(BASE_MINING_RATE, 0.0000025);
  assert.equal(BASE_MINING_RATE * 24 * 16.6666666667, 0.001,);
});

test("referrals increase mining rate by a fixed bonus", () => {
  assert.equal(calculateMiningRate(0), BASE_MINING_RATE);
  assert.equal(calculateMiningRate(1), BASE_MINING_RATE + REFERRAL_MINING_BONUS);
  assert.equal(calculateMiningRate(5), BASE_MINING_RATE + 5 * REFERRAL_MINING_BONUS);
});

test("mining reward uses FARM per hour", () => {
  assert.equal(calculateMiningReward(0.0000025, 3600), 0.0000025);
  assert.equal(calculateMiningReward(0.0000025, 1800), 0.00000125);
});
