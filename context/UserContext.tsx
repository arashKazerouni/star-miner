"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { User } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { calculateMiningReward } from "@/lib/mining";

type UserContextType = {
  user: User;
  currentBalance: number;
};

const UserContext = createContext<UserContextType | null>(null);

const DEMO_USER: User = {
  id: "demo-id",
  balance: 0,
  referrals: 0,
  miningRate: 0.000001,
  lastMiningUpdate: Date.now(),
  referralCode: "",
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(DEMO_USER);
  const [currentBalance, setCurrentBalance] = useState(DEMO_USER.balance);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    // Keep the public application usable when Supabase environment variables
    // are not configured (for example, during a fresh Vercel deployment).
    if (!supabaseUrl || !supabaseKey) return;

    const supabase = createClient();
    let active = true;

    async function loadProfile() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          if (active) {
            setUser(DEMO_USER);
            setCurrentBalance(0);
          }
          return;
        }

        const referralCode = new URLSearchParams(window.location.search).get(
          "ref",
        );
        if (referralCode) {
          localStorage.setItem("stellar-farm-referral", referralCode);
        }

        const pendingReferral = localStorage.getItem("stellar-farm-referral");
        if (pendingReferral) {
          await supabase.rpc("claim_referral", {
            referral_code_input: pendingReferral,
          });
          localStorage.removeItem("stellar-farm-referral");
        }

        const { data, error } = await supabase.rpc("sync_mining");

        if (error || !data?.[0] || !active) return;

        const profile = data[0];
        const nextUser: User = {
          id: authUser.id,
          balance: Number(profile.balance),
          referrals: profile.referrals,
          miningRate: Number(profile.mining_rate),
          lastMiningUpdate: new Date(profile.last_mining_update).getTime(),
          referralCode: profile.referral_code,
        };

        setUser(nextUser);
        setCurrentBalance(nextUser.balance);
      } catch {
        // Authentication/profile failures must not crash the entire app.
      }
    }

    void loadProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      void loadProfile();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user.id === DEMO_USER.id) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    const supabase = createClient();

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase.rpc("sync_mining");
        if (error || !data?.[0]) return;

        const profile = data[0];
        const balance = Number(profile.balance);
        const miningRate = Number(profile.mining_rate);
        const lastMiningUpdate = new Date(profile.last_mining_update).getTime();

        setUser((current) => ({
          ...current,
          balance,
          referrals: profile.referrals,
          miningRate,
          lastMiningUpdate,
          referralCode: profile.referral_code,
        }));
        setCurrentBalance(balance);
      } catch {
        // Ignore transient Supabase failures.
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user.id]);

  useEffect(() => {
    if (user.id === DEMO_USER.id) return;

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - user.lastMiningUpdate) / 1000;

      setCurrentBalance(
        user.balance + calculateMiningReward(user.miningRate, elapsedSeconds),
      );
    }, 250);

    return () => clearInterval(interval);
  }, [user.id, user.balance, user.miningRate, user.lastMiningUpdate]);

  const value = useMemo(
    () => ({ user, currentBalance }),
    [user, currentBalance],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
