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
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Stellar Farm Ecosystem
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Build the future of XLM farming.
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Support development and help us create a stronger Stellar Farm experience for everyone.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="rounded-2xl bg-white p-3">
            <img
              src="/donation-qr.png"
              alt="Stellar Farm donation QR code"
              className="w-full rounded-xl"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Stellar wallet
            </p>
            <p className="mt-3 break-all font-mono text-xs text-zinc-300">
              {STELLAR_ADDRESS}
            </p>
          </div>

          <button
            onClick={copyAddress}
            className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            {copied ? "✓ Address copied" : "Copy Stellar address"}
          </button>
        </section>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Every contribution helps Stellar Farm grow.
        </p>
      </div>
    </main>
  );
}
