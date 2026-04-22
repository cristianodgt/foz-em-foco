import { prisma } from "@/lib/prisma";
import AnunciosClient, { type AdvertiserRow } from "./AnunciosClient";

export default async function AnunciosPage() {
  const advertisers = await prisma.advertiser.findMany({
    include: { campaigns: { include: { creatives: true } } },
    orderBy: { name: "asc" },
  });

  const rows: AdvertiserRow[] = advertisers.map((adv) => ({
    id: adv.id,
    name: adv.name,
    segment: adv.segment ?? "",
    email: adv.email ?? "",
    campaigns: adv.campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      active: c.active,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      creatives: c.creatives.map((cr) => ({ id: cr.id, slot: cr.slot as string })),
    })),
  }));

  return <AnunciosClient advertisers={rows} />;
}
