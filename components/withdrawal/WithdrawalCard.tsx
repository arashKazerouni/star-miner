"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ExternalLink } from "lucide-react";
import { FarmLogo } from "../FarmLogo";

const STELLAR_PUBLIC_KEY = /^G[A-Z2-7]{55}$/;
const WALLET_STORAGE_KEY = "stellar-farm-stellar-wallet";

type Withdrawal = {
  id: number;
  amount: number | string;
  wallet_address: string;
  status: "pending" | "processing" | "completed" | "rejected";
  tx_hash?: string | null;
  claimable_balance_id?: string | null;
  error_message?: string | null;
  created_at: string;
};

type WithdrawalCardProps = {
  balance: number;
  threshold: number;
};

function statusClass(status: Withdrawal["status"], claimableBalanceId?: string | null) {
  if (claimableBalanceId) return "bg-violet-500/10 text-violet-300";
  if (status === "completed") return "bg-emerald-500/10 text-emerald-400";
  if (status === "rejected") return "bg-red-500/10 text-red-400";
  if (status === "processing") return "bg-amber-500/10 text-amber-300";
  return "bg-[#1B1730] text-[#B9ACFF]";
}

function displayStatus(item: Withdrawal) {
  if (item.claimable_balance_id) return "claimable";
  return item.status;
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
      .select(
        "id, amount, wallet_address, status, tx_hash, claimable_balance_id, error_message, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(20);

    setHistory((data as Withdrawal[] | null) ?? []);
    setHistoryLoading(false);
  }

  useEffect(() => {
    const storedWallet = localStorage.getItem(WALLET_STORAGE_KEY) ?? "";
    if (STELLAR_PUBLIC_KEY.test(storedWallet)) {
      setWallet(storedWallet);
    }
    void loadHistory();
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

    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: normalized }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to submit withdrawal request.");
      }

      if (payload.claimableBalanceId) {
        setMessage(
          `Withdrawal created: ${Number(payload.withdrawal.amount).toFixed(7)} FARM is waiting in a claimable balance. Add the FARM trustline to your Stellar wallet, then claim the balance.`,
        );
      } else {
        setMessage(
          `Withdrawal successful: ${Number(payload.withdrawal.amount).toFixed(7)} FARM sent to your Stellar wallet.`,
        );
      }
      setWallet(normalized);
      await loadHistory();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit withdrawal request.",
      );
      await loadHistory();
    } finally {
      setLoading(false);
    }
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
          <span className="font-mono">{threshold.toFixed(0)} FARM</span>
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
          <h2 className="mt-2 text-xl font-bold">Send FARM to your Stellar wallet</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            If the destination already has a FARM trustline, FARM is sent directly. Otherwise, the payout is placed in a claimable balance until the trustline is added.
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

          {message && (
            <div className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs leading-5 text-emerald-300">
              {message}
            </div>
          )}
          {error && (
            <p className="mt-3 text-xs leading-5 text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !wallet}
            className="mt-4 w-full rounded-2xl bg-[#6C38FF] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5A2EE5] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Processing Stellar payment..." : `Withdraw ${balance.toFixed(6)} FARM`}
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-[#22222D] bg-[#0F0F14] p-5">
          <p className="text-sm font-semibold text-slate-300">Withdrawal locked</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            You need <span className="font-mono text-slate-300">{remaining.toFixed(6)} FARM</span> more to unlock withdrawals.
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
              <p className="text-sm text-slate-400">No withdrawal requests yet.</p>
              <p className="mt-1 text-xs text-slate-600">Your requests and statuses will appear here.</p>
            </div>
          ) : historyLoading ? (
            <div className="rounded-2xl border border-[#292935] px-4 py-8 text-center text-xs text-slate-600">
              Loading withdrawal history...
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#292935] bg-[#0F0F14] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold">{Number(item.amount).toFixed(7)} FARM</p>
                    <p className="mt-1 text-[11px] text-slate-600">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${statusClass(item.status, item.claimable_balance_id)}`}>
                    {displayStatus(item)}
                  </span>
                </div>
                <p className="mt-3 truncate font-mono text-[10px] text-slate-600">{item.wallet_address}</p>
                {item.claimable_balance_id && (
                  <div className="mt-3 rounded-xl border border-violet-400/10 bg-violet-400/5 p-3">
                    <p className="text-[11px] font-semibold text-violet-200">FARM is waiting to be claimed</p>
                    <p className="mt-1 break-all font-mono text-[10px] text-slate-500">{item.claimable_balance_id}</p>
                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                      Add the FARM trustline to the destination wallet, then claim this balance.
                    </p>
                    <a
                      href={`https://horizon.stellar.org/claimable_balances/${item.claimable_balance_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A78BFA] hover:text-white"
                    >
                      View claimable balance <ExternalLink size={13} />
                    </a>
                  </div>
                )}
                {item.tx_hash && (
                  <a
                    href={`https://stellar.expert/explorer/public/tx/${item.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A78BFA] hover:text-white"
                  >
                    View Stellar transaction <ExternalLink size={13} />
                  </a>
                )}
                {item.status === "rejected" && item.error_message && (
                  <p className="mt-2 text-xs leading-5 text-red-400">{item.error_message}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-violet-400/10 bg-violet-400/5 p-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
            <FarmLogo size={34} />
          </div>
          <div>
            <p className="text-sm font-bold">Secure Stellar withdrawal</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Only a public Stellar address is used here. The FARM distribution
              signing key never reaches the browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
