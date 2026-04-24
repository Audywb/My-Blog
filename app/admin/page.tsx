import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllBlogs } from "../../lib/actions/blog";
import { Blog } from "@/types/blog";
import Link from "next/link";
import BlogList from "@/components/blog/BlogList";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const blogs = (await getAllBlogs()) as Blog[];

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl text-zinc-800 dark:text-zinc-50 font-semibold">
        Hello Admin!
      </h1>

      <div className="container mt-6 space-y-4">
        <section className="max-w-7xl mx-auto px-6 py-10">
          {/* header */}
          <h2 className="text-xl text-zinc-800 dark:text-zinc-50 font-semibold pb-8">
            Manage Blogs
          </h2>
          <div className="flex justify-between mb-6">
            <p className="text-sm text-zinc-500">{blogs.length} posts</p>

            <Link
              href="/admin/blog/create"
              className="bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 rounded text-sm"
            >
              + Add blog
            </Link>
          </div>

          <BlogList blogs={blogs} variant="admin" />
        </section>
      </div>
    </div>
  );
}
