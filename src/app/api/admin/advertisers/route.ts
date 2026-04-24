import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const items = await prisma.advertiser.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { campaigns: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  const advertiser = await prisma.advertiser.create({
    data: {
      name: body.name,
      segment: body.segment ?? null,
      contact: body.contact ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(advertiser, { status: 201 });
}
