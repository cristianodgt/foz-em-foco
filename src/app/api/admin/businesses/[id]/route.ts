import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const data: any = {};
  const keys = ["name", "description", "plan", "active", "phone", "whatsapp", "email", "website", "address", "bairro", "city", "categoryId"];
  for (const k of keys) if (body[k] !== undefined) data[k] = body[k];
  if (body.slug !== undefined) data.slug = body.slug?.trim() || slugify(body.name ?? "");
  const item = await prisma.business.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.business.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
