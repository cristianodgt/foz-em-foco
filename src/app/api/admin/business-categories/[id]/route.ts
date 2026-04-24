import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.slug !== undefined)
    data.slug = body.slug?.trim() || slugify(body.name ?? "");
  if (body.icon !== undefined) data.icon = body.icon;
  const item = await prisma.businessCategory.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const count = await prisma.business.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Categoria tem ${count} negócios. Remova/realoque antes.` },
      { status: 400 }
    );
  }
  await prisma.businessCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
