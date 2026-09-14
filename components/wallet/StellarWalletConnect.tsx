"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, ShieldCheck, Wallet, X } from "lucide-react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit/sdk";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";

const STORAGE_KEY = "stellar-farm-stellar-wallet";

let kitInitialized = false;

function ensureKit() {
  if (kitInitialized) return;

  StellarWalletsKit.init({
    modules: [new AlbedoModule()],
  });

  kitInitialized = true;
}

function shortenAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export default function StellarWalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedAddress = window.localStorage.getItem(STORAGE_KEY);
    if (savedAddress) setAddress(savedAddress);
  }, []);

  async function connectWallet() {
    setConnecting(true);
    setError(null);

    try {
      ensureKit();
      const result = await StellarWalletsKit.authModal();
      setAddress(result.address);
      window.localStorage.setItem(STORAGE_KEY, result.address);
    } catch (connectionError) {
      if (connectionError instanceof Error && connectionError.message) {
        setError(connectionError.message);
      } else {
        setError("Wallet connection was cancelled or failed.");
      }
    } finally {
      setConnecting(false);
    }
  }

  function disconnectWallet() {
    setAddress(null);
    window.localStorage.removeItem(STORAGE_KEY);
    setError(null);
  }

  async function copyAddress() {
    if (!address) return;

    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="rounded-3xl border border-[#22222D] bg-[#121217] p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6C38FF]/10 text-[#A78BFA]">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">
              Stellar wallet
            </p>
            <h2 className="mt-1 text-lg font-bold">Connect your wallet</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#64748B]">
              Connect Albedo to unlock future ecosystem missions and on-chain
              rewards.
            </p>
          </div>
        </div>

        {address ? (
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <Check size={14} /> Connected
          </span>
        ) : null}
      </div>

      {address ? (
        <div className="mt-5 rounded-2xl border border-[#22222D] bg-[#0F0F14] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-[#64748B]">Connected Stellar address</p>
              <p className="mt-1 break-all font-mono text-sm text-white">
                <span className="sm:hidden">{shortenAddress(address)}</span>
                <span className="hidden sm:inline">{address}</span>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={copyAddress}
                className="inline-flex items-center gap-2 rounded-xl border border-[#2B2B38] bg-[#121217] px-3 py-2 text-xs font-semibold text-[#CBD5E1] transition hover:border-[#6C38FF]/40 hover:text-white"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={`https://stellar.expert/explorer/public/account/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2B2B38] bg-[#121217] px-3 py-2 text-xs font-semibold text-[#CBD5E1] transition hover:border-[#6C38FF]/40 hover:text-white"
              >
                Explorer <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={disconnectWallet}
                aria-label="Disconnect wallet"
                className="inline-flex items-center justify-center rounded-xl border border-[#2B2B38] bg-[#121217] px-3 py-2 text-[#94A3B8] transition hover:border-red-500/30 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={connectWallet}
          disabled={connecting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C38FF] px-5 py-3 text-sm font-bold transition hover:bg-[#5A2EE5] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <Wallet size={16} />
          {connecting ? "Opening Albedo..." : "Connect Albedo"}
        </button>
      )}

      <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-4">
        <ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={18} />
        <p className="text-xs leading-5 text-[#94A3B8]">
          Star Miner never asks for your secret key or recovery phrase. Albedo
          keeps your secret key private and only shares the public wallet
          address with this app.
        </p>
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border border-red-500/15 bg-red-500/5 px-3 py-2 text-xs leading-5 text-red-300">
          {error}
        </p>
      ) : null}
    </section>
  );
}
