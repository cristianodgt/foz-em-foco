import Link from 'next/link'
import { prisma } from '@/lib/prisma'

function timeAgo(d: Date | null) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'agora'
  if (h < 24) return `há ${h}h`
  return `há ${Math.floor(h / 24)}d`
}

export async function UltimasFeed() {
  let artigos: Array<{ id: string; title: string; slug: string; publishedAt: Date | null; category: { slug: string; name: string } }> = []
  try {
    const data = await prisma.article.findMany({
      where: { status: 'publicado' },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 7,
    })
    artigos = data as typeof artigos
  } catch (e) { console.error('ULTIMAS_ERROR', e) }

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0a7a6b', marginBottom: 14 }}>Últimas</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {artigos.map(a => (
          <Link key={a.id} href={`/${a.category.slug}/${a.slug}`} style={{ textDecoration: 'none', display: 'block', paddingBottom: 12, borderBottom: '1px solid #f0f2f5' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#0a7a6b', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4, textTransform: 'uppercase' }}>{a.category.name} · {timeAgo(a.publishedAt)}</div>
            <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 13, lineHeight: 1.3, color: '#111', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{a.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
