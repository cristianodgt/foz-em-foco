import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const items = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { articles: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  const slug = body.slug?.trim() || slugify(body.name);
  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug,
      description: body.description ?? null,
      color: body.color ?? "#0a7a6b",
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
