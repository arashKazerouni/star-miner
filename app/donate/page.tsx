"use client";

import { useState } from "react";

const STELLAR_ADDRESS =
  "GCTUBTBCTTFKHHAC747IPRNGIUFFKAHCO5UJF6UVHCLO44SPK3VUA6PX";

export default function DonatePage() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    await navigator.clipboard.writeText(STELLAR_ADDRESS);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 pb-28 text-zinc-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <section className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 text-2xl shadow-xl">
            ✦
          </div>

          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Support Stellar Farm
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Build the future of XLM farming.
          </h1>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Your support helps us improve the ecosystem, create new features,
            and continue building Stellar Farm.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="rounded-3xl bg-white p-3">
            <img
              src="/donation-qr.png"
              alt="Stellar Farm donation QR code"
              className="w-full rounded-2xl"
            />
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Stellar Wallet
            </p>

            <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <code className="break-all text-xs leading-5 text-zinc-300">
                {STELLAR_ADDRESS}
              </code>
            </div>

            <button
              onClick={copyAddress}
              className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              {copied ? "✓ Address Copied" : "Copy Stellar Address"}
            </button>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Every contribution moves Stellar Farm one step closer to its vision.
        </p>
      </div>
    </main>
  );
}
