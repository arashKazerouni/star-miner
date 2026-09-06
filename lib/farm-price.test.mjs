import test from "node:test";
import assert from "node:assert/strict";
import { calculateMidPrice } from "./farm-price.mjs";

test("calculates FARM/XLM from the top bid and ask", () => {
  assert.equal(
    calculateMidPrice({
      bids: [{ price: "0.0800000" }],
      asks: [{ price: "0.1000000" }],
    }),
    0.09,
  );
});

test("uses the available side when the order book is one-sided", () => {
  assert.equal(
    calculateMidPrice({
      bids: [{ price: "0.0800000" }],
      asks: [],
    }),
    0.08,
  );
});

test("returns null when there is no usable market price", () => {
  assert.equal(calculateMidPrice({ bids: [], asks: [] }), null);
  assert.equal(calculateMidPrice(null), null);
});
