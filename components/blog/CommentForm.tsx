"use client";

import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const THAI_NUMBERS_REGEX = /^[\u0E00-\u0E7F0-9\s]+$/;

function validateContent(text: string): string | null {
  if (!text.trim()) return "กรุณากรอกข้อความ";
  if (!THAI_NUMBERS_REGEX.test(text))
    return "ข้อความต้องเป็นภาษาไทยและตัวเลขเท่านั้น";
  return null;
}

export default function CommentForm({ blogId }: { blogId: number }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setContent(value);
    // validate แบบ real-time หลังจากพิมพ์ไปแล้ว
    if (value) setContentError(validateContent(value));
    else setContentError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const error = validateContent(content);
    if (error) {
      setContentError(error);
      return;
    }

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
      setContentError(null);
    } else {
      const data = await res.json();
      setServerError(data.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        แสดงความคิดเห็น
      </h3>

      {/* Success Banner */}
      {success && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2
            size={16}
            className="text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0"
          />
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            ส่งความคิดเห็นแล้ว รออนุมัติจากแอดมิน
          </p>
        </div>
      )}

      {/* Server Error Banner */}
      {serverError && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle
            size={16}
            className="text-red-500 dark:text-red-400 mt-0.5 shrink-0"
          />
          <p className="text-sm text-red-700 dark:text-red-400">
            {serverError}
          </p>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
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

      {/* Content */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            ข้อความ <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-zinc-400">
            ภาษาไทยและตัวเลขเท่านั้น
          </span>
        </div>
        <textarea
          rows={4}
          className={`w-full border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 transition placeholder:text-zinc-400 ${
            contentError
              ? "border-red-400 dark:border-red-600 focus:ring-red-300 dark:focus:ring-red-800"
              : "border-zinc-200 dark:border-zinc-700 focus:ring-zinc-400"
          }`}
          placeholder="เขียนความคิดเห็นเป็นภาษาไทย..."
          value={content}
          onChange={handleContentChange}
          required
        />
   
        {contentError && (
          <p className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
            <AlertCircle size={12} className="shrink-0" />
            {contentError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !!contentError}
        className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
      </button>
    </form>
  );
}
