import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="mt-6 space-y-4">
        <a href="/admin/blog" className="block underline">
          Manage Blogs
        </a>

        <a href="/admin/comment" className="block underline">
          Manage Comments
        </a>
      </div>
    </div>
  );
}
