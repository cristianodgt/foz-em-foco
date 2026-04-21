'use client'
import { useState } from 'react'
import { RotatingAd } from '@/components/site/RotatingAd'

const CATEGORIAS = [
  { nome:'Restaurantes', count:312 },
  { nome:'Hotéis',       count:87  },
  { nome:'Saúde',        count:198 },
  { nome:'Compras',      count:265 },
  { nome:'Educação',     count:143 },
  { nome:'Veículos',     count:91  },
  { nome:'Beleza',       count:184 },
  { nome:'Serviços',     count:220 },
  { nome:'Turismo',      count:118 },
  { nome:'Imóveis',      count:76  },
]

const TIER_COLOR: Record<string, string> = { OURO:'#d4a017', PRATA:'#888', '':'transparent' }

interface Business {
  tier: string
  name: string
  category: string
  rating: string
  reviews: number
  location: string
  features: string[]
  price: string
  open: boolean
}

function BusinessCard({ business }: { business: Business }) {
  const { tier, name, category, rating, reviews, location, features, price, open } = business
  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${tier==='OURO' ? '#d4a017' : tier==='PRATA' ? '#ccc' : '#e2e8f0'}`,
      borderTop: tier ? `3px solid ${TIER_COLOR[tier]}` : undefined,
      borderRadius: 12,
      padding: '16px 20px',
      marginBottom: 12,
      boxShadow: tier==='OURO' ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
        <div style={{
          width:100, flexShrink:0, borderRadius:8,
          aspectRatio:'1/1',
          background:'#dde2e8',
          backgroundImage:'linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)',
          backgroundSize:'12px 12px',
        }}/>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            {tier==='OURO' && <span style={{ background:'#d4a017', color:'white', padding:'2px 10px', borderRadius:999, fontSize:11, fontWeight:700, fontFamily:'monospace' }}>★ OURO</span>}
            {tier==='PRATA' && <span style={{ background:'#888', color:'white', padding:'2px 10px', borderRadius:999, fontSize:11, fontWeight:700, fontFamily:'monospace' }}>★ PRATA</span>}
            <span style={{ fontSize:18, fontWeight:600 }}>{name}</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:13, color:'#888' }}>{category}</span>
            <span style={{ fontSize:13, color:'#888' }}>· {location}</span>
            <span style={{ fontSize:13, color:'#888' }}>· {price}</span>
            <span style={{ marginLeft:'auto', fontSize:12, fontWeight:600, color: open ? '#27ae60' : '#c0392b' }}>
              {open ? '● Aberto' : '○ Fechado'}
            </span>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
            {features.map(f => (
              <span key={f} style={{ fontSize:11, padding:'3px 10px', border:'1px solid #e2e8f0', borderRadius:999, background:'white', color:'#555' }}>{f}</span>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:'#d4a017', fontSize:16 }}>★</span>
            <strong style={{ fontSize:16 }}>{rating}</strong>
            <span style={{ fontFamily:'monospace', fontSize:11, color:'#888' }}>{reviews.toLocaleString('pt-BR')} avaliações</span>
            <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              <button style={{ padding:'6px 14px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'white', fontSize:13, cursor:'pointer', fontWeight:500 }}>Ligar</button>
              <button style={{ padding:'6px 14px', border:'1.5px solid #e2e8f0', borderRadius:8, background:'white', fontSize:13, cursor:'pointer', fontWeight:500 }}>Rota</button>
              {tier==='OURO' && (
                <button style={{ padding:'6px 14px', border:'none', borderRadius:8, background:'#0a7a6b', color:'white', fontSize:13, cursor:'pointer', fontWeight:600 }}>Reservar</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GuiaPage() {
  const [activeCategory, setActiveCategory] = useState('Restaurantes')

  const businesses: Business[] = [
    { tier:'OURO',  name:'Rafain Churrascaria', category:'Restaurante', rating:'4.8', reviews:1243, location:'Vila Yolanda', features:['Reserva online','Estacionamento','AC'], price:'R$80–R$150/pessoa', open:true },
    { tier:'OURO',  name:'Tempero da Terra',    category:'Restaurante', rating:'4.7', reviews:892,  location:'Centro',       features:['Delivery','Aceita Pix'],               price:'R$40–R$80/pessoa',  open:true },
    { tier:'PRATA', name:'Trapiche',            category:'Bar e Rest.', rating:'4.6', reviews:634,  location:'Gramadão',     features:['Música ao vivo'],                     price:'R$30–R$60/pessoa',  open:true },
    { tier:'',      name:'Pizza dos Amigos',    category:'Pizzaria',   rating:'4.4', reviews:412,  location:'Vila A',       features:['Delivery'],                           price:'R$25–R$50',         open:false },
    { tier:'',      name:'Bar do Tião',         category:'Bar',        rating:'4.3', reviews:289,  location:'Centro',       features:['Chope artesanal'],                    price:'R$15–R$35',         open:true },
  ]

  return (
    <div>
      <div style={{ background:'#111', padding:'32px 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px' }}>
          <h1 style={{ fontFamily:'DM Serif Display, Georgia, serif', fontSize:'clamp(28px,4vw,44px)', color:'white', marginBottom:6 }}>Guia de Foz & Região</h1>
          <div style={{ fontFamily:'monospace', color:'rgba(255,255,255,0.5)', marginBottom:20, fontSize:12 }}>1.847 negócios · 12 mil avaliações verificadas · atualizado diariamente</div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <input placeholder="Buscar restaurante, hotel, médico, serviço..." style={{ flex:2, minWidth:200, padding:'10px 14px', border:'1.5px solid rgba(255,255,255,0.2)', borderRadius:8, background:'rgba(255,255,255,0.1)', color:'white', fontSize:15, outline:'none' }}/>
            <input placeholder="Bairro · qualquer" style={{ flex:1, minWidth:140, padding:'10px 14px', border:'1.5px solid rgba(255,255,255,0.2)', borderRadius:8, background:'rgba(255,255,255,0.1)', color:'white', fontSize:15, outline:'none' }}/>
            <button style={{ padding:'10px 20px', background:'#0a7a6b', color:'white', border:'none', borderRadius:8, fontWeight:600, fontSize:14, cursor:'pointer' }}>Buscar</button>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontFamily:'monospace', fontSize:11, color:'rgba(255,255,255,0.4)' }}>POPULARES:</span>
            {['Aberto agora','Com delivery','Pet friendly','Aceita Pix','Vista pro rio'].map(t => (
              <button key={t} style={{ padding:'3px 10px', border:'1px solid rgba(255,255,255,0.2)', borderRadius:999, background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.8)', fontSize:12, cursor:'pointer' }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px' }}>

        <div style={{ fontFamily:'monospace', fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#888', marginBottom:12 }}>Categorias</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginBottom:28 }}>
          {CATEGORIAS.map(({ nome, count }) => (
            <button key={nome} onClick={() => setActiveCategory(nome)} style={{
              padding:'12px 8px', border:`1px solid ${activeCategory===nome ? '#0a7a6b' : '#e2e8f0'}`,
              borderRadius:8, cursor:'pointer', textAlign:'left',
              background: activeCategory===nome ? '#f2faf9' : 'white',
              transition:'all 0.15s',
            }}>
              <div style={{ fontWeight:600, fontSize:14, color: activeCategory===nome ? '#0a7a6b' : '#111', marginBottom:2 }}>{nome}</div>
              <div style={{ fontFamily:'monospace', fontSize:11, color:'#888' }}>{count} negócios</div>
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'220px 1fr 340px', gap:24 }}>

          <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:20, alignSelf:'start' }}>
            <div style={{ fontWeight:600, fontSize:16, marginBottom:14 }}>Filtros</div>
            {([['Aberto agora',true],['Aceita reserva',false],['Delivery',false],['Pet friendly',false],['Acessível',false],['Aceita Pix',true]] as [string, boolean][]).map(([label, checked]) => (
              <label key={label} style={{ display:'flex', gap:10, alignItems:'center', padding:'7px 0', borderBottom:'1px solid #e2e8f0', cursor:'pointer', fontSize:14 }}>
                <div style={{ width:18, height:18, borderRadius:4, border:`1.5px solid ${checked ? '#0a7a6b' : '#e2e8f0'}`, background: checked ? '#0a7a6b' : 'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                </div>
                {label}
              </label>
            ))}
            <div style={{ fontFamily:'monospace', fontSize:11, color:'#888', marginTop:16, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Faixa de Preço</div>
            <div style={{ display:'flex', gap:6 }}>
              {['$','$$','$$$','$$$$'].map(p => (
                <button key={p} style={{ padding:'4px 8px', border:'1.5px solid #e2e8f0', borderRadius:6, background:'white', fontSize:13, cursor:'pointer' }}>{p}</button>
              ))}
            </div>
            <div style={{ fontFamily:'monospace', fontSize:11, color:'#888', marginTop:16, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Avaliação</div>
            {['4.5+','4+','Todos'].map(r => (
              <label key={r} style={{ display:'flex', gap:8, padding:'5px 0', fontSize:13, cursor:'pointer', alignItems:'center' }}>
                <input type="radio" name="rating" style={{ accentColor:'#0a7a6b' }}/> {r}
              </label>
            ))}
          </div>

          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontSize:14, color:'#888' }}><strong style={{ color:'#111' }}>312 resultados</strong> · {activeCategory} em Foz</div>
              <select style={{ padding:'6px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:13, background:'white' }}>
                <option>Relevância</option><option>Avaliação</option><option>Mais avaliados</option>
              </select>
            </div>
            {businesses.map(b => <BusinessCard key={b.name} business={b} />)}
            <RotatingAd slotId="leaderboard" height={100} />
          </div>

          <div style={{ alignSelf:'start', position:'sticky', top:80 }}>
            <div style={{
              borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden',
              aspectRatio:'3/4', background:'#dde2e8',
              backgroundImage:'linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)',
              backgroundSize:'20px 20px', minHeight:360, display:'flex', alignItems:'center', justifyContent:'center',
              color:'#888', fontFamily:'monospace', fontSize:11,
            }}>mapa interativo · pins por tier</div>
            <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:16, marginTop:16 }}>
              <div style={{ fontFamily:'monospace', fontSize:10, color:'#888', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.08em' }}>Anuncie no Guia</div>
              <div style={{ fontFamily:'DM Serif Display, serif', fontSize:18, marginBottom:6 }}>Destaque seu negócio</div>
              <div style={{ fontSize:13, color:'#888', marginBottom:12 }}>Plano Ouro a partir de R$ 299/mês · média de 340 visualizações/mês</div>
              <a href="/anuncie" style={{ display:'block', width:'100%', padding:'10px', background:'#0a7a6b', color:'white', border:'none', borderRadius:8, fontWeight:600, fontSize:14, cursor:'pointer', textAlign:'center', textDecoration:'none', boxSizing:'border-box' }}>Ver planos →</a>
            </div>
            <div style={{ marginTop:16 }}>
              <RotatingAd slotId="leaderboard" height={250} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
