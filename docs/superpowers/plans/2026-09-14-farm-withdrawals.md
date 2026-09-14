# FARM Withdrawals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing disabled withdrawal UI into a real mainnet FARM payout flow where authenticated users can request their earned FARM and the server signs the Stellar payment with a distribution-account secret stored only in server environment variables.

**Architecture:** Supabase remains the source of truth for earned FARM and withdrawal reservations. A server-only Next.js route authenticates the user, atomically reserves the full accrued balance through a Postgres function, signs/submits a FARM payment from the distribution account, and finalizes the withdrawal with the Stellar transaction hash. Failed payouts restore the reserved balance. A withdrawal ID is included as a text memo so retries can reconcile a transaction already submitted before the database update completed.

**Tech Stack:** Next.js App Router, Supabase/Postgres RPC, `@stellar/stellar-sdk`, Stellar Horizon mainnet, Albedo/Stellar Wallets Kit.

**Spec:** User-approved direct implementation request in conversation.

## Global Constraints

- Never commit or expose the distribution secret key.
- The secret is read only from `STELLAR_DISTRIBUTION_SECRET_KEY` on the server.
- FARM issuer is `GBF7ZMNV4L2PFQRHJEMQLH7FEYMIP4ZSUKQ42ZOCYL5MI5P234C2NMNB`.
- Mainnet passphrase is `Public Global Stellar Network ; September 2015`.
- Minimum withdrawal remains the existing `4500 FARM` threshold.
- Client code never receives the distribution secret.
- Stellar payments require the destination account to have a FARM trustline.

### Task 1: Database withdrawal settlement primitives
- [ ] Replace the old withdrawal RPC's incorrect XLM minimum with the FARM threshold.
- [ ] Add RPCs to finalize successful withdrawals and restore failed reservations.
- [ ] Add a transaction hash column and indexes/constraints needed for idempotent settlement.
- [ ] Keep RLS so users can only read their own withdrawals.

### Task 2: Stellar server settlement
- [ ] Add `@stellar/stellar-sdk`.
- [ ] Create server-only Stellar helpers for mainnet FARM payments.
- [ ] Load the distribution account from `STELLAR_DISTRIBUTION_SECRET_KEY`.
- [ ] Verify destination account and FARM trustline before reserving/sending.
- [ ] Build/sign/submit a payment with memo `WD:<withdrawal_id>`.
- [ ] Reconcile recent distribution-account transactions by memo before creating a duplicate payment.

### Task 3: Withdrawal API
- [ ] Create `POST /api/withdraw`.
- [ ] Require an authenticated Supabase user.
- [ ] Validate the Stellar G-address.
- [ ] Reserve the user's full accrued balance atomically.
- [ ] Submit the payment and finalize/reject the withdrawal.
- [ ] Return safe user-facing errors without exposing secrets or raw internal failures.

### Task 4: Withdrawal UI
- [ ] Enable the existing withdrawal page.
- [ ] Prefer the connected Stellar wallet when available and allow editing it.
- [ ] Submit through the API instead of calling the withdrawal RPC directly.
- [ ] Show pending/processing/completed/rejected history and StellarExpert links for completed transactions.
- [ ] Explain that FARM trustline is required.

### Task 5: Verification
- [ ] Add/update unit tests for withdrawal threshold and source-level security invariants.
- [ ] Inspect all changed files and verify no secret placeholder is committed.
- [ ] Check GitHub Actions/statuses if available.
- [ ] Report that local build/test execution was not available through the GitHub connector if no CI result exists.
