import { prisma } from "@/lib/prisma";

type CreateBlogInput = {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    published?: boolean;
    images?: string[];
};

export async function createBlog(data: CreateBlogInput) {

    const existing = await prisma.blog.findUnique({
        where: { slug: data.slug },
    });

    if (existing) {
        throw new Error("Slug already exists");
    }

    return prisma.blog.create({
        data: {
            title: data.title,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt,
            coverImage: data.coverImage,
            published: data.published ?? false,

            images: data.images
                ? {
                    create: data.images.map((url) => ({
                        imageUrl: url,
                    })),
                }
                : undefined,
        },
        include: {
            images: true,
        },
    });
}