import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, buildArticleJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import NewsCard from "@/components/site/NewsCard";
import AdSlot from "@/components/site/AdSlot";
import NewsletterCTA from "@/components/site/NewsletterCTA";
import CommentSection from "@/components/site/CommentSection";
import ReadingProgress from "@/components/site/ReadingProgress";
import { Eye, Clock, Calendar, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ categoria: string; slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "publicado" },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });
    return articles.map((a) => ({ categoria: a.category.slug, slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true, author: true },
  });
  if (!article || article.category.slug !== categoria) return {};
  return buildMetadata({
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.lead ?? "",
    image: article.ogImage ?? article.imageUrl ?? undefined,
    path: `/${categoria}/${slug}`,
    type: "article",
  });
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function ArticlePage({ params }: Props) {
  const { categoria, slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      tags: true,
      comments: {
        where: { status: "aprovado" },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!article || article.category.slug !== categoria || article.status !== "publicado") {
    notFound();
  }

  // Increment views
  prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(() => {});

  // Related articles
  const related = await prisma.article.findMany({
    where: { status: "publicado", categoryId: article.categoryId, id: { not: article.id } },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const jsonLd = article.publishedAt && article.author
    ? buildArticleJsonLd({
        title: article.title,
        description: article.lead ?? "",
        image: article.imageUrl ?? "",
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        authorName: article.author.name ?? "Redação",
        path: `/${categoria}/${slug}`,
      })
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-xs text-muted mb-4 font-mono">
              <Link href="/" className="hover:text-teal">Home</Link>
              <ChevronRight size={12} />
              <Link href={`/categoria/${article.category.slug}`} className="hover:text-teal">
                {article.category.name}
              </Link>
              <ChevronRight size={12} />
              <span className="text-ink-2 line-clamp-1">{article.title}</span>
            </nav>

            <Badge category={article.category.slug} label={article.category.name} className="mb-3" />

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight mb-4">
              {article.title}
            </h1>

            {article.lead && (
              <p className="text-lg text-ink-2 italic leading-relaxed border-l-4 border-teal pl-4 mb-6">
                {article.lead}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                {article.author.image && (
                  <Image src={article.author.image} alt={article.author.name ?? ""} width={32} height={32} className="rounded-full" />
                )}
                <span className="font-medium text-ink-2">{article.author.name ?? "Redação"}</span>
              </div>
              {article.publishedAt && (
                <span className="flex items-center gap-1 font-mono text-xs">
                  <Calendar size={12} />
                  {formatDate(article.publishedAt)}
                </span>
              )}
              <span className="flex items-center gap-1 font-mono text-xs">
                <Clock size={12} /> {article.readTime} min de leitura
              </span>
              <span className="flex items-center gap-1 font-mono text-xs">
                <Eye size={12} /> {article.views.toLocaleString()} views
              </span>
            </div>

            {/* Cover image */}
            {article.imageUrl && (
              <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden mb-6">
                <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
                {article.imageCaption && (
                  <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-4 py-2 font-mono">
                    {article.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Body */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-ink prose-a:text-teal prose-a:no-underline hover:prose-a:underline prose-blockquote:border-teal prose-blockquote:text-ink-2"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/busca?q=${tag.name}`}
                    className="text-xs px-3 py-1 bg-paper border border-border rounded-full hover:border-teal hover:text-teal transition-colors font-mono"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Newsletter CTA inline */}
            <div className="my-10">
              <NewsletterCTA />
            </div>

            {/* Comments */}
            <CommentSection articleId={article.id} comments={article.comments} />
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <AdSlot slotId="mpu" />

            {related.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-widest text-muted mb-4 border-b border-border pb-2">
                  Relacionados
                </h3>
                <div className="flex flex-col gap-4">
                  {related.map((a) => (
                    <NewsCard
                      key={a.id}
                      title={a.title}
                      category={a.category.name}
                      categorySlug={a.category.slug}
                      slug={a.slug}
                      imageUrl={a.imageUrl ?? undefined}
                      variant="horizontal"
                    />
                  ))}
                </div>
              </div>
            )}

            <AdSlot slotId="halfpage" />
          </aside>
        </div>
      </div>
    </>
  );
}
