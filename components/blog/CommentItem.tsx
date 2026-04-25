"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Comment } from "@/types/blog";
import { Check, X, Loader2 } from "lucide-react";

type Props = {
  comment: Comment;
  isAdmin: boolean;
};

const statusConfig = {
  approved: {
    label: "อนุมัติแล้ว",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  rejected: {
    label: "ปฏิเสธ",
    className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  pending: {
    label: "รออนุมัติ",
    className:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

export default function CommentItem({ comment, isAdmin }: Props) {
  const [status, setStatus] = useState(comment.status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateStatus(newStatus: Comment["status"]) {
    try {
      setLoading(true);
      await fetch(`/api/comment/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  const config =
    statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        {/* Author + Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">
              {comment.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {comment.authorName}
            </span>
            {isAdmin && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.className}`}
              >
                {config.label}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-9">
            {comment.content}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1.5 shrink-0">
            {loading ? (
              <Loader2 size={14} className="animate-spin text-zinc-400" />
            ) : (
              <>
                <button
                  onClick={() => updateStatus("approved")}
                  disabled={status === "approved"}
                  title="Approve"
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-700 dark:hover:text-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition text-zinc-500 cursor-pointer"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  disabled={status === "rejected"}
                  title="Reject"
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition text-zinc-500 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
