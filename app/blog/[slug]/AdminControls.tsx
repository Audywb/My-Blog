"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit } from "lucide-react";

export default function AdminControls({ blog }: any) {
  const router = useRouter();

  async function handleToggle() {
    await fetch(`/api/blog/${blog.id}/toggle`, {
      method: "PATCH",
    });

    router.refresh();
  }

  return (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
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
          className={`w-10 h-5 rounded-full relative transition cursor-pointer ${
            blog.published ? "bg-green-500" : "bg-zinc-300"
          }`}
        >
          <span
            className={`absolute top-1 w-3 h-3 bg-white rounded-full transition ${
              blog.published ? "left-5" : "left-1"
            }`}
          />
        </button>

        <Link href={`/admin/blog/${blog.id}/edit`}>
          <Edit size={16} />
        </Link>
      </div>
    </div>
  );
}
