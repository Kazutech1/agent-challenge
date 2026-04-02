"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/chat", label: "Chat" },
  ];

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-green-400 font-mono text-lg font-bold tracking-tight">
          ◈ DEFI AGENT
        </span>
        <span className="text-zinc-600 font-mono text-xs">/ SOLANA</span>
      </div>

      <div className="flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-1.5 rounded font-mono text-sm transition-colors ${
              pathname === link.href
                ? "bg-green-400 text-zinc-950 font-bold"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
