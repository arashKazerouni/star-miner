"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { User } from "@/types";
import {
  BASE_MINING_RATE,
  calculateMiningReward,
} from "@/lib/mining";

type UserContextType = {
  user: User;
  currentBalance: number;
  addReferral: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>({
    id: "demo-user",
    balance: 0.000013,
    referrals: 3,
    miningRate: 0.000004,
    lastMiningUpdate: Date.now(),
  });

  const [currentBalance, setCurrentBalance] = useState(
    user.balance
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds =
        (Date.now() - user.lastMiningUpdate) / 1000;

      const reward = calculateMiningReward(
        user.miningRate,
        elapsedSeconds
      );

      setCurrentBalance(user.balance + reward);
    }, 5000);

    return () => clearInterval(interval);
  }, [
    user.balance,
    user.miningRate,
    user.lastMiningUpdate,
  ]);

  function addReferral() {
    setUser((current) => {
      const referrals = current.referrals + 1;

      const currentBalance =
        current.balance +
        calculateMiningReward(
          current.miningRate,
          (Date.now() - current.lastMiningUpdate) / 1000
        );

      return {
        ...current,
        balance: currentBalance,
        referrals,
        miningRate:
          BASE_MINING_RATE +
          referrals * BASE_MINING_RATE,
        lastMiningUpdate: Date.now(),
      };
    });
  }

  const value = useMemo(
    () => ({
      user,
      currentBalance,
      addReferral,
    }),
    [user, currentBalance]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used inside UserProvider"
    );
  }

  return context;
}