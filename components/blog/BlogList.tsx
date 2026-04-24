"use client";
import BlogCard from "./BlogCard";
import type { Blog } from "@/types/blog";

type Props = {
    blogs: Blog[];
    variant?: "admin" | "public";
};

export default function BlogList({ blogs, variant }: Props) {

    return (
        <div className="space-y-4 grid gap-8 lg:grid-cols-3">
            {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} variant={variant} />
            ))}
        </div>
    );
}