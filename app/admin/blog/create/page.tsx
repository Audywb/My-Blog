"use client";

import { useEffect, useState } from "react";
import MarkdownEditor from "@/components/blog/MarkdownEditor";
import Image from "next/image";

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
    { method: "POST", body: form },
  );

  const data = await res.json();
  if (!res.ok) throw new Error("Upload failed");

  return data.secure_url;
}

export default function CreateBlogPage() {
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | "">();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");

  const previewImages = Object.fromEntries(
    imageFiles.map(({ id, objectUrl }) => [id, objectUrl]),
  );

  const imageCount = imageFiles.length;
  const isImageLimitReached = imageCount >= 6;

  function handleAddImage() {
    if (isImageLimitReached) return;

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

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  useEffect(() => {
    return () => {
      imageFiles.forEach(({ objectUrl }) => URL.revokeObjectURL(objectUrl));
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [imageFiles, coverPreview]);

  async function handleSubmit() {
    if (!title || !slug || !coverFile) {
      alert("กรุณากรอก Title, Slug และ Cover Image");
      return;
    }

    let coverUrl = "";
    if (coverFile) coverUrl = await uploadImage(coverFile);

    const uploaded = await Promise.all(
      imageFiles.map(async ({ id, file }) => ({
        id,
        url: await uploadImage(file),
      })),
    );

    let finalContent = content;
    uploaded.forEach(({ id, url }) => {
      finalContent = finalContent.replaceAll(`(${id})`, `(${url})`);
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-8">
        {/* Page Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create Blog
          </h1>
        </div>

        {/* Meta Fields */}
        <section className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 transition"
              placeholder="ชื่อบทความ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2.5 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-400 transition"
              placeholder="my-blog-post"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Excerpt
            </label>
            <textarea
              rows={2}
              className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400 transition"
              placeholder="คำอธิบายสั้นๆ ของบทความ"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>
        </section>

        {/* Cover Image */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Cover Image <span className="text-red-500">*</span>
          </h2>

          <label className="block cursor-pointer">
            {coverPreview ? (
              <div className="relative w-full h-52 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    เปลี่ยนรูป
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-36 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-zinc-400 dark:hover:border-zinc-500 transition">
                <span className="text-2xl">🖼️</span>
                <span className="text-sm text-zinc-400">
                  คลิกเพื่ออัปโหลด Cover Image
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
        </section>

        {/* Markdown Editor */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Content
            </h2>
            {/* Image counter badge */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                  isImageLimitReached
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                รูปใน content: {imageCount} / 6
              </span>
              {isImageLimitReached && (
                <span className="text-xs text-red-500 font-medium">
                  ถึงขีดจำกัดแล้ว
                </span>
              )}
            </div>
          </div>

          <MarkdownEditor
            value={content}
            onChange={setContent}
            onAddImage={handleAddImage}
            previewImages={previewImages}
            disableAddImage={isImageLimitReached}
          />
        </section>

        {/* Submit */}
        <div className="flex justify-end pt-2 pb-10">
          <button
            onClick={handleSubmit}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-80 transition cursor-pointer"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </div>
  );
}
