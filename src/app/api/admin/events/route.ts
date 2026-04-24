import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const items = await prisma.event.findMany({ orderBy: { startDate: "desc" }, take: 200 });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.title || !body.startDate) return NextResponse.json({ error: "Título e data obrigatórios" }, { status: 400 });
  const slug = body.slug?.trim() || slugify(body.title);
  const item = await prisma.event.create({
    data: {
      title: body.title,
      slug,
      description: body.description ?? null,
      imageUrl: body.imageUrl ?? null,
      local: body.local ?? null,
      address: body.address ?? null,
      price: body.price ?? null,
      free: body.free ?? false,
      category: body.category ?? null,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      active: body.active ?? true,
      approved: body.approved ?? false,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
