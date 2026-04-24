"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AuthButton() {
    const { data: session } = useSession();

    return session ? (
        <button
            onClick={() => signOut()}
            className="bg-zinc-100 hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white py-2 px-4 rounded-lg cursor-pointer"
        >
            Sign out
        </button>
    ) : (
        <Link
            href="/signin"
            className="bg-zinc-100 hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white py-2 px-4 rounded-lg cursor-pointer"
        >
            Sign in
        </Link>
    );
}