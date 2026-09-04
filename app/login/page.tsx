"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090D] px-6 text-white">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.15),transparent_70%)]" />

      <div className="relative w-full max-w-[440px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C38FF]/20 text-2xl text-[#A78BFA]">
            ✦
          </div>
          <h1 className="text-[28px] font-bold">XLM Farm</h1>
          <p className="mt-2 text-sm text-[#94A3B8]">Farm rewards. Grow with Stellar.</p>
        </div>

        <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-6 shadow-xl">
          <div className="mb-6 flex rounded-lg border border-[#22222D] bg-[#0F0F14] p-1 text-sm">
            <div className="flex-1 rounded-md bg-[#6C38FF] px-3 py-2 text-center font-medium">Log in</div>
            <a href="/register" className="flex-1 px-3 py-2 text-center text-[#94A3B8]">Create account</a>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email address" className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 text-sm outline-none focus:border-[#6C38FF]" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 text-sm outline-none focus:border-[#6C38FF]" />

            <a href="/forgot-password" className="block text-right text-xs text-[#94A3B8] hover:text-white">Forgot password?</a>

            {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

            <button disabled={loading} className="w-full rounded-lg bg-[#6C38FF] py-3.5 text-sm font-semibold shadow-[0_4px_20px_rgba(108,56,255,0.35)] transition hover:bg-[#5A2EE5] active:scale-[0.98] disabled:opacity-50">
              {loading ? "Loading..." : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#64748B]">Secure access to your Stellar rewards dashboard</p>
      </div>
    </main>
  );
}
