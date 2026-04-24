import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { unlink } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const media = await prisma.media.update({
    where: { id },
    data: {
      altText: body.altText ?? undefined,
      folder: body.folder ?? undefined,
      filename: body.filename ?? undefined,
    },
  });
  return NextResponse.json(media);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Best-effort disk cleanup
  try {
    if (media.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", media.url);
      await unlink(filePath);
    }
  } catch {}

  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
