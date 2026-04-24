import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const take = Math.min(parseInt(searchParams.get("take") ?? "50"), 200);
  const skip = parseInt(searchParams.get("skip") ?? "0");

  const where: any = {};
  if (status) where.status = status;
  if (q) where.title = { contains: q, mode: "insensitive" };

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true, author: { select: { id: true, name: true } } },
      orderBy: { updatedAt: "desc" },
      take,
      skip,
    }),
    prisma.article.count({ where }),
  ]);
  return NextResponse.json({ items, total });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  if (!body.title) return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });
  if (!body.categoryId) return NextResponse.json({ error: "Categoria obrigatória" }, { status: 400 });

  const slug = body.slug?.trim() || slugify(body.title);

  const article = await prisma.article.create({
    data: {
      title: body.title,
      slug,
      lead: body.lead ?? null,
      body: body.body ?? "",
      imageUrl: body.imageUrl ?? null,
      imageCaption: body.imageCaption ?? null,
      status: body.status ?? "rascunho",
      featured: Boolean(body.featured),
      readTime: body.readTime ?? 3,
      publishedAt: body.status === "publicado" ? new Date() : (body.publishedAt ? new Date(body.publishedAt) : null),
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      metaTitle: body.metaTitle ?? null,
      metaDescription: body.metaDescription ?? null,
      ogImage: body.ogImage ?? null,
      categoryId: body.categoryId,
      authorId: body.authorId ?? (session!.user as any).id,
    },
  });
  return NextResponse.json(article, { status: 201 });
}
