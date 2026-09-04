"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col justify-center">
        <div className="mb-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
            Star Miner
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Reset password.</h1>
          <p className="mt-4 text-sm text-zinc-400">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-lg font-medium">Check your email.</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              We sent a password reset link to {email}.
            </p>
            <a
              href="/login"
              className="mt-6 block w-full rounded-xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Back to login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        {!sent && (
          <p className="mt-8 text-center text-sm text-zinc-500">
            Remember your password?{" "}
            <a href="/login" className="font-medium text-zinc-200 hover:text-white">
              Log in
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
