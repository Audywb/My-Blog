import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { blogId, authorName, content } = body;
        console.log({ blogId, authorName, content })

        if (!authorName || !content) {
            return NextResponse.json(
                { message: "Missing fields" },
                { status: 400 }
            );
        }

        const thaiRegex = /^[ก-๙0-9\s]+$/;

        if (!thaiRegex.test(content)) {
            return NextResponse.json(
                { message: "Only Thai and numbers allowed" },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                blogId: Number(blogId),
                authorName,
                content,
                status: "pending",
            },
        });

        return NextResponse.json(comment);
    } catch (error: unknown) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}