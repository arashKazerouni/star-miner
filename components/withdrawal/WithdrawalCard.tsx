"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FarmLogo } from "../FarmLogo";

const STELLAR_PUBLIC_KEY = /^G[A-Z2-7]{55}$/;
const WITHDRAWALS_ENABLED = false;

type Withdrawal = {
  id: number;
  amount: number | string;
  wallet_address: string;
  status: "pending" | "processing" | "completed" | "rejected";
  created_at: string;
};

type WithdrawalCardProps = {
  balance: number;
  threshold: number;
};

function ComingSoonState() {
  return (
    <section className="rounded-3xl border border-[#292935] bg-[#121217] p-6 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex items-center justify-center mb-[-1rem]">
          <FarmLogo size={72} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#9B8AFF]">
          FARM withdrawals
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Coming Soon
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          We&apos;re building the next stage of FARM before opening withdrawals.
          FARM is not listed yet, and we want the ecosystem, liquidity, and
          utility to be ready before we turn withdrawals on.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          Every miner, referral, and active member helps move FARM from an idea
          into a real ecosystem. Keep building your balance, invite people who
          believe in the project, and stay with us as we work toward meaningful
          utility and market access.
        </p>
        <div className="mt-7 rounded-2xl border border-[#292935] bg-[#0F0F14] p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Our approach
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            We&apos;ll enable withdrawals when FARM has the foundation to
            support them responsibly. Until then, your mining balance remains
            visible and your progress stays part of the journey.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function WithdrawalCard({
  balance,
  threshold,
}: WithdrawalCardProps) {
  const available = balance >= threshold;
  const remaining = Math.max(threshold - balance, 0);
  const [wallet, setWallet] = useState("");
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadHistory() {
    const supabase = createClient();
    const { data } = await supabase
      .from("withdrawals")
      .select("id, amount, wallet_address, status, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setHistory((data as Withdrawal[] | null) ?? []);
    setHistoryLoading(false);
  }

  useEffect(() => {
    if (WITHDRAWALS_ENABLED) {
      void loadHistory();
    } else {
      setHistoryLoading(false);
    }
  }, []);

  async function requestWithdrawal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const normalized = wallet.trim().toUpperCase();

    if (!STELLAR_PUBLIC_KEY.test(normalized)) {
      setError("Enter a valid Stellar public wallet address starting with G.");
      return;
    }

    if (!available) {
      setError(
        `You need ${remaining.toFixed(6)} FARM more before withdrawing.`,
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: requestError } = await supabase.rpc(
      "request_withdrawal",
      {
        wallet_address_input: normalized,
      },
    );

    if (requestError) {
      setError(requestError.message || "Unable to submit withdrawal request.");
    } else if (data) {
      setMessage(
        "Withdrawal request submitted. Your request is now pending review.",
      );
      setWallet("");
      await loadHistory();
    }
    setLoading(false);
  }

  if (!WITHDRAWALS_ENABLED) {
    return <ComingSoonState />;
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[#292935] bg-[#0F0F14] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Withdrawal status
            </p>
            <p className="mt-2 text-lg font-semibold">
              {available ? "Ready to withdraw" : "Keep mining"}
            </p>
          </div>
          <div
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${available ? "bg-[#1D1635] text-[#B9ACFF]" : "bg-[#19191F] text-slate-400"}`}
          >
            {available ? "ELIGIBLE" : "LOCKED"}
          </div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-slate-500">Minimum</span>
          <span className="font-mono">{threshold.toFixed(6)} FARM</span>
        </div>
      </div>

      {available ? (
        <form
          onSubmit={requestWithdrawal}
          className="rounded-3xl border border-[#292935] bg-[#121217] p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Request payout
          </p>
          <h2 className="mt-2 text-xl font-bold">
            Send FARM to your Stellar wallet
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Your full eligible FARM balance will be reserved for this request.
            Double-check the destination before submitting.
          </p>

          <label
            className="mt-5 block text-xs font-medium text-slate-400"
            htmlFor="stellar-wallet"
          >
            Stellar public address
          </label>
          <input
            id="stellar-wallet"
            value={wallet}
            onChange={(event) => setWallet(event.target.value.toUpperCase())}
            placeholder="G..."
            autoComplete="off"
            spellCheck={false}
            className="mt-2 w-full rounded-2xl border border-[#292935] bg-[#0F0F14] px-4 py-3.5 font-mono text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-[#6C38FF]"
          />

          {error && (
            <p className="mt-3 text-xs leading-5 text-red-400">{error}</p>
          )}
          {message && (
            <p className="mt-3 text-xs leading-5 text-emerald-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading || !wallet}
            className="mt-4 w-full rounded-2xl bg-[#6C38FF] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5A2EE5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading
              ? "Submitting request..."
              : `Request ${balance.toFixed(6)} FARM`}
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-[#22222D] bg-[#0F0F14] p-5">
          <p className="text-sm font-semibold text-slate-300">
            Withdrawal locked
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            You need{" "}
            <span className="font-mono text-slate-300">
              {remaining.toFixed(6)} FARM
            </span>{" "}
            more to unlock withdrawals.
          </p>
        </div>
      )}

      <div className="rounded-3xl border border-[#22222D] bg-[#121217] p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              History
            </p>
            <h2 className="mt-2 text-xl font-bold">Your withdrawals</h2>
          </div>
          <span className="text-xs text-slate-600">Last 20</span>
        </div>

        <div className="mt-5 space-y-3">
          {history.length === 0 && !historyLoading ? (
            <div className="rounded-2xl border border-dashed border-[#292935] px-4 py-8 text-center">
              <p className="text-sm text-slate-400">
                No withdrawal requests yet.
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Your requests and statuses will appear here.
              </p>
            </div>
          ) : historyLoading ? (
            <div className="rounded-2xl border border-[#292935] px-4 py-8 text-center text-xs text-slate-600">
              Loading withdrawal history...
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#292935] bg-[#0F0F14] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold">
                      {Number(item.amount).toFixed(6)} FARM
                    </p>
                    <p className="mt-1 text-[11px] text-slate-600">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                      item.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : item.status === "rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-[#1B1730] text-[#B9ACFF]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 truncate font-mono text-[10px] text-slate-600">
                  {item.wallet_address}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
