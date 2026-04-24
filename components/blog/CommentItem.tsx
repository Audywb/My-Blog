"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Comment } from "@/types/blog";

type Props = {
    comment: Comment;
    isAdmin: boolean;
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

    return (
        <div className="border p-3 rounded">
            <p className="font-medium">{comment.authorName}</p>
            <p className="text-sm text-zinc-600">{comment.content}</p>

            {isAdmin && (
                <span
                    className={`text-xs px-2 py-1 rounded inline-block mt-2 ${status === "approved"
                            ? "bg-green-100 text-green-600"
                            : status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                        }`}
                >
                    {status}
                </span>
            )}

            {isAdmin && (
                <div className="flex gap-2 mt-2">
                    <button
                        disabled={loading}
                        onClick={() => updateStatus("approved")}
                        className="text-xs px-3 py-1 border rounded hover:bg-green-500 hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                        Approve
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => updateStatus("rejected")}
                        className="text-xs px-3 py-1 border rounded hover:bg-red-500 hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}