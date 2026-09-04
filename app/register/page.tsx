"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

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
    if (referralCode) localStorage.setItem("stellar-farm-referral", referralCode);

    // Create the Supabase browser client only when the form is submitted.
    // This prevents Next.js from evaluating it during static prerendering,
    // where the public Supabase environment variables may not be available.
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  const fields = [
    { id: "email", value: email, setter: setEmail, label: "Email", type: "email" },
    { id: "password", value: password, setter: setPassword, label: "Password", type: "password" },
    { id: "confirm", value: confirmPassword, setter: setConfirmPassword, label: "Confirm password", type: "password" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090D] px-6 py-10 text-white">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.18),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-[440px] flex-col justify-center">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C38FF] text-xl font-bold shadow-[0_0_30px_rgba(108,56,255,0.35)]">X</div>
          <h1 className="text-[28px] font-bold">XLM Farm</h1>
          <p className="mt-2 text-sm text-slate-400">Start your Stellar farming journey.</p>
        </header>

        <section className="rounded-2xl border border-[#22222D] bg-[#121217] p-6">
          {success ? (
            <div>
              <h2 className="text-lg font-semibold">Check your email</h2>
              <p className="mt-3 text-sm text-slate-400">Confirmation link sent to {email}.</p>
              <button onClick={() => router.replace('/login')} className="mt-6 w-full rounded-lg bg-[#6C38FF] py-3 font-semibold">Go to login</button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex rounded-lg bg-[#0F0F14] p-1 text-sm">
                <a href="/login" className="flex-1 rounded-md py-2 text-center text-slate-400">Log in</a>
                <span className="flex-1 rounded-md bg-[#6C38FF] py-2 text-center">Create account</span>
              </div>

              {fields.map((field) => (
                <div key={field.id}>
                  <label className="mb-2 block text-sm text-slate-300">{field.label}</label>
                  <input id={field.id} type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} required className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 outline-none focus:border-[#6C38FF]" />
                </div>
              ))}

              {error && <p className="rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">{error}</p>}

              <button disabled={loading} className="w-full rounded-lg bg-[#6C38FF] py-3 font-semibold disabled:opacity-50">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}
        </section>

        <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <a href="/login" className="text-violet-400">Log in</a></p>
      </div>
    </main>
  );
}
