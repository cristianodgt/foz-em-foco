'use client'
import { useState } from 'react'

const subcats: Record<string, string[]> = {
  cidade:   ['Obras', 'Transporte', 'Saúde', 'Educação', 'Segurança', 'Meio Ambiente'],
  politica: ['Câmara Municipal', 'Prefeitura', 'Eleições', 'Transparência', 'Orçamento'],
  economia: ['Comércio', 'Empregos', 'Agronegócio', 'Turismo', 'Investimentos'],
  turismo:  ['Cataratas', 'Itaipu', '3 Fronteiras', 'Roteiros', 'Hospedagem'],
  paraguai: ['Compras', 'Câmbio', 'Ponte Amizade', 'CDE', 'Duty-Free'],
  cultura:  ['Música', 'Teatro', 'Patrimônio', 'Gastronomia', 'Festas'],
  esporte:  ['Futebol', 'Corridas', 'Trilhas', 'Natação', 'Outros'],
  itaipu:   ['Energia', 'Meio Ambiente', 'Turismo', 'Obras', 'Emprego'],
  seguranca:['Polícia Federal', 'Polícia Militar', 'Trânsito', 'Bombeiros', 'Outros'],
}

interface Props {
  slug: string
  label: string
  desc: string
}

export function CategoryHeader({ slug, label, desc }: Props) {
  const [activeFilter, setActiveFilter] = useState('Todos')
  const filters = ['Todos', ...(subcats[slug] ?? [])]

  return (
    <div style={{ background: '#111', padding: '32px 0 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 6 }}>EDITORIA</div>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 'clamp(36px,6vw,64px)', color: 'white', lineHeight: 1, margin: 0 }}>{label}</h1>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8, fontSize: 15 }}>{desc}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>PATROCINADOR DA SEÇÃO</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white' }}>Construtora 3 Fronteiras</div>
          </div>
        </div>
        {/* Sub-nav colado na base */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              flexShrink: 0,
              padding: '10px 18px',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeFilter === f ? 600 : 400,
              background: activeFilter === f ? 'white' : 'transparent',
              color: activeFilter === f ? '#111' : 'rgba(255,255,255,0.7)',
              borderRadius: activeFilter === f ? '8px 8px 0 0' : 0,
              transition: 'background 0.15s, color 0.15s',
            }}>{f}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
