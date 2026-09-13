"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setUpdated(true);
    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090D] px-6 py-10 text-white">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.15),transparent_70%)]" />
      <div className="relative mx-auto flex min-h-[90vh] max-w-[440px] flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#22222D] bg-[#121217] text-xl font-bold text-[#A78BFA]">X</div>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#64748B]">Stellar FARM</p>
          <h1 className="mt-5 text-[28px] font-bold tracking-tight">Choose a new password</h1>
          <p className="mt-3 text-sm text-[#94A3B8]">Create a new password for your Stellar FARM account.</p>
        </div>

        {updated ? (
          <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-6 text-center">
            <p className="text-lg font-semibold">Password updated.</p>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">Your password has been changed successfully.</p>
            <a href="/login" className="mt-6 block w-full rounded-lg bg-[#6C38FF] px-5 py-3.5 text-center text-sm font-semibold">Continue to login</a>
          </div>
        ) : !ready ? (
          <div className="rounded-2xl border border-[#22222D] bg-[#121217] p-6 text-center">
            <p className="text-sm text-[#94A3B8]">This reset link is invalid or has expired.</p>
            <a href="/forgot-password" className="mt-6 block w-full rounded-lg bg-[#6C38FF] px-5 py-3.5 text-center text-sm font-semibold">Request a new link</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[#22222D] bg-[#121217] p-6">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-[#94A3B8]">New password</label>
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 text-sm outline-none focus:border-[#6C38FF]" placeholder="At least 8 characters" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm text-[#94A3B8]">Confirm new password</label>
              <input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 text-sm outline-none focus:border-[#6C38FF]" placeholder="Repeat your new password" />
            </div>
            {error && <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#6C38FF] px-5 py-3.5 text-sm font-semibold disabled:opacity-50">{loading ? "Updating..." : "Update password"}</button>
          </form>
        )}
      </div>
    </main>
  );
}
