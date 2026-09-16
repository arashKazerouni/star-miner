import test from "node:test";
import assert from "node:assert/strict";
import { getWithdrawalSettlementMode } from "./withdrawal-settlement-mode.mjs";

test("wallet with FARM trustline uses direct payment", () => {
  assert.equal(getWithdrawalSettlementMode(true), "payment");
});

test("wallet without FARM trustline uses a claimable balance", () => {
  assert.equal(getWithdrawalSettlementMode(false), "claimable_balance");
});
