"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Mine" },
  { href: "/earn", label: "Earn" },
  { href: "/withdraw", label: "Withdraw" },
  { href: "/donate", label: "Donate" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#22222D] bg-[#09090D]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around gap-1 px-3 py-3">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                active
                  ? "bg-[#6C38FF]/15 text-white"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
