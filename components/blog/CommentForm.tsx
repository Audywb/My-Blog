"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CommentForm({ blogId }: { blogId: number }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const res = await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogId, authorName: name, content }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setName("");
      setContent("");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        แสดงความคิดเห็น
      </h3>

      {success && (
        <div className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3 rounded-lg">
          ✓ ส่งความคิดเห็นแล้ว รออนุมัติจากแอดมิน
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          ชื่อ <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 transition placeholder:text-zinc-400"
          placeholder="ชื่อของคุณ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          ข้อความ <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400 transition placeholder:text-zinc-400"
          placeholder="เขียนความคิดเห็น..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-80 disabled:opacity-50 transition"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
      </button>
    </form>
  );
}
