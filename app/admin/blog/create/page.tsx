"use client";

import { useEffect, useState } from "react";
import MarkdownEditor from "@/components/blog/MarkdownEditor";

type ImageItem = {
    id: string;
    file: File;
    objectUrl: string;
};

async function uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "portfolio");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/didmjbzkg/image/upload",
        { method: "POST", body: form }
    );

    const data = await res.json();
    if (!res.ok) throw new Error("Upload failed");

    return data.secure_url;
}

export default function CreateBlogPage() {
    const [content, setContent] = useState("");
    const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");

    const previewImages = Object.fromEntries(
        imageFiles.map(({ id, objectUrl }) => [id, objectUrl])
    );

    function handleAddImage() {
        if (imageFiles.length >= 6) {
            alert("Max 6 images");
            return;
        }

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const id = `upload-${Date.now()}`;
            const objectUrl = URL.createObjectURL(file);

            setImageFiles((prev) => [...prev, { id, file, objectUrl }]);
            setContent((prev) => prev + `\n![${id}](${id})\n`);
        };

        input.click();
    }

    useEffect(() => {
        return () => {
            imageFiles.forEach(({ objectUrl }) =>
                URL.revokeObjectURL(objectUrl)
            );
        };
    }, [imageFiles]);

    async function handleSubmit() {
        let coverUrl = "";
        if (coverFile) {
            coverUrl = await uploadImage(coverFile);
        }

        const uploaded = await Promise.all(
            imageFiles.map(async ({ id, file }) => ({
                id,
                url: await uploadImage(file),
            }))
        );

        let finalContent = content;
        
        uploaded.forEach(({ id, url }) => {
            finalContent = finalContent.replaceAll(
                `(${id})`,
                `(${url})`
            );
        });

        await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                slug,
                excerpt,
                content: finalContent,
                coverImage: coverUrl,
                images: uploaded.map((u) => u.url),
            }),
        });

        alert("Created!");
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-xl font-bold">Create Blog</h1>

            <input
                className="w-full border p-2 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                className="w-full border p-2 rounded"
                placeholder="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
            />

            <input
                className="w-full border p-2 rounded"
                placeholder="Excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                    e.target.files && setCoverFile(e.target.files[0])
                }
            />

            <MarkdownEditor
                value={content}
                onChange={setContent}
                onAddImage={handleAddImage}
                previewImages={previewImages}
            />

            <button
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Create Blog
            </button>
        </div>
    );
}