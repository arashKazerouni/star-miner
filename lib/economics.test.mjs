import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const miningSource = await readFile(new URL("./mining.ts", import.meta.url), "utf8");
const withdrawalSource = await readFile(new URL("./withdrawal.ts", import.meta.url), "utf8");

test("Star-Miner mining economics use the approved retention rates", () => {
  assert.match(miningSource, /BASE_MINING_RATE\s*=\s*0\.05\b/);
  assert.match(miningSource, /REFERRAL_MINING_BONUS\s*=\s*0\.01\b/);
});

test("withdrawal unlock threshold is 10 FARM", () => {
  assert.match(withdrawalSource, /WITHDRAWAL_THRESHOLD\s*=\s*10\b/);
});
