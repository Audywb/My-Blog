import {
  getBlogBySlug,
  getBlogBySlugAdmin,
  incrementView,
} from "@/lib/actions/blog";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentForm from "@/components/blog/CommentForm";
import CommentItem from "@/components/blog/CommentItem";
import { Components } from "react-markdown";
import AdminControls from "./AdminControls";

// Custom renderer สำหรับ image ใน markdown
const markdownComponents: Components = {
  img: ({ src, alt }) => {
    const imgSrc = typeof src === "string" ? src : "";
    if (!imgSrc) return null;
    return (
      <span className="block my-8">
        <Image
          src={imgSrc}
          alt={alt ?? ""}
          width={1080}
          height={1080}
          className="rounded-lg object-cover w-full max-h-fit"
          style={{ objectFit: "cover" }}
        />
      </span>
    );
  },
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.role === "admin";

  const blog = isAdmin
    ? await getBlogBySlugAdmin(slug)
    : await getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400 text-sm">
        Blog not found
      </div>
    );
  }

  incrementView(slug);

  const approvedComments = blog.comments.filter((c) => c.status === "approved");
  const displayedComments = isAdmin ? blog.comments : approvedComments;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {isAdmin && <AdminControls blog={blog} />}
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <time dateTime={blog.createdAt.toString()}>
              {new Date(blog.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
            <span>{blog.viewCount.toLocaleString()} views</span>
          </div>
        </header>

        <div className="relative w-full h-70 sm:h-95 lg:h-105 mb-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <article
          className="
            prose prose-zinc dark:prose-invert
            prose-base sm:prose-lg
            max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-zinc-300
            dark:prose-blockquote:border-zinc-600
            prose-blockquote:not-italic prose-blockquote:text-zinc-500
            prose-code:text-sm prose-code:bg-zinc-100
            dark:prose-code:bg-zinc-800 prose-code:px-1.5
            prose-code:py-0.5 prose-code:rounded prose-code:font-mono
            prose-img:rounded-lg prose-img:mx-auto
          "
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {blog.content}
          </ReactMarkdown>
        </article>

        {/* Divider */}
        <hr className="my-12 border-zinc-200 dark:border-zinc-800" />

        {/* Comments Section */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            Comments{" "}
            <span className="text-base font-normal text-zinc-400">
              ({displayedComments.length})
            </span>
          </h2>

          <CommentForm blogId={blog.id} />

          {displayedComments.length > 0 ? (
            <div className="space-y-4 mt-6">
              {displayedComments.map((c) => (
                <CommentItem key={c.id} comment={c} isAdmin={isAdmin} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400 mt-6">
              ยังไม่มีความคิดเห็น
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
