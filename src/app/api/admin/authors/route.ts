import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const items = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, bio: true, image: true, createdAt: true,
      _count: { select: { articles: true } },
    },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  if (!body.email || !body.name) return NextResponse.json({ error: "Nome e e-mail obrigatórios" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });

  const password = body.password ? await bcrypt.hash(body.password, 10) : null;

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password,
      role: body.role ?? "reporter",
      bio: body.bio ?? null,
      image: body.image ?? null,
    },
    select: { id: true, name: true, email: true, role: true, bio: true, image: true, createdAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}
