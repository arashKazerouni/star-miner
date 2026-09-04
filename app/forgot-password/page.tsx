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
    <main className="relative min-h-screen overflow-hidden bg-[#09090D] px-6 py-10 text-white">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.15),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-[440px] flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#22222D] bg-[#121217] text-xl font-bold text-[#A78BFA]">
            X
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#64748B]">
            XLM Farm
          </p>
          <h1 className="mt-5 text-[28px] font-bold tracking-tight">
            Reset password
          </h1>
          <p className="mt-3 text-sm text-[#94A3B8]">
            Enter your email and we&apos;ll send you a secure reset link.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-6">
            <p className="text-lg font-semibold">Check your email.</p>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
              We sent a password reset link to {email}.
            </p>
            <a
              href="/login"
              className="mt-6 block w-full rounded-lg bg-[#6C38FF] px-5 py-3.5 text-center text-sm font-semibold shadow-[0_4px_20px_rgba(108,56,255,0.35)] transition hover:bg-[#5A2EE5]"
            >
              Back to login
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#22222D] bg-[#121217] p-6 space-y-5"
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-[#94A3B8]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 text-sm outline-none transition focus:border-[#6C38FF] focus:ring-1 focus:ring-[#6C38FF]"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#6C38FF] px-5 py-3.5 text-sm font-semibold shadow-[0_4px_20px_rgba(108,56,255,0.35)] transition active:scale-[0.98] hover:bg-[#5A2EE5] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        {!sent && (
          <p className="mt-8 text-center text-sm text-[#64748B]">
            Remember your password?{" "}
            <a href="/login" className="font-medium text-[#8B5CF6] hover:text-white">
              Log in
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
