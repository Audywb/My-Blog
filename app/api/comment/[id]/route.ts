import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();

  const { status } = body;

  const updated = await prisma.comment.update({
    where: { id: Number(id) },
    data: { status },
  });

  return NextResponse.json(updated);
}
