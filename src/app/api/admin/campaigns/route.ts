import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const advertiserId = searchParams.get("advertiserId") ?? undefined;
  const where: any = {};
  if (advertiserId) where.advertiserId = advertiserId;
  const items = await prisma.adCampaign.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { advertiser: true, creatives: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.name || !body.advertiserId) return NextResponse.json({ error: "Dados obrigatórios" }, { status: 400 });
  const item = await prisma.adCampaign.create({
    data: {
      name: body.name,
      advertiserId: body.advertiserId,
      startDate: new Date(body.startDate ?? new Date()),
      endDate: new Date(body.endDate ?? new Date(Date.now() + 30 * 86400000)),
      active: body.active ?? true,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
