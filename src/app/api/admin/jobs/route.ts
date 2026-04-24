import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const items = await prisma.job.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.title || !body.company) return NextResponse.json({ error: "Título e empresa obrigatórios" }, { status: 400 });
  const slug = body.slug?.trim() || slugify(`${body.title}-${body.company}`);
  const item = await prisma.job.create({
    data: {
      title: body.title,
      slug,
      company: body.company,
      description: body.description ?? "",
      area: body.area ?? null,
      regime: body.regime ?? null,
      salary: body.salary ?? null,
      benefits: body.benefits ?? null,
      local: body.local ?? null,
      remote: body.remote ?? false,
      active: body.active ?? true,
      approved: body.approved ?? false,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
