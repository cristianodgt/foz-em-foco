import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { RotatingAd } from "@/components/site/RotatingAd";
import { MaisLidas } from "@/components/site/MaisLidas";
import { UltimasFeed } from "@/components/site/UltimasFeed";
import { ArticleCard } from "@/components/site/ArticleCard";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

const EDITORIAS: Record<string, { nome: string; desc: string; patrocinador: string; subcats: string[] }> = {
  cidade:   { nome: 'Cidade',    desc: 'Obras, serviços, bairros e o dia a dia de Foz do Iguaçu.',    patrocinador: 'Construtora 3 Fronteiras',   subcats: ['Obras', 'Transporte', 'Saúde', 'Educação', 'Segurança', 'Meio Ambiente'] },
  politica: { nome: 'Política',  desc: 'Câmara Municipal, Prefeitura, eleições e poder público.',     patrocinador: 'Escritório Jurídico Alves',  subcats: ['Câmara', 'Prefeitura', 'Eleições', 'Transparência'] },
  economia: { nome: 'Economia',  desc: 'Comércio, emprego, investimentos e câmbio.',                  patrocinador: 'Sicredi Foz',                subcats: ['Comércio', 'Empregos', 'Agronegócio', 'Investimentos'] },
  turismo:  { nome: 'Turismo',   desc: 'Cataratas, Itaipu, roteiros e hospedagem.',                   patrocinador: 'Belmond Hotel das Cataratas', subcats: ['Cataratas', 'Itaipu', '3 Fronteiras', 'Roteiros', 'Hospedagem'] },
  paraguai: { nome: 'Paraguai',  desc: 'Ciudad del Este, compras, câmbio e fronteira.',               patrocinador: 'Câmbio 100%',                subcats: ['Compras', 'Câmbio', 'Ponte Amizade', 'CDE', 'Duty-Free'] },
  cultura:  { nome: 'Cultura',   desc: 'Arte, música, eventos e identidade da tríplice fronteira.',   patrocinador: 'Teatro Barrageiros',         subcats: ['Música', 'Teatro', 'Patrimônio', 'Gastronomia', 'Festas'] },
  esporte:  { nome: 'Esporte',   desc: 'Futebol, corridas, trilhas e esporte em Foz.',                patrocinador: 'Academia Total Foz',         subcats: ['Futebol', 'Corridas', 'Trilhas', 'Natação', 'Outros'] },
  itaipu:   { nome: 'Itaipu',    desc: 'A maior hidrelétrica do mundo e seu impacto na região.',      patrocinador: 'Itaipu Binacional',          subcats: ['Energia', 'Meio Ambiente', 'Turismo', 'Obras'] },
  seguranca:{ nome: 'Segurança', desc: 'Polícia, crime, trânsito e segurança pública em Foz.',        patrocinador: 'Sistema Foz Seguro',         subcats: ['Polícia Federal', 'Polícia Militar', 'Trânsito', 'Bombeiros'] },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cfg = EDITORIAS[slug];
  if (!cfg) return {};
  return buildMetadata({ title: `${cfg.nome} — Foz em Foco`, description: cfg.desc, path: `/categoria/${slug}` });
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const cfg = EDITORIAS[slug];
  if (!cfg) notFound();

  const filtro = sub ?? 'Todos';

  type ArticleWithRel = {
    id: string; title: string; slug: string; lead: string | null; readTime: number; views: number;
    publishedAt: Date | null; imageUrl: string | null;
    category: { slug: string; name: string };
    author: { name: string | null };
  };

  let artigos: ArticleWithRel[] = [];
  try {
    const category = await prisma.category.findFirst({ where: { slug } });
    if (category) {
      const data = await prisma.article.findMany({
        where: { status: 'publicado', categoryId: category.id },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
        take: 13,
      });
      artigos = data as unknown as ArticleWithRel[];
    }
  } catch (e) { console.error('CATEGORIA_ERROR', e); }

  const hero      = artigos[0];
  const grid      = artigos.slice(1, 7);
  const especial  = artigos[7];
  const mais      = artigos.slice(8, 11);

  return (
    <div>
      {/* HEADER ESCURO */}
      <div style={{ background: '#111', padding: '32px 0 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 6 }}>EDITORIA</div>
              <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 'clamp(36px,6vw,64px)', color: 'white', lineHeight: 1, margin: 0 }}>{cfg.nome}</h1>
              <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8, fontSize: 15 }}>{cfg.desc}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>PATROCINADOR DA SEÇÃO</div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>{cfg.patrocinador}</div>
            </div>
          </div>
          {/* Tabs colados na base */}
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
            {['Todos', ...cfg.subcats].map(f => (
              <a key={f} href={f === 'Todos' ? `/categoria/${slug}` : `/categoria/${slug}?sub=${encodeURIComponent(f)}`} style={{
                flexShrink: 0, padding: '10px 18px', textDecoration: 'none',
                background: filtro === f ? 'white' : 'transparent',
                color: filtro === f ? '#111' : 'rgba(255,255,255,0.7)',
                borderRadius: filtro === f ? '8px 8px 0 0' : 0,
                fontSize: 14, fontWeight: filtro === f ? 600 : 400,
              }}>{f}</a>
            ))}
          </div>
        </div>
      </div>

      {/* LEADERBOARD */}
      <div style={{ background: '#f5f7fa', borderBottom: '1px solid #e2e8f0', padding: '8px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <RotatingAd slotId="leaderboard" height={258} />
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>

          {/* ── COLUNA ESQUERDA ── */}
          <div>

            {/* 1. HERO */}
            {hero && (
              <a href={`/${hero.category.slug}/${hero.slug}`} style={{ display: 'block', textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 28, cursor: 'pointer' }}>
                <div style={{
                  width: '100%', aspectRatio: '2 / 1', maxHeight: 440, background: '#dde2e8',
                  backgroundImage: 'linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)',
                  backgroundSize: '20px 20px',
                }} />
                <div style={{ padding: '24px 28px' }}>
                  <span style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, background: '#e6f4f2', color: '#0a7a6b', marginBottom: 10 }}>{hero.category.name}</span>
                  <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 'clamp(24px,3vw,40px)', lineHeight: 1.1, color: '#111', margin: '8px 0' }}>{hero.title}</h2>
                  {hero.lead && <p style={{ fontSize: 16, color: '#555', lineHeight: 1.6, marginBottom: 12 }}>{hero.lead}</p>}
                  <div style={{ fontSize: 13, color: '#888' }}>{hero.author.name} · {hero.readTime} min · {hero.views.toLocaleString('pt-BR')} views</div>
                </div>
              </a>
            )}

            {/* 2. GRID 3×2 */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Últimas em {cfg.nome}</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#0a7a6b', fontWeight: 600 }}>TODAS SUB-CATEGORIAS</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
                {grid.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            </div>

            {/* 3. BANNER IN-FEED */}
            <div style={{ marginBottom: 28 }}>
              <RotatingAd slotId="leaderboard" height={140} />
            </div>

            {/* 4. ESPECIAL */}
            {especial && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Especial · Reportagem Aprofundada</span>
                  <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                </div>
                <a href={`/${especial.category.slug}/${especial.slug}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ background: '#dde2e8', backgroundImage: 'linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)', backgroundSize: '20px 20px', minHeight: 280, position: 'relative' }}>
                    <span style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 10px', borderRadius: 20, fontSize: 10, fontFamily: 'monospace' }}>{especial.category.name} · especial</span>
                  </div>
                  <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#0a7a6b', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 10 }}>{especial.category.name.toUpperCase()} · ESPECIAL</span>
                    <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, lineHeight: 1.2, color: '#111', marginBottom: 10 }}>{especial.title}</h3>
                    <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Reportagem exclusiva · {especial.readTime} min de leitura · dados inéditos</p>
                    <span style={{ display: 'inline-block', background: '#0a7a6b', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Ler reportagem →</span>
                  </div>
                </a>
              </div>
            )}

            {/* 5. MAIS DE CIDADE — 3 cards */}
            {mais.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Mais de {cfg.nome}</span>
                  <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  {mais.map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
              </div>
            )}

          </div>

          {/* ── SIDEBAR DIREITA 320px ── */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Newsletter */}
            <div style={{ background: '#0a7a6b', borderRadius: 12, padding: 20, color: 'white' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, opacity: 0.8, letterSpacing: '0.1em', marginBottom: 6 }}>NEWSLETTER · TODA MANHÃ 7H</div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, marginBottom: 8, lineHeight: 1.2 }}>Foz em 5 minutos no seu e-mail</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 14 }}>14.847 inscritos · 58% de abertura · sem spam</div>
              <input type="email" placeholder="seu@email.com" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 8, background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 14, marginBottom: 8, outline: 'none', boxSizing: 'border-box' }} />
              <a href="/newsletter" style={{ display: 'block', width: '100%', padding: 11, background: 'white', color: '#0a7a6b', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>Inscrever grátis →</a>
            </div>

            {/* Mais lidas */}
            <MaisLidas />

            {/* Últimas */}
            <UltimasFeed />

            {/* Patrocinador */}
            <div style={{ background: '#111', color: 'white', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, opacity: 0.4, marginBottom: 6 }}>PATROCINADOR · {cfg.nome.toUpperCase()}</div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18 }}>{cfg.patrocinador}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
