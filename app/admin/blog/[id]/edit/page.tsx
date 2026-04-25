import CommentItem from "@/components/blog/CommentItem";
import EditBlogForm from "./EditBlogForm";
import { getBlogByIdAdmin } from "@/lib/actions/blog";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await getBlogByIdAdmin(Number(id));

  if (!blog) {
    return <div>Not found</div>;
  }

  return (
    <div className="grid md:grid-cols-2 max-w-7xl mx-auto">
      <div className="p-6">
        <EditBlogForm blog={blog} />;
      </div>
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">
          Comments ({blog.comments.length})
        </h2>
        {blog.comments.map((c) => (
          <CommentItem key={c.id} comment={c} isAdmin={true} />
        ))}
      </div>
    </div>
  )
}
