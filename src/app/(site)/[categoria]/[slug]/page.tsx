import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata, buildArticleJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NewsletterCTA from "@/components/site/NewsletterCTA";
import SidebarMostRead from "@/components/site/SidebarMostRead";
import SidebarLatest from "@/components/site/SidebarLatest";
import MobileArticleLayout from "@/components/mobile/MobileArticleLayout";

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
  try {
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
  } catch {
    return {};
  }
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

function timeAgo(date: Date | null) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "há menos de 1h";
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

export default async function ArticlePage({ params }: Props) {
  const { categoria, slug } = await params;

  let article = null;
  let related: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  let mostRead: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  let latest: Awaited<ReturnType<typeof prisma.article.findMany>> = [];

  try {
    article = await prisma.article.findUnique({
      where: { slug },
      include: { category: true, author: true, tags: true, comments: { where: { status: "aprovado" }, orderBy: { createdAt: "asc" } } },
    });

    if (article) {
      prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(() => {});
      [related, mostRead, latest] = await Promise.all([
        prisma.article.findMany({ where: { status: "publicado", categoryId: article.categoryId, id: { not: article.id } }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: 4 }),
        prisma.article.findMany({ where: { status: "publicado" }, orderBy: { views: "desc" }, include: { category: true }, take: 5 }),
        prisma.article.findMany({ where: { status: "publicado" }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: 7 }),
      ]);
    }
  } catch (e) {
    console.error("ARTICLE_ERROR", e);
  }

  if (!article || article.category.slug !== categoria || article.status !== "publicado") {
    notFound();
  }

  const jsonLd = article.publishedAt && article.author
    ? buildArticleJsonLd({ title: article.title, description: article.lead ?? "", image: article.imageUrl ?? "", publishedAt: article.publishedAt, updatedAt: article.updatedAt, authorName: article.author.name ?? "Redação", path: `/${categoria}/${slug}` })
    : null;

  const publishedLabel = article.publishedAt ? formatDate(article.publishedAt) : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      {/* Mobile */}
      <div className="md:hidden">
        <MobileArticleLayout
          category={{ name: article.category.name, slug: article.category.slug }}
          title={article.title}
          lead={article.lead}
          imageUrl={article.imageUrl}
          authorName={article.author.name}
          authorInitial={(article.author.name ?? "R")[0]}
          publishedLabel={publishedLabel}
          readTime={article.readTime}
          views={article.views}
          bodyHtml={article.body}
          tags={article.tags.map((t) => ({ id: t.id, name: t.name }))}
          related={related.map((r) => ({ id: r.id, title: r.title }))}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
      <div className="container" style={{ padding: "24px 20px" }}>
        {/* Leaderboard ad */}
        <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 970×90</span>
        </div>

        <div className="grid-main-side">
          <article>
            {/* Breadcrumb */}
            <div className="t-mono color-muted" style={{ marginBottom: 10, fontSize: 11 }}>
              <Link href="/" style={{ color: "var(--teal)" }}>Home</Link>{" › "}
              <Link href={`/categoria/${article.category.slug}`} style={{ color: "var(--teal)" }}>{article.category.name}</Link>{" › "}
              <span>{article.title.slice(0, 55)}{article.title.length > 55 ? "…" : ""}</span>
            </div>

            <div className="row" style={{ gap: 8, marginBottom: 12 }}>
              <span className={`cat-tag ${article.category.slug}`}>{article.category.name}</span>
              {article.featured && <span className="cat-tag" style={{ background: "#f0faf9", color: "var(--teal)", border: "1px solid var(--teal-light)" }}>Destaque</span>}
            </div>

            <h1 className="t-h1" style={{ marginBottom: 14, lineHeight: 1.15 }}>{article.title}</h1>

            {article.lead && (
              <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--ink-2)", borderLeft: "3px solid var(--teal)", paddingLeft: 16, marginBottom: 20, fontStyle: "italic" }}>
                {article.lead}
              </p>
            )}

            {/* Meta */}
            <div className="row" style={{ gap: 16, paddingBottom: 18, borderBottom: "1px solid var(--border)", marginBottom: 24, flexWrap: "wrap" }}>
              <div className="row" style={{ gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--teal-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--teal)" }}>{(article.author.name ?? "R")[0]}</span>
                </div>
                <Link href={`/autor/${article.author.id}`} style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>
                  {article.author.name ?? "Redação"}
                </Link>
              </div>
              {article.publishedAt && <span className="t-mono color-muted" style={{ fontSize: 11 }}>{formatDate(article.publishedAt)}</span>}
              <span className="t-mono color-muted" style={{ fontSize: 11 }}>{article.readTime} min de leitura</span>
              <span className="t-mono color-muted" style={{ fontSize: 11 }}>{article.views.toLocaleString()} views</span>
            </div>

            {/* Cover image */}
            {article.imageUrl ? (
              <div style={{ position: "relative", aspectRatio: "16/7", width: "100%", overflow: "hidden", borderRadius: "var(--r-l)", marginBottom: 24 }}>
                <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} priority />
                {article.imageCaption && (
                  <p style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.6)", color: "white", fontSize: 12, padding: "6px 14px", fontFamily: "var(--font-mono)" }}>{article.imageCaption}</p>
                )}
              </div>
            ) : (
              <div className="imgph" data-label="foto da matéria" style={{ aspectRatio: "16/7", width: "100%", borderRadius: "var(--r-l)", marginBottom: 24 }} />
            )}

            {/* Body */}
            <div
              className="prose prose-lg max-w-none"
              style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.85, color: "var(--ink-2)" }}
              dangerouslySetInnerHTML={{ __html: article.body }}
            />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="row" style={{ gap: 8, marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
                {article.tags.map((tag) => (
                  <Link key={tag.id} href={`/busca?q=${encodeURIComponent(tag.name)}`} className="pill">#{tag.name}</Link>
                ))}
              </div>
            )}

            <div style={{ marginTop: 40, marginBottom: 40 }}><NewsletterCTA /></div>

            {/* Comments */}
            <div style={{ marginTop: 32 }}>
              <div className="sec-label bold" style={{ marginBottom: 20 }}>Comentários ({article.comments.length})</div>
              {article.comments.length === 0 ? (
                <div style={{ background: "var(--paper-2)", borderRadius: "var(--r-l)", padding: 32, textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                  Seja o primeiro a comentar
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {article.comments.map((c) => (
                    <div key={c.id} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: "16px 20px" }}>
                      <div className="row" style={{ gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontWeight: 700, color: "var(--ink-3)", fontSize: 13 }}>{c.name[0]}</span>
                        </div>
                        <strong style={{ fontSize: 14 }}>{c.name}</strong>
                        <span className="t-mono color-muted" style={{ fontSize: 11, marginLeft: "auto" }}>{timeAgo(c.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>{c.body}</p>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 20, background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: 20 }}>
                <div className="t-h4" style={{ marginBottom: 14 }}>Deixe um comentário</div>
                <input className="input" placeholder="Seu nome" style={{ marginBottom: 10 }} />
                <textarea className="input" placeholder="Seu comentário..." rows={4} style={{ resize: "vertical", marginBottom: 12 }} />
                <button className="btn btn-primary">Enviar comentário →</button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="sidebar-sticky">
            <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 300×250</span>
            </div>

            {related.length > 0 && (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}><span className="t-h4">Relacionadas</span></div>
                {related.map((a, i) => (
                  <Link key={a.id} href={`/${(a as typeof article & { category: { slug: string } }).category.slug}/${a.slug}`}>
                    <div style={{ padding: "12px 16px", borderBottom: i < related.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
                      <span className={`cat-tag ${(a as typeof article & { category: { slug: string; name: string } }).category.slug}`} style={{ marginBottom: 6, display: "inline-block" }}>
                        {(a as typeof article & { category: { name: string } }).category.name}
                      </span>
                      <div className="t-small truncate-2" style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.3 }}>{a.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <SidebarMostRead articles={mostRead as unknown as Parameters<typeof SidebarMostRead>[0]["articles"]} />
            <NewsletterCTA />
            <SidebarLatest articles={latest as unknown as Parameters<typeof SidebarLatest>[0]["articles"]} />

            <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 300×600</span>
            </div>
          </aside>
        </div>
      </div>
      </div>
    </>
  );
}
