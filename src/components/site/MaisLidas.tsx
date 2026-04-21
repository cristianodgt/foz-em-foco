import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export async function MaisLidas() {
  let artigos: Array<{ id: string; title: string; slug: string; views: number; category: { slug: string; name: string } }> = []
  try {
    const data = await prisma.article.findMany({
      where: { status: 'publicado' },
      include: { category: true },
      orderBy: { views: 'desc' },
      take: 5,
    })
    artigos = data as typeof artigos
  } catch (e) { console.error('MAISLIDAS_ERROR', e) }

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0a7a6b', marginBottom: 14 }}>Mais lidas</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {artigos.map((a, i) => (
          <Link key={a.id} href={`/${a.category.slug}/${a.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, lineHeight: 1, color: '#0a7a6b', flexShrink: 0, width: 28 }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 13, lineHeight: 1.3, color: '#111', marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{a.title}</div>
              <div style={{ fontSize: 10, color: '#aaa', fontFamily: 'monospace' }}>{a.views.toLocaleString('pt-BR')} views</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
