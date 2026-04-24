import { NextResponse } from "next/server";
import { createBlog } from "@/lib/services/blog.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { title, slug, content, excerpt, coverImage } = body;
        console.log({
            title,
            slug,
            content,
            excerpt,
            coverImage,
        });
        console.log((!title || !slug || !content || !excerpt || !coverImage))

        if (!title || !slug || !content || !excerpt || !coverImage) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const blog = await createBlog(body);

        return NextResponse.json(blog);
    } catch (error: unknown) {
        console.error(error);

        if (error instanceof Error) {
            if (error.message === "Slug already exists") {
                return NextResponse.json(
                    { message: error.message },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}