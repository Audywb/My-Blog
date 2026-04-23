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
    });
}