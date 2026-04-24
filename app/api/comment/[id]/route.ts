import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();

    console.log({
        id,
        body
    })

    const { status } = body;

    const updated = await prisma.comment.update({
        where: { id: Number(id) },
        data: { status },
    });

    return NextResponse.json(updated);
}