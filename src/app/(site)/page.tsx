import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import NewsCard from "@/components/site/NewsCard";
import Dashboard from "@/components/site/Dashboard";
import AdSlot from "@/components/site/AdSlot";
import NewsletterCTA from "@/components/site/NewsletterCTA";
import BreakingBar from "@/components/site/BreakingBar";
import Link from "next/link";
import { Eye, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Foz em Foco",
  description:
    "As últimas notícias de Foz do Iguaçu e da tríplice fronteira. Câmbio, clima, status das pontes e muito mais.",
});

async function getHomeData() {
  const [hero, feed, mostRead, breaking] = await Promise.all([
    prisma.article.findFirst({
      where: { status: "publicado", featured: true },
      include: { category: true, author: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.article.findMany({
      where: { status: "publicado" },
      include: { category: true, author: true },
      orderBy: { publishedAt: "desc" },
      take: 9,
    }),
    prisma.article.findMany({
      where: {
        status: "publicado",
        publishedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { views: "desc" },
      include: { category: true },
      take: 5,
    }),
    prisma.article.findFirst({
      where: { status: "publicado", featured: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const nonHeroFeed = feed.filter((a) => a.id !== hero?.id).slice(0, 6);
  return { hero, feed: nonHeroFeed, mostRead, breaking };
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function HomePage() {
  let data: Awaited<ReturnType<typeof getHomeData>> | null = null;
  let errorMsg: string | null = null;
  try {
    data = await getHomeData();
  } catch (e: any) {
    errorMsg = String(e?.message ?? e);
    console.error("HOME_ERROR", e);
  }
  if (errorMsg || !data) {
    return <pre style={{ color: "red", padding: 32, whiteSpace: "pre-wrap" }}>{errorMsg ?? "unknown error"}</pre>;
  }
  const { hero, feed, mostRead } = data;

  return (
    <div className="bg-paper">
      {/* Leaderboard ad */}
      <div className="flex justify-center py-3 bg-white border-b border-border">
        <AdSlot slotId="leaderboard" className="w-full max-w-5xl px-4" />
      </div>

      {/* Dashboard */}
      <Dashboard />

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main hero */}
          <div className="lg:col-span-2">
            {hero ? (
              <NewsCard
                title={hero.title}
                category={hero.category.name}
                categorySlug={hero.category.slug}
                slug={hero.slug}
                imageUrl={hero.imageUrl ?? undefined}
                meta={`${formatDate(hero.publishedAt)} · ${hero.readTime} min`}
                variant="xl"
              />
            ) : (
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center text-muted">
                Nenhuma manchete no momento
              </div>
            )}
          </div>

          {/* Secondary articles */}
          <div className="flex flex-col gap-4">
            {feed.slice(0, 3).map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                category={article.category.name}
                categorySlug={article.category.slug}
                slug={article.slug}
                imageUrl={article.imageUrl ?? undefined}
                meta={formatDate(article.publishedAt)}
                variant="horizontal"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feed + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-ink">Últimas notícias</h2>
              <Link href="/categoria/cidade" className="text-sm text-teal hover:underline font-medium">
                Ver tudo →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {feed.slice(0, 6).map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  category={article.category.name}
                  categorySlug={article.category.slug}
                  slug={article.slug}
                  imageUrl={article.imageUrl ?? undefined}
                  meta={formatDate(article.publishedAt)}
                  variant="md"
                />
              ))}
            </div>

            {/* Infeed ad */}
            <div className="my-8 flex justify-center">
              <AdSlot slotId="infeed" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <AdSlot slotId="mpu" />

            {/* Mais lidas */}
            {mostRead.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-widest text-muted mb-4 border-b border-border pb-2">
                  Mais lidas
                </h3>
                <div className="flex flex-col gap-4">
                  {mostRead.map((article, i) => (
                    <Link
                      key={article.id}
                      href={`/${article.category.slug}/${article.slug}`}
                      className="flex gap-3 group"
                    >
                      <span className="text-2xl font-serif font-bold text-teal-light leading-none mt-0.5 w-6 shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink group-hover:text-teal transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted font-mono mt-1 flex items-center gap-1">
                          <Eye size={10} /> {article.views.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <NewsletterCTA />

            <AdSlot slotId="halfpage" />
          </aside>
        </div>
      </section>

      {/* Sections shortcuts */}
      <section className="bg-white border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold text-ink mb-6">Serviços da cidade</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Guia Comercial", desc: "Encontre restaurantes, hotéis, lojas e serviços em Foz.", href: "/guia", emoji: "🏪" },
              { title: "Agenda de Eventos", desc: "Shows, feiras, teatro e eventos na cidade.", href: "/agenda", emoji: "📅" },
              { title: "Vagas de Emprego", desc: "Oportunidades de trabalho na tríplice fronteira.", href: "/empregos", emoji: "💼" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex gap-4 p-5 bg-paper border border-border rounded-lg hover:border-teal hover:bg-teal-light transition-colors group"
              >
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <h3 className="font-semibold text-ink group-hover:text-teal transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted mt-1 leading-snug">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
