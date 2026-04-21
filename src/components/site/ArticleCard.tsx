import Link from 'next/link'
import Image from 'next/image'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    slug: string
    readTime: number
    imageUrl?: string | null
    category: { slug: string; name: string }
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/${article.category.slug}/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
        {article.imageUrl ? (
          <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
            <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{
            aspectRatio: '4 / 3', background: '#eef0f4',
            backgroundImage: 'linear-gradient(135deg,#eef0f4 25%,#e2e5eb 25%,#e2e5eb 50%,#eef0f4 50%,#eef0f4 75%,#e2e5eb 75%)',
            backgroundSize: '16px 16px',
          }} />
        )}
        <div style={{ padding: '12px 14px' }}>
          <span style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 3, background: '#e6f4f2', color: '#0a7a6b', marginBottom: 8 }}>{article.category.name}</span>
          <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 14, lineHeight: 1.35, color: '#111', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{article.title}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>{article.readTime} min</div>
        </div>
      </div>
    </Link>
  )
}
