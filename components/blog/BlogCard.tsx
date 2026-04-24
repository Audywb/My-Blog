"use client";

import Link from "next/link";
import Image from "next/image";
import type { Blog } from "@/types/blog";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  blog: Blog;
  variant?: "admin" | "public";
};

export default function BlogCard({ blog, variant = "public" }: Props) {
  const router = useRouter();

  const comments = blog.comments ?? [];

  const approvedCount = comments.filter((c) => c.status === "approved").length;

  const displayCommentCount =
    variant === "admin" ? comments.length : approvedCount;

  async function handleToggle() {
    await fetch(`/api/blog/${blog.id}/toggle`, {
      method: "POST",
    });

    router.refresh();
  }

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition">
      <Link href={`/blog/${blog.slug}`}>
        <div className="relative h-52 w-full">
          <Image
            src={blog.coverImage || "/placeholder.png"}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority={false}
          />
        </div>
      </Link>

      <div className="p-5 space-y-3">
        {/* META */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <time>{new Date(blog.createdAt).toLocaleDateString("th-TH")}</time>

          <span>
            {blog.viewCount} views · {displayCommentCount} comments
          </span>
        </div>

        <Link href={`/blog/${blog.slug}`}>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:underline line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        <p className="text-sm text-zinc-500 dark:text-zinc-300 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Admin */}
        {variant === "admin" && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                blog.published
                  ? "bg-green-100 text-green-600"
                  : "bg-zinc-200 text-zinc-500"
              }`}
            >
              {blog.published ? "published" : "draft"}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggle}
                className={`w-10 h-5 rounded-full relative transition ${
                  blog.published ? "bg-green-500" : "bg-zinc-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-3 h-3 bg-white rounded-full transition ${
                    blog.published ? "left-5" : "left-1"
                  }`}
                />
              </button>

              <Link
                href={`/admin/blog/${blog.id}/edit`}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <Edit size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
