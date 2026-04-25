import BlogList from "@/components/blog/BlogList";
import { getBlogs } from "@/lib/actions/blog";
import { Blog } from "@/types/blog";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search = "", page = "1" } = await searchParams;

  const {
    blogs,
    totalPages,
    page: currentPage,
  } = await getBlogs({
    search,
    page: Number(page),
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 w-full">
      <h1 className="text-4xl font-semibold mb-10">Blog</h1>
      <BlogList
        blogs={blogs as Blog[]}
        totalPages={totalPages}
        currentPage={currentPage}
        search={search}
      />
    </section>
  );
}
