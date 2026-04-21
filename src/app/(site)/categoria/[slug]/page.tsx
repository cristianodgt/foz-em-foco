import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NewsletterCTA from "@/components/site/NewsletterCTA";
import SidebarLatest from "@/components/site/SidebarLatest";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const EDITORIAS: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  cidade:   { label: "Cidade",   color: "var(--cat-cidade)",    icon: "🏙", desc: "Obras, serviços, bairros e o dia a dia de Foz do Iguaçu." },
  politica: { label: "Política", color: "var(--cat-politica)",  icon: "🏛", desc: "Câmara Municipal, Prefeitura, eleições e poder público." },
  economia: { label: "Economia", color: "var(--cat-economia)",  icon: "📈", desc: "Comércio, emprego, investimentos e o mercado da região." },
  cultura:  { label: "Cultura",  color: "var(--cat-cultura)",   icon: "🎭", desc: "Arte, música, patrimônio e identidade da tríplice fronteira." },
  esporte:  { label: "Esporte",  color: "var(--cat-esporte)",   icon: "⚽", desc: "Futebol, corridas, trilhas e o esporte em Foz." },
  turismo:  { label: "Turismo",  color: "var(--cat-turismo)",   icon: "🌊", desc: "Cataratas, Itaipu, roteiros e o que fazer na região." },
  paraguai: { label: "Paraguai", color: "var(--cat-paraguai)",  icon: "🛒", desc: "Compras, câmbio, Ponte Amizade e a fronteira com o Paraguai." },
  itaipu:   { label: "Itaipu",   color: "var(--cat-itaipu)",    icon: "⚡", desc: "A maior hidrelétrica do mundo e seu impacto na região." },
  seguranca:{ label: "Segurança",color: "var(--cat-seguranca)", icon: "🔒", desc: "Polícia, crime, trânsito e segurança pública em Foz." },
};

const SUB_CATS: Record<string, string[]> = {
  cidade:   ["Obras","Transporte","Saúde","Educação","Segurança","Meio Ambiente"],
  politica: ["Câmara Municipal","Prefeitura","Eleições","Transparência","Orçamento"],
  economia: ["Comércio","Empregos","Agronegócio","Turismo","Investimentos"],
  cultura:  ["Música","Teatro","Patrimônio","Gastronomia","Festas"],
  esporte:  ["Futebol","Corridas","Trilhas","Natação","Outros"],
  turismo:  ["Cataratas","Itaipu","3 Fronteiras","Roteiros","Hospedagem"],
  paraguai: ["Compras","Câmbio","Ponte Amizade","CDE","Duty-Free"],
  itaipu:   ["Energia","Meio Ambiente","Turismo","Obras","Emprego"],
  seguranca:["Polícia Federal","Polícia Militar","Trânsito","Bombeiros","Outros"],
};

