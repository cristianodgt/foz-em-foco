import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import NewsCard from "@/components/site/NewsCard";
import AdSlot from "@/components/site/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";
const PER_PAGE = 12;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return buildMetadata({
    title: `${category.name} — Foz em Foco`,
    description: category.description ?? `Notícias de ${category.name} em Foz do Iguaçu.`,
    path: `/categoria/${slug}`,
  });
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(new Date(date));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: "publicado", categoryId: category.id },
      include: { category: true, author: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.article.count({ where: { status: "publicado", categoryId: category.id } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const [hero, ...rest] = articles;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 pb-4 border-b-4 border-teal">
        <span className="text-xs font-mono uppercase tracking-widest text-muted">Editoria</span>
        <h1 className="font-serif text-4xl font-bold text-ink">{category.name}</h1>
        {category.description && <p className="text-muted mt-1">{category.description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {page === 1 && hero && (
            <div className="mb-6">
              <NewsCard
                title={hero.title}
                category={hero.category.name}
                categorySlug={hero.category.slug}
                slug={hero.slug}
                imageUrl={hero.imageUrl ?? undefined}
                meta={`${formatDate(hero.publishedAt)} · ${hero.readTime} min`}
                variant="lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(page === 1 ? rest : articles).map((a) => (
              <NewsCard
                key={a.id}
                title={a.title}
                category={a.category.name}
                categorySlug={a.category.slug}
                slug={a.slug}
                imageUrl={a.imageUrl ?? undefined}
                meta={formatDate(a.publishedAt)}
                variant="md"
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium border transition-colors ${
                    p === page
                      ? "bg-teal text-white border-teal"
                      : "border-border hover:border-teal hover:text-teal"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <AdSlot slotId="mpu" />
        </aside>
      </div>
    </div>
  );
}
