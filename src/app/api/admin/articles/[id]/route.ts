import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true, author: { select: { id: true, name: true } }, tags: true },
  });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();

  const data: any = {};
  const simple = ["title", "lead", "body", "imageUrl", "imageCaption", "readTime", "metaTitle", "metaDescription", "ogImage", "categoryId", "authorId", "imageCaption"];
  for (const k of simple) if (body[k] !== undefined) data[k] = body[k];
  if (body.slug !== undefined) data.slug = body.slug?.trim() || slugify(body.title ?? "noticia");
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === "publicado") {
      const existing = await prisma.article.findUnique({ where: { id } });
      if (!existing?.publishedAt) data.publishedAt = new Date();
    }
  }
  if (body.scheduledAt !== undefined) data.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
  if (body.publishedAt !== undefined) data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;

  const article = await prisma.article.update({ where: { id }, data });
  return NextResponse.json(article);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
