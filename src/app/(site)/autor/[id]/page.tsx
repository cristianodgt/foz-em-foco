import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NewsCard from "@/components/site/NewsCard";
import SidebarMostRead from "@/components/site/SidebarMostRead";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const author = await prisma.user.findUnique({ where: { id } });
    if (!author) return {};
    return buildMetadata({
      title: `${author.name} — Foz em Foco`,
      description: `Matérias e cobertura jornalística de ${author.name} no portal Foz em Foco.`,
      path: `/autor/${id}`,
    });
  } catch {
    return {};
  }
}

function timeAgo(date: Date | null) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "há menos de 1h";
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

const PH_AUTHOR = {
  id: "ph",
  name: "Mariana Souza",
  email: "redacao@fozemfoco.com.br",
  image: null as string | null,
  bio: "Jornalista formada pela UNILA em 2016, com especialização em jornalismo de dados pela USP. Cobre prefeitura, câmara e obras públicas em Foz do Iguaçu há 8 anos. Finalista do Prêmio Comunique-se de Reportagem Local em 2023.",
  role: "Editora de Cidade & Política",
};

const PH_ARTIGOS = [
  { id:"1", title:"Prefeitura anuncia R$ 12 mi para revitalizar 14 quadras do Centro", category:{ name:"Cidade", slug:"cidade" }, slug:"revitalizacao-centro", imageUrl:null as string|null, publishedAt:null as Date|null },
  { id:"2", title:"Câmara aprova novo Plano Diretor com foco em mobilidade urbana",   category:{ name:"Política", slug:"politica" }, slug:"plano-diretor", imageUrl:null as string|null, publishedAt:null as Date|null },
  { id:"3", title:"Concurso público da prefeitura abre 450 vagas com salários até R$10,3k", category:{ name:"Cidade", slug:"cidade" }, slug:"concurso-prefeitura", imageUrl:null as string|null, publishedAt:null as Date|null },
  { id:"4", title:"Obras da BR-277 iniciam em maio e devem durar 8 meses",            category:{ name:"Cidade", slug:"cidade" }, slug:"obras-br-277", imageUrl:null as string|null, publishedAt:null as Date|null },
  { id:"5", title:"Governo estadual libera R$ 40 mi para duplicação da PR-495",       category:{ name:"Economia", slug:"economia" }, slug:"duplicacao-pr-495", imageUrl:null as string|null, publishedAt:null as Date|null },
];

