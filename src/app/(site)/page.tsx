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
import MobileHomeLayout from "@/components/mobile/MobileHomeLayout";

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

// Placeholders quando o banco estiver vazio
const PH_HERO = {
  title: "Prefeitura anuncia pacote de R$ 12 mi para revitalizar 14 quadras do Centro",
  lead: "Obras preveem calçamento, arborização e nova iluminação — mas engenheiros ouvidos pela reportagem questionam o cronograma de 8 meses.",
  category: { name: "Cidade", slug: "cidade" },
  author: { name: "Mariana Souza", image: null as string | null },
  publishedAt: null as Date | null,
  readTime: 6,
  views: 2104,
  imageUrl: null as string | null,
  slug: "placeholder",
  id: "0",
};

const PH_SECONDARY = [
  { title: "Câmara aprova novo Plano Diretor com foco em mobilidade urbana",    category: { name: "Política",   slug: "politica"  }, slug: "a", id: "1", publishedAt: null as Date | null, imageUrl: null as string | null },
  { title: "Governo libera R$ 40 mi para duplicação da PR-495 no trecho de Foz", category: { name: "Economia",   slug: "economia"  }, slug: "b", id: "2", publishedAt: null as Date | null, imageUrl: null as string | null },
  { title: "Programa Foz Segura reduz em 40% os roubos de veículos em 6 meses",  category: { name: "Segurança",  slug: "seguranca" }, slug: "c", id: "3", publishedAt: null as Date | null, imageUrl: null as string | null },
];

const PH_GRID = [
  { title: "Cataratas batem recorde de visitantes em abril: o que explica o pico",  category: { name: "Turismo",  slug: "turismo"  }, slug: "d", id: "4", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "Festival das Etnias confirma 15 países e música até meia-noite",         category: { name: "Cultura",  slug: "cultura"  }, slug: "e", id: "5", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "O que vale comprar no Paraguai em maio: guia atualizado",                category: { name: "Paraguai", slug: "paraguai" }, slug: "f", id: "6", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "40 anos da usina: quem construiu Itaipu e nunca mais saiu de Foz",       category: { name: "Itaipu",   slug: "itaipu"   }, slug: "g", id: "7", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "Concurso público da prefeitura abre 450 vagas com salários até R$10,3k", category: { name: "Cidade",   slug: "cidade"   }, slug: "h", id: "8", imageUrl: null as string | null, publishedAt: null as Date | null },
  { title: "Câmbio favorece varejo: fluxo de turistas argentinos sobe 60% em abril", category: { name: "Economia", slug: "economia" }, slug: "i", id: "9", imageUrl: null as string | null, publishedAt: null as Date | null },
];

// Ícones SVG inline para "Explore Foz"
const IconCategories = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconAgenda = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconShare = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconPlay = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

