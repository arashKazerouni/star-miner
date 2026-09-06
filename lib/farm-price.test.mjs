import test from "node:test";
import assert from "node:assert/strict";
import { calculateFarmXlmPrice } from "./farm-price.mjs";

test("calculates FARM/XLM from USD prices", () => {
  assert.equal(calculateFarmXlmPrice(0.02, 0.05), 0.4);
});

test("returns null for invalid FARM price", () => {
  assert.equal(calculateFarmXlmPrice(0, 0.05), null);
  assert.equal(calculateFarmXlmPrice("invalid", 0.05), null);
});

test("returns null for invalid XLM price", () => {
  assert.equal(calculateFarmXlmPrice(0.02, 0), null);
  assert.equal(calculateFarmXlmPrice(0.02, "invalid"), null);
});
