import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status") ?? "publicado";
  const take = Math.min(parseInt(searchParams.get("take") ?? "10"), 50);
  const skip = parseInt(searchParams.get("skip") ?? "0");

  const articles = await prisma.article.findMany({
    where: {
      status: status as any,
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true, author: { select: { name: true, image: true } } },
    orderBy: { publishedAt: "desc" },
    take,
    skip,
  });

  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const article = await prisma.article.create({
    data: {
      ...body,
      authorId: (session.user as any).id,
    },
  });

  return NextResponse.json(article, { status: 201 });
}
