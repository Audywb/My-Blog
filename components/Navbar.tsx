"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import AuthButton from "./AuthButton ";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="flex flex-col justify-center sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto">
        <Link
          href="/"
          className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          My Blog
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Blog
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Admin
            </Link>
          )}

          <AuthButton />
          <ThemeToggle />
        </nav>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-background px-4 py-4 space-y-1">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center h-9 px-2 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Blog
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 h-9 px-2 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Admin
            </Link>
          )}

          <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
            <AuthButton />
          </div>
        </div>
      )}
    </header>
  );
}
