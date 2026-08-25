"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Mine" },
  { href: "/earn", label: "Earn" },
  { href: "/withdraw", label: "Withdraw" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-900 bg-zinc-950/95">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-4">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs transition ${
                active ? "text-white" : "text-zinc-600"
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