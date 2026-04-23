"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur">
            <div className="container flex h-14 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="font-semibold tracking-tight">
                    My Blog
                </Link>

                {/* Desktop */}
                <nav className="hidden md:flex items-center gap-6 text-sm">
                    <Link href="/blog" className="hover:text-foreground/80">
                        Blog
                    </Link>

                    <Link href="/admin/login" className="hover:text-foreground/80">
                        Sign In
                    </Link>

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
                    <Link
                        href="/blog"
                        onClick={() => setOpen(false)}
                        className="block"
                    >
                        Blog
                    </Link>

                    <Link
                        href="/admin/login"
                        onClick={() => setOpen(false)}
                        className="block"
                    >
                        Admin
                    </Link>
                </div>
            )}
        </header>
    );
}