export default async function AutorPage({ params }: Props) {
  const { id } = await params;

  let author: typeof PH_AUTHOR | null = null;
  let articles: typeof PH_ARTIGOS = [];
  let mostRead: Awaited<ReturnType<typeof prisma.article.findMany>> = [];

  try {
    const dbAuthor = await prisma.user.findUnique({ where: { id } });
    if (dbAuthor) {
      author = {
        id: dbAuthor.id,
        name: dbAuthor.name ?? "Redação",
        email: dbAuthor.email,
        image: dbAuthor.image,
        bio: (dbAuthor as typeof dbAuthor & { bio?: string }).bio ?? PH_AUTHOR.bio,
        role: (dbAuthor as typeof dbAuthor & { role?: string }).role ?? "Jornalista",
      };
    }
    const dbArticles = await prisma.article.findMany({
      where: { status: "publicado", authorId: id },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 9,
    });
    if (dbArticles.length > 0) articles = dbArticles;
    mostRead = await prisma.article.findMany({
      where: { status: "publicado" },
      orderBy: { views: "desc" },
      include: { category: true },
      take: 5,
    });
  } catch (e) {
    console.error("AUTOR_PAGE_ERROR", e);
  }

  const a = author ?? PH_AUTHOR;
  const arts = articles.length > 0 ? articles : PH_ARTIGOS;

  const stats = [
    { k: "matérias", v: arts.length > 0 ? arts.length + "+" : "1.240" },
    { k: "views",    v: "3,2M" },
    { k: "seguidores", v: "4.8k" },
    { k: "anos",     v: "8" },
  ];

  return (
    <>
      {/* Header do autor */}
      <div style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--border)", padding: "40px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ width: 140, height: 140, borderRadius: "50%", flexShrink: 0, overflow: "hidden", border: "3px solid white", boxShadow: "var(--shadow-m)", background: "var(--teal-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {a.image ? (
                <Image src={a.image} alt={a.name} width={140} height={140} style={{ objectFit: "cover" }} />
              ) : (
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 56, color: "var(--teal)", lineHeight: 1 }}>{a.name[0]}</span>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div className="t-mono color-muted" style={{ marginBottom: 6 }}>JORNALISTA · FOZ EM FOCO</div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,44px)", marginBottom: 4 }}>{a.name}</h1>
              <div style={{ fontSize: 16, color: "var(--teal)", fontWeight: 600, marginBottom: 12 }}>{a.role}</div>
              <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.7, maxWidth: 600, marginBottom: 16 }}>{a.bio}</p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {stats.map(({ k, v }) => (
                  <div key={k} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--teal)", lineHeight: 1 }}>{v}</div>
                    <div className="t-mono color-muted" style={{ fontSize: 11, textTransform: "capitalize" }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              <button className="btn btn-primary btn-sm">Seguir</button>
              {["Twitter", "Instagram", "LinkedIn"].map(r => (
                <button key={r} className="btn btn-outline btn-sm">{r}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container" style={{ padding: "32px 20px" }}>
        <div className="grid-main-side">
          {/* Artigos */}
          <div>
            <div className="sec-label bold" style={{ marginBottom: 16 }}>Matérias recentes</div>

            {/* Destaque */}
            <NewsCard
              title={arts[0].title}
              category={arts[0].category.name}
              categorySlug={arts[0].category.slug}
              slug={arts[0].slug}
              imageUrl={arts[0].imageUrl ?? undefined}
              meta={`${timeAgo(arts[0].publishedAt)} · 6 min`}
              variant="lg"
            />

            {/* Grid 2×2 */}
            {arts.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginTop: 16 }}>
                {arts.slice(1, 5).map((art, i) => (
                  <NewsCard
                    key={art.id}
                    title={art.title}
                    category={art.category.name}
                    categorySlug={art.category.slug}
                    slug={art.slug}
                    imageUrl={art.imageUrl ?? undefined}
                    meta={`há ${i + 2}d · ${3 + i} min`}
                  />
                ))}
              </div>
            )}

            {/* Mais artigos */}
            {arts.length > 5 && (
              <>
                <div className="sec-label bold" style={{ marginTop: 32, marginBottom: 16 }}>Mais matérias</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {arts.slice(5).map(art => (
                    <Link key={art.id} href={`/${art.category.slug}/${art.slug}`}>
                      <div className="card" style={{ display: "flex", gap: 0, cursor: "pointer", overflow: "hidden" }}>
                        <div className="imgph" data-label={art.category.slug} style={{ width: 90, flexShrink: 0, minHeight: 72 }} />
                        <div style={{ padding: "10px 14px", flex: 1 }}>
                          <span className={`cat-tag ${art.category.slug}`} style={{ marginBottom: 4, display: "inline-block" }}>{art.category.name}</span>
                          <div className="truncate-2" style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.3 }}>{art.title}</div>
                          <div className="t-mono color-muted" style={{ fontSize: 10, marginTop: 4 }}>{timeAgo(art.publishedAt)}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar-sticky">
            {/* Destaques da carreira */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden", marginBottom: 24 }}>
              <div style={{ background: "var(--teal)", color: "white", padding: "14px 16px" }}>
                <div className="t-mono" style={{ fontSize: 10, opacity: .8, marginBottom: 2 }}>DESTAQUES DA CARREIRA</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>{a.name}</div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                {["Prêmio Comunique-se 2023 — finalista", "Cobertura das eleições 2024", "Série especial: Obras paradas em Foz", "Investigação: Licitações suspeitas 2022"].map((item, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none", display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13 }}>
                    <span style={{ color: "var(--teal)", fontSize: 18, lineHeight: 1 }}>★</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Ad MPU */}
            <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 250, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 300×250</span>
            </div>

            {/* Mais lidas */}
            <SidebarMostRead articles={mostRead as unknown as Parameters<typeof SidebarMostRead>[0]["articles"]} />

            {/* Sugerir pauta */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: "16px 20px", marginTop: 24 }}>
              <div className="t-mono color-muted" style={{ fontSize: 11, marginBottom: 6 }}>COLABORE COM A REDAÇÃO</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, marginBottom: 6 }}>
                Tem uma pauta pra {a.name.split(" ")[0]}?
              </div>
              <div className="t-small color-muted" style={{ marginBottom: 12 }}>Denúncias e sugestões de pauta são bem-vindas.</div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Enviar pauta</button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
