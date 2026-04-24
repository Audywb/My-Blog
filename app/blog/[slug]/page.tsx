import { getBlogBySlug, incrementView } from "@/lib/actions/blog";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentForm from "@/components/blog/CommentForm";
import CommentItem from "@/components/blog/CommentItem";

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const isAdmin = session?.user?.name === "admin";

    const blog = await getBlogBySlug(slug);
    console.log(blog)
    if (!blog) {
        return <div className="p-6">Blog not found</div>;
    }

    incrementView(slug);

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>

            <div className="text-sm text-zinc-500 flex gap-4 mb-6">
                <span>
                    {new Date(blog.createdAt).toLocaleDateString("th-TH")}
                </span>
                <span>{blog.viewCount} views</span>
            </div>

            <div className="relative w-full aspect-video mb-6">
                <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover rounded-xl"
                />
            </div>

            <article className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {blog.content}
                </ReactMarkdown>
            </article>

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4">
                    Comments (
                    {isAdmin
                        ? blog.comments.length
                        : blog.comments.filter((c) => c.status === "approved").length}
                    )
                </h2>

                <CommentForm blogId={blog.id} />

                <div className="space-y-3 mt-4">
                    {(isAdmin
                        ? blog.comments
                        : blog.comments.filter((c) => c.status === "approved")
                    ).map((c) => (
                        <CommentItem
                            key={c.id}
                            comment={c}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}