"use client";

import { useState } from "react";

export default function CommentForm({ blogId }: { blogId: number }) {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);

        const res = await fetch("/api/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                blogId,
                authorName: name,
                content,
            }),
        });

        setLoading(false);

        if (res.ok) {
            alert("ส่งสำเร็จ รออนุมัติ");
            setName("");
            setContent("");
        } else {
            const data = await res.json();
            alert(data.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 mt-8">
            <h3 className="font-semibold">แสดงความคิดเห็น</h3>

            <input
                className="w-full border p-2 rounded"
                placeholder="ชื่อ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <textarea
                className="w-full border p-2 rounded"
                placeholder="ข้อความ (ภาษาไทย + ตัวเลข)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />

            <button
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded"
            >
                {loading ? "กำลังส่ง..." : "ส่ง"}
            </button>
        </form>
    );
}