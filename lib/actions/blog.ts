"use server";

import { prisma } from "@/lib/prisma";

export async function getBlogs() {
    return await prisma.blog.findMany({
        where: {
            published: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
        include: {
            comments: true,
        },
    });
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
            images: true,
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