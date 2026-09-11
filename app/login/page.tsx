"use client";

import { FormEvent, Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FarmLogo } from "@/components/FarmLogo";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Use a full navigation so the fresh auth cookie is definitely included
      // when proxy.ts checks the session before serving the dashboard.
      const redirectTo = searchParams.get("redirectTo");
      const destination = redirectTo?.startsWith("/") ? redirectTo : "/dashboard";
      window.location.assign(destination);
    } catch {
      setError("Unable to log in right now. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090D] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.15),transparent_70%)]" />
      <div className="relative w-full max-w-[440px]">
        <div className="mb-7 flex flex-col items-center gap-0.5 text-center sm:mb-8">
          <h1 className="flex items-center text-2xl font-bold sm:text-[28px]">
            <span className="mr-1.5">
              <FarmLogo size={48} />
            </span>
            Stellar FARM
          </h1>
          <p className="text-sm text-[#94A3B8]">Farm rewards. Grow with Stellar...</p>
        </div>
        <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-4 shadow-xl sm:p-6">
          <div className="mb-6 flex rounded-lg border border-[#22222D] bg-[#0F0F14] p-1 text-sm">
            <div className="flex-1 rounded-md bg-[#6C38FF] px-3 py-2 text-center font-medium">
              Log in
            </div>
            <Link
              href="/register"
              className="flex-1 rounded-md px-3 py-2 text-center text-[#94A3B8] hover:text-white"
            >
              Create account
            </Link>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 text-sm outline-none focus:border-[#6C38FF]"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 text-sm outline-none focus:border-[#6C38FF]"
            />
            <Link
              href="/forgot-password"
              className="block text-right text-xs text-[#94A3B8] hover:text-white"
            >
              Forgot password?
            </Link>
            {error && (
              <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#6C38FF] py-3.5 text-sm font-semibold shadow-[0_4px_20px_rgba(108,56,255,0.35)] transition hover:bg-[#5A2EE5] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-[#64748B]">
          Secure access to your Stellar rewards dashboard
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#09090D] px-4 text-white">
          <div className="text-sm text-[#94A3B8]">Loading...</div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
