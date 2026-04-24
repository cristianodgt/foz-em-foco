import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const items = await prisma.newsletterEdition.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.subject) return NextResponse.json({ error: "Assunto obrigatório" }, { status: 400 });
  const item = await prisma.newsletterEdition.create({
    data: { subject: body.subject, body: body.body ?? "" },
  });
  return NextResponse.json(item, { status: 201 });
}
