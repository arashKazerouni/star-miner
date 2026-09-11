"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FarmLogo } from "@/components/FarmLogo";

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
    if (loading) return;

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const referralCode = new URLSearchParams(window.location.search).get("ref");
      if (referralCode) {
        localStorage.setItem("stellar-farm-referral", referralCode);
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // When email confirmation is disabled, Supabase returns a live session.
      // Send the user straight into the app instead of showing a misleading
      // "check your email" message.
      if (data.session) {
        window.location.assign("/dashboard");
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Unable to create your account right now. Please try again.");
      setLoading(false);
    }
  }

  const fields = [
    {
      id: "email",
      value: email,
      setter: setEmail,
      label: "Email",
      type: "email",
      autoComplete: "email",
    },
    {
      id: "password",
      value: password,
      setter: setPassword,
      label: "Password",
      type: "password",
      autoComplete: "new-password",
    },
    {
      id: "confirm",
      value: confirmPassword,
      setter: setConfirmPassword,
      label: "Confirm password",
      type: "password",
      autoComplete: "new-password",
    },
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090D] px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(108,56,255,0.18),transparent_70%)]" />

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

        <section className="rounded-2xl border border-[#22222D] bg-[#121217] p-4 sm:p-6">
          {success ? (
            <div>
              <h2 className="text-lg font-semibold">Check your email</h2>
              <p className="mt-3 text-sm text-slate-400">
                Confirmation link sent to {email}.
              </p>
              <button
                type="button"
                onClick={() => router.replace("/login")}
                className="mt-6 w-full rounded-lg bg-[#6C38FF] py-3 font-semibold hover:bg-[#5A2EE5]"
              >
                Go to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex rounded-lg bg-[#0F0F14] p-1 text-sm">
                <Link
                  href="/login"
                  className="flex-1 rounded-md py-2 text-center text-slate-400 hover:text-white"
                >
                  Log in
                </Link>
                <span className="flex-1 rounded-md bg-[#6C38FF] py-2 text-center">
                  Create account
                </span>
              </div>

              {fields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="mb-2 block text-sm text-slate-300">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    autoComplete={field.autoComplete}
                    onChange={(e) => field.setter(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#22222D] bg-[#0F0F14] px-4 py-3 outline-none focus:border-[#6C38FF]"
                  />
                </div>
              ))}

              {error && (
                <p role="alert" className="rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#6C38FF] py-3 font-semibold transition hover:bg-[#5A2EE5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}
        </section>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
