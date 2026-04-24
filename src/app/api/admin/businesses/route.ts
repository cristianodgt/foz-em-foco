import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const items = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { reviews: true, photos: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.name || !body.categoryId) return NextResponse.json({ error: "Nome e categoria obrigatórios" }, { status: 400 });
  const slug = body.slug?.trim() || slugify(body.name);
  const item = await prisma.business.create({
    data: {
      name: body.name,
      slug,
      description: body.description ?? null,
      plan: body.plan ?? "basico",
      active: body.active ?? true,
      phone: body.phone ?? null,
      whatsapp: body.whatsapp ?? null,
      email: body.email ?? null,
      website: body.website ?? null,
      address: body.address ?? null,
      bairro: body.bairro ?? null,
      city: body.city ?? "Foz do Iguaçu",
      categoryId: body.categoryId,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
