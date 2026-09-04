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
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto flex min-h-[90vh] max-w-md flex-col justify-center">
        <header className="mb-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">XLM Farm</p>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back.</h1>
          <p className="mt-4 text-sm text-zinc-400">Continue your farming journey.</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none" />
          <a href="/forgot-password" className="block text-right text-xs text-zinc-500 hover:text-white">Forgot password?</a>
          {error && <p className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-950">{loading ? "Loading..." : "Log in"}</button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">Need an account? <a href="/register" className="text-white">Create one</a></p>
      </div>
    </main>
  );
}
