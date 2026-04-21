import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { businessId, name, rating, body } = await req.json();
  if (!businessId || !name || !rating) {
    return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 });
  }

  const review = await prisma.businessReview.create({
    data: { businessId, name, rating: Math.min(5, Math.max(1, parseInt(rating))), body, approved: false },
  });

  return NextResponse.json(review, { status: 201 });
}
