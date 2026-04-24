import type { Metadata } from "next";
import { getBlogs } from "@/lib/actions/blog";
import type { Blog } from "@/types/blog";
import BlogList from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "My Blog | Next.js 16",
  description: "My Blog",
  keywords: ["My Blog", "Next.js", "Node.js 16", "Blog"],
};

export default async function Home() {
  const blogs = (await getBlogs()) as Blog[];

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 w-full">
      <h1 className="text-4xl font-semibold mb-10">Blog</h1>
      <BlogList blogs={blogs} />
    </section>
  );
}
