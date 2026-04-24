import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { sendBrevoEmail } from "@/lib/brevo";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.subject !== undefined) data.subject = body.subject;
  if (body.body !== undefined) data.body = body.body;

  if (body.send === true) {
    const edition = await prisma.newsletterEdition.findUnique({ where: { id } });
    if (!edition) {
      return NextResponse.json({ error: "Edição não encontrada" }, { status: 404 });
    }
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      select: { email: true, name: true },
    });
    const recipients = subscribers.map((s) => ({
      email: s.email,
      name: s.name ?? undefined,
    }));

    const subject = (data.subject as string | undefined) ?? edition.subject;
    const html = (data.body as string | undefined) ?? edition.body;

    const result = await sendBrevoEmail({ subject, html, recipients });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      );
    }

    data.sentAt = new Date();
    data.sentCount = result.sent;

    const item = await prisma.newsletterEdition.update({ where: { id }, data });
    return NextResponse.json({ ok: true, sent: result.sent, item });
  }

  const item = await prisma.newsletterEdition.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.newsletterEdition.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
