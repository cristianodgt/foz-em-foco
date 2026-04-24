import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: any = {};
  if (status) where.status = status;
  const items = await prisma.comment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { article: { select: { id: true, title: true, slug: true } } },
    take: 200,
  });
  return NextResponse.json({ items });
}