export default async function HomePage() {
  let data: Awaited<ReturnType<typeof getHomeData>> | null = null;
  try { data = await getHomeData(); } catch (e) { console.error("HOME_ERROR", e); }

  const hero = data?.hero ?? PH_HERO;
  const feedItems = data?.feed ?? [];
  const secondary  = (feedItems.slice(0, 3).length  > 0 ? feedItems.slice(0, 3)  : PH_SECONDARY) as typeof PH_SECONDARY;
  const gridItems  = (feedItems.slice(3, 9).length  > 0 ? feedItems.slice(3, 9)  : PH_GRID)      as typeof PH_GRID;
  const mostRead   = data?.mostRead ?? [];
  const latest     = data?.latest ?? [];

  const heroLead = "lead" in hero
    ? (hero as typeof PH_HERO).lead
    : PH_HERO.lead;
  const heroViews = "views" in hero ? (hero as typeof PH_HERO).views : 0;

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <MobileHomeLayout />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
      <Dashboard />

      {/* ── Hero ── */}
      <section style={{ padding: "32px 0 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

            {/* Artigo principal */}
            <Link href={`/${hero.category.slug}/${hero.slug}`}>
              <div className="card" style={{ cursor: "pointer" }}>
                {hero.imageUrl ? (
                  <div style={{ position: "relative", aspectRatio: "16/7", width: "100%", overflow: "hidden" }}>
                    <Image src={hero.imageUrl} alt={hero.title} fill style={{ objectFit: "cover" }} priority />
                  </div>
                ) : (
                  <div className="imgph" data-label="foto capa · revitalização centro foz" style={{ aspectRatio: "16/7", width: "100%" }} />
                )}
                <div style={{ padding: "24px 28px" }}>
                  <div className="row" style={{ gap: 8, marginBottom: 10 }}>
                    <span className={`cat-tag ${hero.category.slug}`}>{hero.category.name}</span>
                    <span className="cat-tag" style={{ background: "#f0faf9", color: "var(--teal)", border: "1px solid var(--teal-light)" }}>Capa</span>
                    <span className="t-mono color-muted" style={{ marginLeft: "auto" }}>
                      {timeAgo(hero.publishedAt)} · {("readTime" in hero ? (hero as typeof PH_HERO).readTime : 5)} min
                    </span>
                  </div>
                  <h1 className="t-display" style={{ marginBottom: 10, maxWidth: 720 }}>{hero.title}</h1>
                  {heroLead && (
                    <p style={{ fontSize: 17, color: "var(--ink-3)", lineHeight: 1.6, maxWidth: 640, marginBottom: 14 }}>
                      {heroLead}
                    </p>
                  )}
                  <div className="row" style={{ gap: 12 }}>
                    <div className="row" style={{ gap: 6 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--teal-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {"author" in hero && (hero as typeof PH_HERO).author?.image ? (
                          <Image src={(hero as typeof PH_HERO).author!.image!} alt="" width={28} height={28} style={{ objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)" }}>
                            {("author" in hero ? (hero as typeof PH_HERO).author?.name?.[0] : "R") ?? "R"}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                        <strong>{"author" in hero ? (hero as typeof PH_HERO).author?.name ?? "Redação" : "Redação"}</strong>
                      </span>
                    </div>
                    {heroViews > 0 && (
                      <span className="t-mono color-muted">{heroViews.toLocaleString()} views</span>
                    )}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <IconPlay /> Ouvir
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <IconShare /> Compartilhar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Coluna direita: 3 secundárias + enquete */}
            <div className="col" style={{ gap: 16 }}>
              {secondary.map(a => (
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
                      <div className="truncate-2" style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.3, color: "var(--ink)" }}>{a.title}</div>
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
                  <div key={l as string} style={{ marginBottom: 10 }}>
                    <div className="row between t-small" style={{ marginBottom: 4 }}>
                      <span>{l}</span>
                      <span className="t-mono" style={{ color: "var(--teal)" }}>{p}%</span>
                    </div>
                    <div style={{ height: 6, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${p}%`, height: "100%", background: "var(--teal)", borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>Votar →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feed principal ── */}
      <section style={{ padding: "40px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>

            {/* Coluna principal */}
            <div>
              {/* Leaderboard ad */}
              <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 970×90</span>
              </div>

              {/* Grid de notícias */}
              <div className="sec-label bold mt-l">Cidade em movimento</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 16 }}>
                {gridItems.map(a => (
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

              {/* Mid-content ad */}
              <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 120, display: "flex", alignItems: "center", justifyContent: "center", margin: "32px 0" }}>
                <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 970×250</span>
              </div>

              {/* Reportagem da semana */}
              <div className="sec-label bold">Reportagem da semana</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
                {[
                  { cat: "Investigação", title: "Por dentro do esquema de terrenos dobrados no Jardim América: como funciona e quem se beneficia", meta: "15 min · especial investigativo", slug: "investigacao-terrenos" },
                  { cat: "Especial · Itaipu", title: "40 anos, 40 histórias: as pessoas que construíram a usina e nunca mais quiseram sair de Foz", meta: "22 min · multimídia", slug: "40-anos-itaipu" },
                ].map(a => (
                  <Link key={a.slug} href={`/cidade/${a.slug}`}>
                    <div className="card" style={{ cursor: "pointer" }}>
                      <div className="imgph" data-label={a.cat.toLowerCase()} style={{ aspectRatio: "16/9" }} />
                      <div style={{ padding: "16px 18px" }}>
                        <div className="row" style={{ gap: 6, marginBottom: 8 }}>
                          <span className="cat-tag cidade">{a.cat}</span>
                        </div>
                        <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.35, marginBottom: 8 }}>{a.title}</div>
                        <div className="t-mono color-muted" style={{ fontSize: 11 }}>{a.meta}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Tríplice fronteira */}
              <div className="sec-label bold" style={{ marginTop: 32 }}>Tríplice fronteira</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20, marginTop: 16 }}>
                {[
                  { cat: "Paraguai",  catSlug: "paraguai",  title: "Ponte Amizade: os novos horários de pico e o que mudou nas regras de duty-free", meta: "há 1d", slug: "ponte-amizade-horarios" },
                  { cat: "Argentina", catSlug: "turismo",   title: "Puerto Iguazú recebe novo voo low-cost a partir de junho: como reservar", meta: "há 2d", slug: "puerto-iguazu-voo" },
                ].map(a => (
                  <Link key={a.slug} href={`/${a.catSlug}/${a.slug}`}>
                    <div className="card" style={{ cursor: "pointer" }}>
                      <div className="imgph" data-label={a.cat.toLowerCase()} style={{ aspectRatio: "16/9" }} />
                      <div style={{ padding: "14px 16px" }}>
                        <div className="row" style={{ gap: 6, marginBottom: 6 }}>
                          <span className={`cat-tag ${a.catSlug}`}>{a.cat}</span>
                          <span className="t-mono color-muted" style={{ marginLeft: "auto", fontSize: 10 }}>{a.meta}</span>
                        </div>
                        <div className="truncate-2" style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.35 }}>{a.title}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Explore Foz */}
              <div className="sec-label bold" style={{ marginTop: 32 }}>Explore Foz</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
                {[
                  { title: "Guia Comercial",   desc: "1.847 negócios verificados",        href: "/guia",     icon: <IconCategories /> },
                  { title: "Agenda de Eventos", desc: "347 eventos nos próximos 90 dias",  href: "/agenda",   icon: <IconAgenda /> },
                  { title: "Empregos",          desc: "432 vagas abertas esta semana",     href: "/empregos", icon: <IconChart /> },
                ].map(({ title, desc, href, icon }) => (
                  <Link key={href} href={href}>
                    <div className="explore-card">
                      <div style={{ marginBottom: 12, color: "var(--teal)" }}>{icon}</div>
                      <div className="t-h4">{title}</div>
                      <div className="t-small color-muted" style={{ marginTop: 4 }}>{desc}</div>
                      <div className="btn-ghost btn-sm" style={{ marginTop: 12, padding: 0, color: "var(--teal)", fontSize: 13, fontWeight: 600 }}>Abrir →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 80, width: 320, minWidth: 0, overflow: "hidden" }}>
              <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 300×250</span>
              </div>
              <SidebarMostRead articles={mostRead as Parameters<typeof SidebarMostRead>[0]["articles"]} />
              <NewsletterCTA />
              <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 300×600</span>
              </div>
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
          .cards-2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .cards-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
      </div>
    </>
  );
}
