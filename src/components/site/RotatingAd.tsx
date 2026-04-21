'use client'
import { useState, useEffect } from 'react'

const AD_INVENTORY: Record<string, { color: string; tag: string; label: string }[]> = {
  leaderboard: [
    { color: '#0a7a6b', tag: 'FINANCEIRO',  label: 'Sicredi Foz · soluções financeiras para sua empresa' },
    { color: '#b84c00', tag: 'GASTRONOMIA', label: 'Rafain · o melhor churrasco da tríplice fronteira' },
    { color: '#1a6b3a', tag: 'TURISMO',     label: 'Parque das Aves · mais de 1.500 espécies · visite!' },
    { color: '#1e4d8c', tag: 'HOTELARIA',   label: 'Hotel Bourbon · conforto e sofisticação em Foz' },
  ],
  sticky: [
    { color: '#7a5500', tag: 'CONSTRUÇÃO',  label: 'Construtora 3 Fronteiras · qualidade e prazo garantidos' },
    { color: '#1a5276', tag: 'TURISMO',     label: 'Cataratas Tour · traslados e passeios exclusivos' },
    { color: '#6d3480', tag: 'COMPRAS',     label: 'Shopping JL · mais de 200 lojas no coração de Foz' },
  ],
}

interface RotatingAdProps {
  slotId?: 'leaderboard' | 'sticky'
  height?: number
}

export function RotatingAd({ slotId = 'leaderboard', height = 258 }: RotatingAdProps) {
  const creatives = AD_INVENTORY[slotId] ?? AD_INVENTORY.leaderboard
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => { setIdx(i => (i + 1) % creatives.length); setFading(false) }, 300)
    }, 5000)
    return () => clearInterval(interval)
  }, [creatives.length])

  const c = creatives[idx] ?? creatives[0]

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={{
        width: '100%',
        height,
        borderRadius: '8px',
        backgroundColor: c.color,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 14,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        {/* padrão sutil */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)',
          backgroundSize: '8px 8px',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
          background: 'rgba(255,255,255,0.2)', color: 'white',
          padding: '2px 8px', borderRadius: 3, flexShrink: 0, position: 'relative',
        }}>{c.tag}</span>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
          color: 'white', flex: 1, position: 'relative',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}>{c.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, position: 'relative' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)' }}>
            {idx + 1}/{creatives.length}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {creatives.map((_, i) => (
              <div key={i} onClick={() => setIdx(i)} style={{
                width: 6, height: 6, borderRadius: '50%', cursor: 'pointer',
                background: i === idx ? 'white' : 'rgba(255,255,255,0.35)',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
            publicidade
          </span>
        </div>
      </div>
    </div>
  )
}