function timeAgo(date: Date | null) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "há menos de 1h";
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cfg = EDITORIAS[slug];
  if (!cfg) return {};
  return buildMetadata({ title: `${cfg.label} — Foz em Foco`, description: cfg.desc, path: `/categoria/${slug}` });
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const cfg = EDITORIAS[slug];
  if (!cfg) notFound();

  const page = parseInt(pageParam ?? "1", 10);
  const perPage = 12;

  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  let total = 0;
  let latest: Awaited<ReturnType<typeof prisma.article.findMany>> = [];

  try {
    const category = await prisma.category.findFirst({ where: { slug } });
    if (category) {
      [articles, total, latest] = await Promise.all([
        prisma.article.findMany({
          where: { status: "publicado", categoryId: category.id },
          include: { category: true, author: true },
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.article.count({ where: { status: "publicado", categoryId: category.id } }),
        prisma.article.findMany({ where: { status: "publicado" }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: 7 }),
      ]);
    }
  } catch (e) {
    console.error("CATEGORIA_ERROR", e);
  }

  const subs = SUB_CATS[slug] ?? [];
  const totalPages = Math.ceil(total / perPage);

  return (
    <>
      {/* Hero */}
      <div style={{ background: "var(--ink)", padding: "40px 0 0" }}>
        <div className="container">
          <div className="row" style={{ gap: 14, marginBottom: 20 }}>
            <span style={{ fontSize: 40 }}>{cfg.icon}</span>
            <div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,5vw,52px)", color: "white", lineHeight: 1.05, marginBottom: 6 }}>{cfg.label}</h1>
              <p className="t-mono" style={{ color: "rgba(255,255,255,.45)", fontSize: 13 }}>{cfg.desc}</p>
            </div>
          </div>
          {/* Sub-cat tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Link href={`/categoria/${slug}`}>
              <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.15)", color: "white", border: "none", borderRadius: "var(--r-s) var(--r-s) 0 0" }}>Todos</button>
            </Link>
            {subs.map((sub) => (
              <Link key={sub} href={`/categoria/${slug}?sub=${encodeURIComponent(sub)}`}>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.65)", border: "none", borderRadius: "var(--r-s) var(--r-s) 0 0" }}>{sub}</button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 20px" }}>
        <div className="grid-main-side">
          <div>
            {articles.length === 0 ? (
              <div style={{ background: "var(--paper-2)", borderRadius: "var(--r-l)", padding: 48, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 8 }}>Nenhuma notícia ainda</div>
                <div className="t-small color-muted">Esta editoria ainda não tem conteúdo publicado. Volte em breve.</div>
              </div>
            ) : (
              <>
                <div className="sec-label bold" style={{ marginBottom: 16 }}>{total} notícia{total !== 1 ? "s" : ""}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
                  {articles.map((a) => {
                    const cat = (a as typeof a & { category: { slug: string; name: string } }).category;
                    return (
                      <Link key={a.id} href={`/${cat.slug}/${a.slug}`}>
                        <div className="card" style={{ cursor: "pointer" }}>
                          {a.imageUrl ? (
                            <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                              <Image src={a.imageUrl} alt={a.title} fill style={{ objectFit: "cover" }} />
                            </div>
                          ) : (
                            <div className="imgph" data-label={cat.slug} style={{ aspectRatio: "4/3" }} />
                          )}
                          <div style={{ padding: "14px 16px" }}>
                            <div className="row" style={{ gap: 6, marginBottom: 8 }}>
                              <span className={`cat-tag ${cat.slug}`}>{cat.name}</span>
                              <span className="t-mono color-muted" style={{ marginLeft: "auto", fontSize: 10 }}>{timeAgo(a.publishedAt)}</span>
                            </div>
                            <div className="truncate-2" style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.35 }}>{a.title}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="row" style={{ gap: 8, marginTop: 32, justifyContent: "center" }}>
                    {page > 1 && <Link href={`/categoria/${slug}?page=${page - 1}`}><button className="btn btn-outline btn-sm">← Anterior</button></Link>}
                    <span className="t-mono color-muted" style={{ fontSize: 12, padding: "6px 12px" }}>{page} / {totalPages}</span>
                    {page < totalPages && <Link href={`/categoria/${slug}?page=${page + 1}`}><button className="btn btn-outline btn-sm">Próxima →</button></Link>}
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="sidebar-sticky">
            <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 300×250</span>
            </div>
            <NewsletterCTA />
            <SidebarLatest articles={latest as unknown as Parameters<typeof SidebarLatest>[0]["articles"]} />
            <div style={{ background: "var(--ink)", color: "white", borderRadius: "var(--r-l)", padding: 16 }}>
              <div className="t-mono" style={{ opacity: .5, fontSize: 10, marginBottom: 6 }}>PATROCINADOR · {cfg.label.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>Anuncie aqui</div>
              <Link href="/anuncie">
                <button className="btn btn-sm" style={{ background: "var(--teal)", color: "white", border: "none", marginTop: 12, width: "100%", justifyContent: "center" }}>Saiba mais →</button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
