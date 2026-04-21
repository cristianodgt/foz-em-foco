import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slot = searchParams.get("slot");
  if (!slot) return NextResponse.json([]);

  const now = new Date();
  const creatives = await prisma.adCreative.findMany({
    where: {
      slot: slot as any,
      active: true,
      campaign: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    },
    include: { campaign: { include: { advertiser: true } } },
  });

  const result = creatives.map((c) => ({
    id: c.id,
    imageUrl: c.imageUrl,
    linkUrl: c.linkUrl,
    altText: c.altText,
    advertiserName: c.campaign.advertiser.name,
    format: c.slot,
  }));

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
