"use client";

import { useState } from "react";

const STELLAR_ADDRESS =
  "GCTUBTBCTTFKHHAC747IPRNGIUFFKAHCO5UJF6UVHCLO44SPK3VUA6PX";

export default function DonatePage() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(STELLAR_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 pb-28 text-zinc-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <section className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/80 shadow-xl shadow-black/30">
            <span className="text-2xl">✦</span>
          </div>

          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Stellar Farm
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Build the future of XLM farming.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-zinc-400">
            Support the ecosystem and help us create a stronger, faster, and
            more valuable Stellar experience.
          </p>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-5">
          <div className="rounded-2xl bg-white p-3">
            <img
              src="/donation-qr.png"
              alt="Stellar Farm donation QR code"
              className="block w-full rounded-xl"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Stellar wallet
            </p>

            <p className="mt-3 break-all font-mono text-xs leading-5 text-zinc-300">
              {STELLAR_ADDRESS}
            </p>
          </div>

          <button
            type="button"
            onClick={copyAddress}
            className="mt-4 flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            {copied ? "✓ Copied" : "Copy wallet address"}
          </button>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
          Every contribution helps Star-Miner grow into a complete Stellar
          ecosystem.
        </p>
      </div>
    </main>
  );
}
