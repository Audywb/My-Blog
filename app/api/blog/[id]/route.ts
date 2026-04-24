import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const blogId = Number(id);

    const body = await req.json();

    const { title, slug, content, excerpt, coverImage } = body;

    const updated = await prisma.blog.update({
        where: { id: blogId },
        data: {
            title,
            slug,
            content,
            excerpt,
            coverImage,
        },
    });

    return NextResponse.json(updated);
}