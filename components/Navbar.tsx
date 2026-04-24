"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import AuthButton from "./AuthButton ";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-center sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-medium tracking-tight">
          My Blog
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="hover:text-foreground/80"
          >
            Blog
          </Link>

          <AuthButton />

          <ThemeToggle />
        </nav>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md border"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link href="/" onClick={() => setOpen(false)} className="block">
            Blog
          </Link>

          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="block"
          >
            Sign in
          </Link>
        </div>
      )}
    </header>
  );
}
