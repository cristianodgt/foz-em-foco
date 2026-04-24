import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function getOrCreate() {
  let cfg = await prisma.siteConfig.findFirst();
  if (!cfg) cfg = await prisma.siteConfig.create({ data: {} });
  return cfg;
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const cfg = await getOrCreate();
  return NextResponse.json(cfg);
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const current = await getOrCreate();
  const body = await req.json();
  const data: any = {};
  const keys = [
    "siteName", "siteDescription", "logoUrl", "faviconUrl",
    "bridgeTancredo", "bridgeAmizade", "cataratosVazao",
    "dashboardSponsor", "dashboardSponsorUrl", "newsletterBrevoList",
  ];
  for (const k of keys) if (body[k] !== undefined) data[k] = body[k];
  if (body.cataratosVazao !== undefined) data.cataratosUpdatedAt = new Date();
  const cfg = await prisma.siteConfig.update({ where: { id: current.id }, data });
  return NextResponse.json(cfg);
}
