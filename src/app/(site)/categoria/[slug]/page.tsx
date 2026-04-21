import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CategoryHeader } from "@/components/site/CategoryHeader";
import SidebarLatest from "@/components/site/SidebarLatest";

interface Props {
  params: Promise<{ slug: string }>;
}

const EDITORIAS: Record<string, { label: string; color: string; desc: string }> = {
  cidade:   { label: "Cidade",    color: "#0a7a6b", desc: "Obras, serviços, bairros e o dia a dia de Foz do Iguaçu." },
  politica: { label: "Política",  color: "#c0392b", desc: "Câmara Municipal, Prefeitura, eleições e poder público." },
  economia: { label: "Economia",  color: "#d35400", desc: "Comércio, emprego, investimentos e o mercado da região." },
  cultura:  { label: "Cultura",   color: "#6c3483", desc: "Arte, música, patrimônio e identidade da tríplice fronteira." },
  esporte:  { label: "Esporte",   color: "#1a6b3a", desc: "Futebol, corridas, trilhas e o esporte em Foz." },
  turismo:  { label: "Turismo",   color: "#1a6b5a", desc: "Cataratas, Itaipu, roteiros e o que fazer na região." },
  paraguai: { label: "Paraguai",  color: "#8e6914", desc: "Compras, câmbio, Ponte Amizade e a fronteira com o Paraguai." },
  itaipu:   { label: "Itaipu",    color: "#2c3e6b", desc: "A maior hidrelétrica do mundo e seu impacto na região." },
  seguranca:{ label: "Segurança", color: "#7a1f1f", desc: "Polícia, crime, trânsito e segurança pública em Foz." },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cfg = EDITORIAS[slug];
  if (!cfg) return {};
  return buildMetadata({ title: `${cfg.label} — Foz em Foco`, description: cfg.desc, path: `/categoria/${slug}` });
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const cfg = EDITORIAS[slug];
  if (!cfg) notFound();

  type ArticleWithRel = Awaited<ReturnType<typeof prisma.article.findMany>>[number] & {
    category: { slug: string; name: string; color: string };
    author: { name: string | null };
  };

  let hero: ArticleWithRel | null = null;
  let grid: ArticleWithRel[] = [];
  let latest: ArticleWithRel[] = [];

  try {
    const category = await prisma.category.findFirst({ where: { slug } });
    if (category) {
      const [artigos, latestAll] = await Promise.all([
        prisma.article.findMany({
          where: { status: "publicado", categoryId: category.id },
          include: { category: true, author: true },
          orderBy: { publishedAt: "desc" },
          take: 7,
        }),
        prisma.article.findMany({
          where: { status: "publicado" },
          include: { category: true, author: true },
          orderBy: { publishedAt: "desc" },
          take: 7,
        }),
      ]);
      hero = (artigos[0] as ArticleWithRel) ?? null;
      grid = artigos.slice(1, 7) as ArticleWithRel[];
      latest = latestAll as ArticleWithRel[];
    }
  } catch (e) {
    console.error("CATEGORIA_ERROR", e);
  }

  return (
    <>
      <CategoryHeader slug={slug} label={cfg.label} desc={cfg.desc} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>

          {/* Coluna principal */}
          <div>
            {/* HERO */}
            {hero ? (
              <Link href={`/${hero.category.slug}/${hero.slug}`}>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24, cursor: 'pointer' }}>
                  {hero.imageUrl ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '2 / 1', maxHeight: 480, overflow: 'hidden' }}>
                      <Image src={hero.imageUrl} alt={hero.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%', aspectRatio: '2 / 1', maxHeight: 480,
                      background: '#eef0f4',
                      backgroundImage: 'linear-gradient(135deg,#eef0f4 25%,#e2e5eb 25%,#e2e5eb 50%,#eef0f4 50%,#eef0f4 75%,#e2e5eb 75%)',
                      backgroundSize: '20px 20px',
                    }} />
                  )}
                  <div style={{ padding: '24px 28px' }}>
                    <span style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, background: '#e6f4f2', color: '#0a7a6b', marginBottom: 10 }}>{hero.category.name}</span>
                    <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 'clamp(24px,3vw,40px)', lineHeight: 1.1, color: '#111', marginBottom: 10 }}>{hero.title}</h1>
                    {hero.lead && <p style={{ fontSize: 15, color: '#555', lineHeight: 1.5, marginBottom: 10 }}>{hero.lead}</p>}
                    <div style={{ fontSize: 13, color: '#888' }}>{hero.author.name} · {hero.readTime} min de leitura</div>
                  </div>
                </div>
              </Link>
            ) : (
              <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 48, textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 24, marginBottom: 8 }}>Nenhuma notícia ainda</div>
                <div style={{ fontSize: 14, color: '#888' }}>Esta editoria ainda não tem conteúdo publicado. Volte em breve.</div>
              </div>
            )}

            {/* GRID 2×3 */}
            {grid.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
                {grid.map(a => (
                  <Link key={a.id} href={`/${a.category.slug}/${a.slug}`}>
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                      {a.imageUrl ? (
                        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                          <Image src={a.imageUrl} alt={a.title} fill style={{ objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ aspectRatio: '4/3', background: '#eef0f4', backgroundImage: 'linear-gradient(135deg,#eef0f4 25%,#e2e5eb 25%,#e2e5eb 50%,#eef0f4 50%,#eef0f4 75%,#e2e5eb 75%)', backgroundSize: '16px 16px' }} />
                      )}
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 14, lineHeight: 1.35, color: '#111', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{a.title}</div>
                        <div style={{ fontSize: 11, color: '#aaa' }}>{a.readTime} min</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Banner in-feed */}
            <div style={{ background: '#fef9ec', border: '1px dashed #e8c060', borderRadius: 8, minHeight: 140, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '1px 10px', fontFamily: 'monospace', fontSize: 9, color: '#c9961a', border: '1px solid #e8c060', borderRadius: 999, whiteSpace: 'nowrap' }}>Publicidade</div>
              <span style={{ fontSize: 13, color: '#c9961a', fontWeight: 500 }}>Banner in-feed</span>
              <span style={{ fontSize: 10, color: '#c9961a', opacity: 0.8 }}>970×250</span>
            </div>
          </div>

          {/* SIDEBAR 320px */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 80, alignSelf: 'flex-start' }}>
            {/* MPU 300×250 */}
            <div style={{ minHeight: 220, background: '#fef9ec', border: '1px dashed #e8c060', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '1px 10px', fontFamily: 'monospace', fontSize: 9, color: '#c9961a', border: '1px solid #e8c060', borderRadius: 999, whiteSpace: 'nowrap' }}>Publicidade</div>
              <span style={{ fontSize: 13, color: '#c9961a', fontWeight: 500 }}>MPU</span>
              <span style={{ fontSize: 10, color: '#c9961a', opacity: 0.8 }}>300×250</span>
            </div>

            {/* Newsletter CTA */}
            <div style={{ background: '#0a7a6b', borderRadius: 12, padding: 20, color: 'white' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, opacity: 0.8, letterSpacing: '0.1em', marginBottom: 6 }}>☕ NEWSLETTER · TODA MANHÃ 7H</div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, marginBottom: 8, lineHeight: 1.2 }}>Foz em 5 minutos no seu e-mail</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 14 }}>14.847 inscritos · 58% de abertura · sem spam</div>
              <Link href="/newsletter">
                <button style={{ width: '100%', padding: '11px', background: 'white', color: '#0a7a6b', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Inscrever grátis →</button>
              </Link>
            </div>

            {/* Últimas */}
            <SidebarLatest articles={latest as unknown as Parameters<typeof SidebarLatest>[0]["articles"]} />
          </div>

        </div>
      </div>
    </>
  );
}
