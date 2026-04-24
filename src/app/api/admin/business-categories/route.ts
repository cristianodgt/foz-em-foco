import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const items = await prisma.businessCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { businesses: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  }
  const slug = body.slug?.trim() || slugify(body.name);
  const item = await prisma.businessCategory.create({
    data: {
      name: body.name,
      slug,
      icon: body.icon ?? null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
