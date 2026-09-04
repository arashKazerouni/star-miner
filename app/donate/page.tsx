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
    <main className="min-h-screen bg-[#09090D] px-5 py-10 pb-28 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <section className="relative text-center">
          <div className="pointer-events-none absolute inset-x-10 -top-20 h-32 rounded-full bg-[#6C38FF]/20 blur-3xl" />
          <p className="relative text-xs uppercase tracking-[0.35em] text-[#64748B]">
            Stellar Farm Ecosystem
          </p>
          <h1 className="relative mt-4 text-4xl font-bold tracking-tight">
            Power the next era of XLM farming.
          </h1>
          <p className="relative mt-4 text-sm leading-6 text-[#94A3B8]">
            Your support helps build new features, improve infrastructure, and grow the Stellar Farm community.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-[#22222D] bg-[#121217] p-5 shadow-2xl shadow-black/40">
          <div className="rounded-2xl bg-white p-3">
            <img
              src="/donation-qr.png"
              alt="Stellar Farm donation QR code"
              className="w-full rounded-xl"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-[#22222D] bg-[#0F0F14] p-4">
            <p className="text-xs uppercase tracking-widest text-[#64748B]">
              Stellar wallet address
            </p>
            <p className="mt-3 break-all font-mono text-xs leading-5 text-[#94A3B8]">
              {STELLAR_ADDRESS}
            </p>
          </div>

          <button
            onClick={copyAddress}
            className="mt-4 w-full rounded-xl bg-[#6C38FF] py-3 text-sm font-semibold text-white transition hover:bg-[#5A2EE5] active:scale-[0.99]"
          >
            {copied ? "✓ Address copied" : "Copy Stellar address"}
          </button>
        </section>

        <p className="mt-6 text-center text-xs text-[#64748B]">
          Every contribution helps Stellar Farm continue growing.
        </p>
      </div>
    </main>
  );
}
