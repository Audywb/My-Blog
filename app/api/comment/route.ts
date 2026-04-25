import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const thaiRegex = /^[\u0E00-\u0E7F0-9\s]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const author = body.authorName?.trim();
    const text = body.content?.trim();
    const id = Number(body.blogId);

    if (!author || !text) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (!id || isNaN(id)) {
      return NextResponse.json({ message: "Invalid blogId" }, { status: 400 });
    }

    if (!thaiRegex.test(text)) {
      return NextResponse.json(
        { message: "Only Thai and numbers allowed" },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { message: "Comment too long" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        blogId: id,
        authorName: author,
        content: text,
        status: "pending",
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
