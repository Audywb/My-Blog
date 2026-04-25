"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import BlogCard from "./BlogCard";
import type { Blog } from "@/types/blog";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type Props = {
  blogs: Blog[];
  variant?: "admin" | "public";
  totalPages?: number;
  currentPage?: number;
  search?: string;
};

export default function BlogList({
  blogs,
  variant,
  totalPages = 1,
  currentPage = 1,
  search = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      return params.toString();
    },
    [searchParams]
  );

  function handleSearch(value: string) {
    startTransition(() => {
      router.push(
        pathname + "?" + createQueryString({ search: value, page: "1" })
      );
    });
  }

  function handlePage(page: number) {
    startTransition(() => {
      router.push(pathname + "?" + createQueryString({ page: String(page) }));
    });
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        {isPending && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 animate-spin"
          />
        )}
        <input
          type="text"
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="ค้นหาบทความ..."
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 transition placeholder:text-zinc-400"
        />
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="py-20 text-center text-zinc-400 text-sm">
          ไม่พบบทความที่ตรงกับการค้นหา
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} variant={variant} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          <button
            onClick={() => handlePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                p === currentPage
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => handlePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
