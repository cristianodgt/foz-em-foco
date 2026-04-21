import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://fozemfoco.com.br";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, businesses] = await Promise.all([
    prisma.article.findMany({
      where: { status: "publicado" },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 1000,
    }),
    prisma.category.findMany(),
    prisma.business.findMany({ where: { active: true }, include: { category: true }, take: 500 }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/guia`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/agenda`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/empregos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/newsletter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/anuncie`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/categoria/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.9,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/${a.category.slug}/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const businessPages: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${BASE}/guia/${b.category.slug}/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...articlePages, ...businessPages];
}
