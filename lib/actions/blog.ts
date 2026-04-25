"use server";

import { prisma } from "@/lib/prisma";

export async function getBlogs({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  const where = {
    published: true,
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { comments: true },
    }),
    prisma.blog.count({ where }),
  ]);

  return {
    blogs,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  };
}

export async function getAllBlogs() {
  return await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      comments: true,
    },
  });
}

export async function getBlogByIdAdmin(id: number) {
  return await prisma.blog.findUnique({
    where: { id },
    include: {
      comments: true,
    },
  });
}

export async function getBlogBySlug(slug: string) {
  return await prisma.blog.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      comments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getBlogBySlugAdmin(slug: string) {
  return await prisma.blog.findFirst({
    where: {
      slug
    },
    include: {
      comments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function incrementView(slug: string) {
  await prisma.blog.update({
    where: { slug },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}
