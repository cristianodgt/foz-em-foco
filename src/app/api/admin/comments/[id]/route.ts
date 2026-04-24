import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const allowed = ["pendente", "aprovado", "rejeitado", "spam"];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }
  const comment = await prisma.comment.update({ where: { id }, data: { status: body.status } });
  return NextResponse.json(comment);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
