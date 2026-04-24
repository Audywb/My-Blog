"use client";

import Link from "next/link";
import Image from "next/image";
import type { Blog } from "@/types/blog";

type Props = {
    blog: Blog;
    variant?: "admin" | "public";
};

export default function BlogCard({ blog, variant = "public" }: Props) {
    const approvedCount = blog.comments?.filter((c) => c.status === "approved").length || 0;

    const pendingCount = blog.comments?.filter((c) => c.status === "pending").length || 0;

    const displayCommentCount = variant === "admin" ? pendingCount > 0 ? `${pendingCount} pending` : blog.comments?.length || 0 : approvedCount;

    async function handleToggle() {
        await fetch(`/api/blog/${blog.id}/toggle`, {
            method: "POST",
        });

        window.location.reload();
    }

    return (
        <article className="p-2 overflow-hidden rounded-xl border shadow-sm transition hover:shadow-lg">
            {/* Admin */}
            {variant === "admin" && (
                <div className="mt-4 flex items-center justify-between pb-2">

                    <div className="flex items-center gap-2">
                        {/* status */}
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${blog.published
                                ? "bg-green-100 text-green-600"
                                : "bg-zinc-200 text-zinc-500"
                                }`}
                        >
                            {blog.published ? "published" : "draft"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">

                        {/* toggle */}
                        <button
                            onClick={handleToggle}
                            className={`w-10 h-5 rounded-full relative transition cursor-pointer ${blog.published ? "bg-green-500" : "bg-zinc-300"
                                }`}
                        >
                            <span
                                className={`absolute top-1 w-3 h-3 bg-white rounded-full transition ${blog.published ? "left-5" : "left-1"
                                    }`}
                            />
                        </button>

                        <Link
                            href={`/admin/blog/${blog.id}/edit`}
                            className="text-xs border px-3 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            Edit
                        </Link>
                        <button></button>
                    </div>
                </div>
            )}

            <div className="relative h-56 w-full">
                <Link href={`/blog/${blog.slug}`}>
                    <Image
                        src={blog.coverImage || "/placeholder.png"}
                        alt={blog.slug || "blog"}
                        fill
                        className="object-contain"
                        loading="eager"
                    />
                </Link>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-zinc-950 p-4 sm:p-6">

                <time className="block text-xs text-zinc-500">
                    {new Date(blog.createdAt).toLocaleDateString("th-TH")}
                </time>

                <Link href={`/blog/${blog.slug}`}>
                    <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white hover:underline">
                        {blog.title}
                    </h3>
                </Link>

                <p className="mt-2 line-clamp-3 text-sm text-zinc-500 dark:text-zinc-300">
                    {blog.excerpt}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                    <span>/{blog.slug}</span>
                    <span>
                        {blog.viewCount} views · {displayCommentCount} comments
                    </span>
                </div>
            </div>
        </article>
    );
}