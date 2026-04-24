
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

    return <EditBlogForm blog={blog} />;
}