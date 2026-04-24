import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const folder = searchParams.get("folder") ?? undefined;
  const take = Math.min(parseInt(searchParams.get("take") ?? "60"), 200);
  const skip = parseInt(searchParams.get("skip") ?? "0");

  const where: any = {};
  if (folder) where.folder = folder;
  if (q) where.filename = { contains: q, mode: "insensitive" };

  const [items, total] = await Promise.all([
    prisma.media.findMany({ where, orderBy: { createdAt: "desc" }, take, skip }),
    prisma.media.count({ where }),
  ]);

  return NextResponse.json({ items, total });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "geral";
  const altText = (formData.get("altText") as string) || null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const now = new Date();
  const yyyyMM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", yyyyMM);
  await mkdir(uploadDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const filepath = path.join(uploadDir, filename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  const url = `/uploads/${yyyyMM}/${filename}`;
  const media = await prisma.media.create({
    data: {
      filename: file.name,
      url,
      mimeType: file.type || "application/octet-stream",
      size: buffer.length,
      folder,
      altText,
      uploadedBy: (session!.user as any).id ?? null,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
