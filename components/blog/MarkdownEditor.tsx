"use client";

import { ImageUpIcon } from "lucide-react";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

type Props = {
    value: string;
    onChange: (val: string) => void;
    onAddImage: () => void;
    previewImages?: Record<string, string>;
    disableAddImage?: boolean;
};

export default function MarkdownEditor({
    value,
    onChange,
    onAddImage,
    previewImages = {},
    disableAddImage = false,
}: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function insertText(text: string) {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = value.substring(0, start);
        const after = value.substring(end);
        const needsNewLine = !before.endsWith("\n");
        const insert = (needsNewLine ? "\n" : "") + text;
        const newValue = before + insert + after;
        onChange(newValue);
        setTimeout(() => {
            const pos = start + insert.length;
            textarea.selectionStart = textarea.selectionEnd = pos;
            textarea.focus();
        }, 0);
    }

    function wrapText(beforeWrap: string, afterWrap: string) {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.substring(start, end) || "";
        const newValue =
            value.substring(0, start) +
            beforeWrap +
            selected +
            afterWrap +
            value.substring(end);
        onChange(newValue);
        setTimeout(() => {
            textarea.selectionStart = start + beforeWrap.length;
            textarea.selectionEnd = end + beforeWrap.length;
            textarea.focus();
        }, 0);
    }

    function insertHeading(prefix: string) {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const before = value.substring(0, start);
        const after = value.substring(start);
        const lineStart = before.lastIndexOf("\n") + 1;
        const currentLine = value.substring(lineStart, start);
        let newValue: string;
        if (currentLine.trim().startsWith("#")) {
            newValue =
                value.substring(0, lineStart) +
                prefix +
                currentLine.replace(/^#+\s*/, "") +
                after;
        } else {
            newValue =
                value.substring(0, lineStart) + prefix + currentLine + after;
        }
        onChange(newValue);
        setTimeout(() => textarea.focus(), 0);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter") {
            const textarea = textareaRef.current;
            if (!textarea) return;
            const start = textarea.selectionStart;
            const before = value.substring(0, start);
            const lines = before.split("\n");
            const lastLine = lines[lines.length - 1];
            if (lastLine.startsWith("- ")) {
                e.preventDefault();
                const newValue =
                    value.substring(0, start) + "\n- " + value.substring(start);
                onChange(newValue);
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 3;
                }, 0);
            }
        }
    }

    const markdownComponents: Components = {
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-4 mb-2 text-zinc-900 dark:text-zinc-50">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-3 mb-2 text-zinc-900 dark:text-zinc-50">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-2 mb-1 text-zinc-900 dark:text-zinc-50">
                {children}
            </h3>
        ),
        strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
            <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
        ),
        li: ({ children }) => <li className="ml-2">{children}</li>,

        img: ({ src, alt }) => {
            const key = alt ?? "";

            const resolvedSrc =
                previewImages[key] || (src as string) || "";

            if (!resolvedSrc) {
                return (
                    <span className="flex items-center gap-2 my-2 px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-sm">
                        <ImageUpIcon size={14} />
                        {key || "image"}
                    </span>
                );
            }

            return (
                <img
                    src={resolvedSrc}
                    alt={key}
                    className="max-w-full rounded-lg my-3 object-contain"
                />
            );
        }
    };

    return (
        <div className="border rounded-lg p-1">
            {/* Toolbar */}
            <div className="flex gap-2 border-b p-2 bg-zinc-50 dark:bg-zinc-900">
                <button
                    type="button"
                    onClick={() => insertHeading("# ")}
                    className="btn"
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => insertHeading("## ")}
                    className="btn"
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => insertHeading("### ")}
                    className="btn"
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => wrapText("**", "**")}
                    className="btn"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => wrapText("*", "*")}
                    className="btn"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => insertText("\n- ")}
                    className="btn"
                >
                    List
                </button>
                <button type="button" onClick={onAddImage} className="btn" title={disableAddImage ? "ถึงขีดจำกัด 6 รูปแล้ว" : "เพิ่มรูปภาพ"}>
                    <ImageUpIcon size={16} />
                </button>
            </div>

            {/* Editor */}
            <textarea
                ref={textareaRef}
                className="w-full h-40 p-3 outline-none resize-none focus:ring-2 focus:ring-black dark:bg-zinc-950 dark:text-zinc-100"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Content"
            />

            {/* Preview */}
            <div className="border-t p-4 prose prose-zinc dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                >
                    {value}
                </ReactMarkdown>
            </div>
        </div>
    );
}