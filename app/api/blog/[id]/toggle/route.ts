import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const blogId = Number(id);

    if (isNaN(blogId)) {
        return NextResponse.json(
            { message: "Invalid id" },
            { status: 400 }
        );
    }

    const blog = await prisma.blog.findUnique({
        where: { id: blogId },
    });

    if (!blog) {
        return NextResponse.json(
            { message: "Not found" },
            { status: 404 }
        );
    }

    const updated = await prisma.blog.update({
        where: { id: blogId },
        data: {
            published: !blog.published,
        },
    });

    return NextResponse.json(updated);
}