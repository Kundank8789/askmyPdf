// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-white/50 dark:bg-black/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-wide">
          AskMyPDF
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Pricing</Link>
          <Link href="/docs" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Docs</Link>

          <SignedIn>
            <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className="px-4 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition">Sign in</Link>
          </SignedOut>

          <ThemeToggle />
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-sm font-medium animate-in slide-in-from-top duration-200">
          <Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/docs" onClick={() => setOpen(false)}>Docs</Link>

          <SignedIn>
            <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700" onClick={() => setOpen(false)}>Sign in</Link>
          </SignedOut>

          <ThemeToggle />
        </div>
      )}
    </nav>
  );
}
