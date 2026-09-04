"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const referralCode = new URLSearchParams(window.location.search).get("ref");
    if (referralCode) {
      localStorage.setItem("star-miner-referral", referralCode);
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col justify-center">
        <div className="mb-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
            Star Miner
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Start mining.</h1>

          <p className="mt-4 text-sm text-zinc-400">
            Create your account and start earning STAR.
          </p>
        </div>

        {success ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-lg font-medium">Check your email.</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              We sent a confirmation link to {email}. Confirm your email to
              activate your account.
            </p>

            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mt-6 w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Go to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
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

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600"
                placeholder="••••••••"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-zinc-200 hover:text-white"
          >
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
