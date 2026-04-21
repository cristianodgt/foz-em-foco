import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  if (!email) return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });

  // Upsert subscriber
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { active: true },
    create: { email, name, active: true },
  });

  // Sync with Brevo if key is set
  const brevoKey = process.env.BREVO_API_KEY;
  const listId = process.env.NEWSLETTER_BREVO_LIST_ID;
  if (brevoKey && listId) {
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoKey,
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name ?? "" },
        listIds: [parseInt(listId)],
        updateEnabled: true,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
