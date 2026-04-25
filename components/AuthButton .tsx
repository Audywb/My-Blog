"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  return session ? (
    <button
      onClick={() => signOut()}
      className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors bg-zinc-100 hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 py-2 px-4 rounded-lg cursor-pointer"
    >
      Sign out
    </button>
  ) : (
    <Link
      href="/signin"
      className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors bg-zinc-100 hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 py-2 px-4 rounded-lg cursor-pointer"
    >
      Sign in
    </Link>
  );
}
