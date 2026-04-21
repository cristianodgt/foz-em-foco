import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { articleId, name, email, body } = await req.json();
  if (!articleId || !name || !email || !body) {
    return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { articleId, name, email, body, status: "pendente" },
  });

  return NextResponse.json(comment, { status: 201 });
}
