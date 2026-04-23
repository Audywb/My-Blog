import type { Metadata } from "next";
import { getBlogs } from "@/app/actions/blog";
import Link from "next/link";
import Image from "next/image";
import type { Blog } from "@/types/blog";

export const metadata: Metadata = {
  title: "My Blog | Next.js 16",
  description:
    "My Blog",
  keywords: [
    "My Blog",
    "Next.js",
    "Node.js 16",
    "Blog",
  ],
};

export default async function Home() {
  const blogs = (await getBlogs()) as Blog[];

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 min-h-[85vh] md:min-h-[87vh]">
      <h1 className="text-4xl font-semibold mb-10">Blog</h1>

      <div className="space-y-8">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="flex transition hover:shadow-lg dark:bg-transparent dark:shadow-zinc-800/85"
          >
            <Link
              href={`/blog/${blog.slug}`}
              className="hidden sm:block sm:basis-56"
            >
              <Image
                alt={blog.title || ""}
                src={blog.coverImage || "/images/placeholder.png"}
                className="aspect-square h-full w-full object-cover"
                width={500}
                height={500}
              />
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6 dark:border-white/10">
                <Link href={`/blog/${blog.slug}`}>
                  <h3 className="font-bold text-gray-900 uppercase dark:text-white">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(blog.createdAt).toLocaleDateString("th-TH")}
                </p>

                <p className="mt-2 line-clamp-3 text-sm/relaxed text-zinc-700 dark:text-zinc-200">
                  {blog.excerpt}
                </p>
              </div>

              <div className="sm:flex sm:items-end sm:justify-end">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="block bg-zinc-500 px-5 py-3 text-center text-xs font-bold text-zinc-900 uppercase transition hover:bg-zinc-400"
                >
                  Read Blog
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
