import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NewsCard from "@/components/site/NewsCard";
import Dashboard from "@/components/site/Dashboard";
import NewsletterCTA from "@/components/site/NewsletterCTA";
import SidebarMostRead from "@/components/site/SidebarMostRead";
import SidebarLatest from "@/components/site/SidebarLatest";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Foz em Foco",
  description: "As últimas notícias de Foz do Iguaçu e da tríplice fronteira. Câmbio, clima, status das pontes e muito mais.",
});

async function getHomeData() {
  const hero = await prisma.article.findFirst({
    where: { status: "publicado", featured: true },
    include: { category: true, author: true },
    orderBy: { publishedAt: "desc" },
  });
  const feed = await prisma.article.findMany({
    where: { status: "publicado" },
    include: { category: true, author: true },
    orderBy: { publishedAt: "desc" },
    take: 12,
  });
  const mostRead = await prisma.article.findMany({
    where: { status: "publicado" },
    orderBy: { views: "desc" },
    include: { category: true },
    take: 5,
  });
  const latest = await prisma.article.findMany({
    where: { status: "publicado" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 7,
  });
  return { hero, feed: feed.filter(a => a.id !== hero?.id), mostRead, latest };
}

function timeAgo(date: Date | null) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "há menos de 1h";
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

// Placeholder cards when DB is empty
const PLACEHOLDER_HERO = {
  title: "Prefeitura anuncia pacote de R$ 12 mi para revitalizar 14 quadras do Centro",
  category: { name: "Cidade", slug: "cidade" },
  author: { name: "Mariana Souza" },
  publishedAt: null as Date | null,
  readTime: 6,
  imageUrl: null as string | null,
  slug: "placeholder",
  id: "0",
};

const PLACEHOLDER_FEED = [
  { title: "Câmara aprova novo Plano Diretor com foco em mobilidade urbana", category: { name: "Política", slug: "politica" }, slug: "a", id: "1", publishedAt: null as Date | null, imageUrl: null as string | null, readTime: 4, author: { name: "" } },
  { title: "Governo libera R$ 40 mi para duplicação da PR-495 no trecho de Foz", category: { name: "Economia", slug: "economia" }, slug: "b", id: "2", publishedAt: null as Date | null, imageUrl: null as string | null, readTime: 3, author: { name: "" } },
  { title: "Programa Foz Segura reduz em 40% os roubos de veículos em 6 meses", category: { name: "Cidade", slug: "cidade" }, slug: "c", id: "3", publishedAt: null as Date | null, imageUrl: null as string | null, readTime: 5, author: { name: "" } },
];

const PLACEHOLDER_GRID = [
  { title: "Cataratas batem recorde de visitantes em abril: o que explica o pico", category: { name: "Turismo", slug: "turismo" }, slug: "d", id: "4", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "Festival das Etnias confirma 15 países e música até meia-noite", category: { name: "Cultura", slug: "cultura" }, slug: "e", id: "5", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "O que vale comprar no Paraguai em maio: guia atualizado", category: { name: "Paraguai", slug: "paraguai" }, slug: "f", id: "6", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "40 anos da usina: quem construiu Itaipu e nunca mais saiu de Foz", category: { name: "Itaipu", slug: "itaipu" }, slug: "g", id: "7", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "Concurso público da prefeitura abre 450 vagas com salários até R$10,3k", category: { name: "Cidade", slug: "cidade" }, slug: "h", id: "8", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "Câmbio favorece varejo: fluxo de turistas argentinos sobe 60% em abril", category: { name: "Economia", slug: "economia" }, slug: "i", id: "9", imageUrl: null as string | null, publishedAt: null as Date | null },
];

export default async function HomePage() {
  let data: Awaited<ReturnType<typeof getHomeData>> | null = null;
  try {
    data = await getHomeData();
  } catch (e) {
    console.error("HOME_ERROR", e);
  }

  const hero = data?.hero ?? PLACEHOLDER_HERO;
  const feedItems = data?.feed ?? [];
  const secondaryArticles = (feedItems.slice(0, 3).length > 0 ? feedItems.slice(0, 3) : PLACEHOLDER_FEED) as typeof PLACEHOLDER_FEED;
  const gridArticles = (feedItems.slice(3, 9).length > 0 ? feedItems.slice(3, 9) : PLACEHOLDER_GRID) as typeof PLACEHOLDER_GRID;
  const mostRead = data?.mostRead ?? [];
  const latest = data?.latest ?? [];

  return (
    <>
      <Dashboard />

      {/* Hero */}
      <section style={{ padding: "32px 0 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

            {/* Main hero card */}
            <Link href={`/${hero.category.slug}/${hero.slug}`}>
              <div className="card" style={{ cursor: "pointer" }}>
                {hero.imageUrl ? (
                  <div style={{ position: "relative", aspectRatio: "16/7", width: "100%", overflow: "hidden" }}>
                    <Image src={hero.imageUrl} alt={hero.title} fill style={{ objectFit: "cover" }} />
                  </div>
                ) : (
                  <div className="imgph" data-label="foto capa" style={{ aspectRatio: "16/7", width: "100%" }} />
                )}
                <div style={{ padding: "24px 28px" }}>
                  <div className="row" style={{ gap: 8, marginBottom: 10 }}>
                    <span className={`cat-tag ${hero.category.slug}`}>{hero.category.name}</span>
                    <span className="cat-tag" style={{ background: "#f0faf9", color: "var(--teal)", border: "1px solid var(--teal-light)" }}>Capa</span>
                    <span className="t-mono color-muted" style={{ marginLeft: "auto" }}>
                      {timeAgo(hero.publishedAt)} · {hero.readTime} min
                    </span>
                  </div>
                  <h1 className="t-display" style={{ marginBottom: 10, maxWidth: 720 }}>{hero.title}</h1>
                  <div className="row" style={{ gap: 12 }}>
                    {"author" in hero && hero.author && (
                      <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                        <strong>{(hero.author as { name: string }).name}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            {/* Right column */}
            <div className="col" style={{ gap: 16 }}>
              {secondaryArticles.map(a => (
                <Link key={a.id} href={`/${a.category.slug}/${a.slug}`}>
                  <div className="card" style={{ display: "flex", gap: 0, cursor: "pointer", overflow: "hidden" }}>
                    {a.imageUrl ? (
                      <div style={{ position: "relative", width: 90, flexShrink: 0 }}>
                        <Image src={a.imageUrl} alt={a.title} fill style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div className="imgph" data-label={a.category.slug} style={{ width: 90, flexShrink: 0, minHeight: 80 }} />
                    )}
                    <div style={{ padding: "10px 14px", flex: 1 }}>
                      <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                        <span className={`cat-tag ${a.category.slug}`}>{a.category.name}</span>
                        <span className="t-mono color-muted" style={{ marginLeft: "auto", fontSize: 10 }}>{timeAgo(a.publishedAt)}</span>
                      </div>
                      <div className="t-small truncate-2" style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.3, color: "var(--ink)" }}>
                        {a.title}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Enquete */}
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: 16, boxShadow: "var(--shadow-s)" }}>
                <div className="t-mono" style={{ color: "var(--teal)", marginBottom: 8, fontSize: 11 }}>ENQUETE DO DIA · 1.243 votos</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, marginBottom: 14, lineHeight: 1.3 }}>
                  Você apoia a revitalização do Centro nos moldes anunciados?
                </div>
                {[["Sim, urgente", 62], ["Com ressalvas", 24], ["Não", 14]].map(([l, p]) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <div className="row between t-small" style={{ marginBottom: 4 }}>
                      <span>{l}</span>
                      <span className="t-mono" style={{ color: "var(--teal)" }}>{p}%</span>
                    </div>
                    <div style={{ height: 6, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${p}%`, height: "100%", background: "var(--teal)", borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
                  Votar →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main feed */}
      <section style={{ padding: "40px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>

            {/* Main column */}
            <div>
              <div className="sec-label bold mt-l">Cidade em movimento</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 16 }}>
                {gridArticles.map(a => (
                  <NewsCard
                    key={a.id}
                    title={a.title}
                    category={a.category.name}
                    categorySlug={a.category.slug}
                    slug={a.slug}
                    imageUrl={a.imageUrl ?? undefined}
                    meta={timeAgo(a.publishedAt)}
                  />
                ))}
              </div>

              {/* Explore Foz */}
              <div className="sec-label bold" style={{ marginTop: 32 }}>Explore Foz</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
                {[
                  { title: "Guia Comercial", desc: "1.847 negócios verificados", href: "/guia" },
                  { title: "Agenda de Eventos", desc: "347 eventos nos próximos 90 dias", href: "/agenda" },
                  { title: "Empregos", desc: "432 vagas abertas esta semana", href: "/empregos" },
                ].map(({ title, desc, href }) => (
                  <Link key={href} href={href}>
                    <div style={{
                      background: "white", border: "1px solid var(--border)",
                      borderRadius: "var(--r-l)", padding: 20, cursor: "pointer",
                      boxShadow: "var(--shadow-s)",
                    }}>
                      <div className="t-h4">{title}</div>
                      <div className="t-small color-muted" style={{ marginTop: 4 }}>{desc}</div>
                      <div style={{ marginTop: 12, color: "var(--teal)", fontSize: 13, fontWeight: 600 }}>Abrir →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 80, width: 320, minWidth: 0, overflow: "hidden" }}>
              <SidebarMostRead articles={mostRead as Parameters<typeof SidebarMostRead>[0]["articles"]} />
              <NewsletterCTA />
              <SidebarLatest articles={latest as Parameters<typeof SidebarLatest>[0]["articles"]} />
              <div style={{ background: "var(--ink)", color: "white", borderRadius: "var(--r-l)", padding: 16 }}>
                <div className="t-mono" style={{ opacity: .5, fontSize: 10, marginBottom: 6 }}>PATROCINADOR DA SEÇÃO CIDADE</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>Construtora 3 Fronteiras</div>
                <div style={{ fontSize: 12, opacity: .7, marginTop: 4 }}>logo + tagline em todas as páginas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .feed-grid { grid-template-columns: 1fr !important; }
          .cards-3 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 640px) {
          .cards-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
