import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type") ?? "all";

  if (!q || q.length < 2) return NextResponse.json({ articles: [], businesses: [], events: [], jobs: [] });

  const contains = { contains: q, mode: "insensitive" as const };

  const [articles, businesses, events, jobs] = await Promise.all([
    type === "all" || type === "articles"
      ? prisma.article.findMany({
          where: { status: "publicado", OR: [{ title: contains }, { lead: contains }, { body: contains }] },
          include: { category: true },
          orderBy: { publishedAt: "desc" },
          take: 10,
        })
      : [],
    type === "all" || type === "businesses"
      ? prisma.business.findMany({
          where: { active: true, OR: [{ name: contains }, { description: contains }, { bairro: contains }] },
          include: { category: true },
          take: 6,
        })
      : [],
    type === "all" || type === "events"
      ? prisma.event.findMany({
          where: { approved: true, active: true, OR: [{ title: contains }, { description: contains }] },
          orderBy: { startDate: "asc" },
          take: 6,
        })
      : [],
    type === "all" || type === "jobs"
      ? prisma.job.findMany({
          where: { approved: true, active: true, OR: [{ title: contains }, { company: contains }, { description: contains }] },
          take: 6,
        })
      : [],
  ]);

  return NextResponse.json({ articles, businesses, events, jobs });
}
