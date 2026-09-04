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
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
            Support Star Miner
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            It&apos;s just the beginning.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-zinc-400">
            We need your help to give this project <span className="font-semibold text-zinc-200">REAL value</span> and
            continue building it toward its full potential.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-2xl shadow-black/20 sm:p-5">
          <div className="overflow-hidden rounded-2xl bg-white p-2">
            <img
              src="/donation-qr.png"
              alt="Star Miner Stellar donation QR code"
              className="block h-auto w-full"
            />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Stellar address
            </p>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
              <p className="break-all font-mono text-xs leading-5 text-zinc-300">
                {STELLAR_ADDRESS}
              </p>
            </div>

            <button
              type="button"
              onClick={copyAddress}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99]"
            >
              {copied ? (
                <>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <rect x="7" y="7" width="9" height="9" rx="1.5" />
                    <path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7" strokeLinecap="round" />
                  </svg>
                  Copy Stellar address
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-zinc-600">
          Every contribution helps us keep building, improving, and taking Star Miner further.
        </p>
      </div>
    </main>
  );
}
