"use client";

import { useEffect, useState } from "react";
import MarkdownEditor from "@/components/blog/MarkdownEditor";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/blog";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";

type ImageItem = {
    id: string;
    file: File;
    objectUrl: string;
};

type Props = {
    blog: Blog;
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
    return data.secure_url;
}

export default function EditBlogForm({ blog }: Props) {
    const router = useRouter();

    const [title, setTitle] = useState(blog.title);
    const [slug, setSlug] = useState(blog.slug);
    const [excerpt, setExcerpt] = useState(blog.excerpt);
    const [content, setContent] = useState(blog.content);

    const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(blog.coverImage || '');
    const [uploadingImage, setUploadingImage] = useState(false);

    const previewImages = Object.fromEntries(
        imageFiles.map(({ id, objectUrl }) => [id, objectUrl])
    );

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    }

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

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

    async function handleSubmit() {
        let coverUrl = blog.coverImage;

        if (imageFile) {
            setUploadingImage(true);
            coverUrl = await uploadImage(imageFile);
            setUploadingImage(false);
        }

        // upload new images
        const uploaded = await Promise.all(
            imageFiles.map(async ({ id, file }) => ({
                id,
                url: await uploadImage(file),
            }))
        );

        let finalContent = content;

        // replace placeholder
        uploaded.forEach(({ id, url }) => {
            finalContent = finalContent.replaceAll(`(${id})`, `(${url})`);
        });

        await fetch(`/api/blog/${blog.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                slug,
                excerpt,
                content: finalContent,
                coverImage: coverUrl,
            }),
        });

        alert("Updated!");
        router.push("/admin");
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-xl font-bold">Edit Blog</h1>

            {/* title */}
            <input
                className="w-full border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* slug */}
            <input
                className="w-full border p-2 rounded"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
            />

            {/* excerpt */}
            <textarea
                className="w-full border p-2 rounded"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
            />

            {/* cover */}
            <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                    Cover Image
                </label>
                <label className="relative block cursor-pointer group">
                    <div
                        className={`relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed transition-colors ${imagePreview
                            ? "border-zinc-700"
                            : "border-zinc-700 hover:border-zinc-500"
                            } bg-zinc-800`}
                    >
                        {imagePreview ? (
                            <>
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    priority
                                    className="object-contain"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/60 rounded-full px-4 py-2 text-sm text-white">
                                        <ImagePlus size={15} />
                                        Change Image
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
                                <ImagePlus size={24} />
                                <span className="text-sm">
                                    Click to upload cover image
                                </span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </label>
                {uploadingImage && (
                    <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-1.5">
                        <Loader2 size={12} className="animate-spin" />{" "}
                        Uploading...
                    </p>
                )}
                {imageFile && !uploadingImage && (
                    <p className="text-xs text-emerald-400 mt-1.5">
                        ✓ New image selected
                    </p>
                )}
            </div>

            {/* markdown */}
            <MarkdownEditor
                value={content}
                onChange={setContent}
                onAddImage={handleAddImage}
                previewImages={previewImages}
            />

            <button
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 rounded cursor-pointer"
            >
                Update Blog
            </button>
        </div>
    );
}