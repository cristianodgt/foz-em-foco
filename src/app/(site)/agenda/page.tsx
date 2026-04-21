"use client";

import { useState } from "react";
import Link from "next/link";

const FILTERS = ["Tudo","Cultura","Gastronomia","Esporte","Negócios","Infantil","Paraguai","Grátis","Pago"];

const EVENTS = [
  { d:"21", m:"abr", dw:"Ter", t:"Feira Gastronômica da Vila A",         cat:"Gastronomia", loc:"Gramadão · 18h–23h",             price:"Grátis",  highlight:false },
  { d:"23", m:"abr", dw:"Qui", t:"Sarau Literário Foz em Verso",          cat:"Cultura",     loc:"Biblioteca Pública · 19h",        price:"Grátis",  highlight:false },
  { d:"24", m:"abr", dw:"Sex", t:"Show: Os Paralamas do Sucesso",          cat:"Cultura",     loc:"Centro de Convenções · 21h",      price:"R$ 80",   highlight:true  },
  { d:"25", m:"abr", dw:"Sáb", t:"Corrida Noturna 5k & 10k",              cat:"Esporte",     loc:"Orla da Beira Rio · 20h",         price:"R$ 40",   highlight:false },
  { d:"26", m:"abr", dw:"Dom", t:"Feira de Artesanato e Cultura",          cat:"Cultura",     loc:"Praça da Paz · 9h–17h",           price:"Grátis",  highlight:false },
  { d:"27", m:"abr", dw:"Seg", t:"Meetup Empreendedores Tri-Fronteira",    cat:"Negócios",    loc:"Coworking Centro · 19h",          price:"Grátis",  highlight:false },
  { d:"28", m:"abr", dw:"Ter", t:"Visita Noturna às Cataratas",            cat:"Turismo",     loc:"Parque Nacional · 19h30",         price:"R$ 90",   highlight:true  },
];

const DAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const MONTH_DATES = Array.from({ length: 30 }, (_, i) => i + 1);

export default function AgendaPage() {
  const [activeFilter, setActiveFilter] = useState("Tudo");

  const filtered = EVENTS.filter(e =>
    activeFilter === "Tudo" ||
    e.cat === activeFilter ||
    (activeFilter === "Grátis" && e.price === "Grátis") ||
    (activeFilter === "Pago"   && e.price !== "Grátis")
  );

  return (
    <>
      {/* Hero */}
      <div style={{ background: "var(--ink)", padding: "32px 0 0" }}>
        <div className="container">
          <div className="row between" style={{ marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,44px)", color: "white" }}>Agenda de Foz</h1>
              <div className="t-mono" style={{ color: "rgba(255,255,255,.45)", marginTop: 4 }}>347 eventos nos próximos 90 dias · abril–julho 2026</div>
            </div>
            <button className="btn btn-primary">+ Publicar evento · R$ 199</button>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 16 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="btn btn-sm"
                style={{
                  background: activeFilter === f ? "var(--teal)" : "rgba(255,255,255,.1)",
                  color: activeFilter === f ? "white" : "rgba(255,255,255,.7)",
                  border: "none",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 20px" }}>
        <div className="grid-main-side">
          <div>
            <div className="sec-label bold" style={{ marginBottom: 12 }}>Esta semana</div>
            {filtered.map(({ d, m, dw, t, cat, loc, price, highlight }) => (
              <div
                key={t}
                style={{
                  background: "white", border: "1.5px solid",
                  borderColor: highlight ? "var(--teal)" : "var(--border)",
                  borderRadius: "var(--r-l)", padding: "14px 18px", marginBottom: 10,
                  display: "flex", gap: 16, alignItems: "center",
                  boxShadow: highlight ? "var(--shadow-m)" : "var(--shadow-s)",
                }}
              >
                {/* Date badge */}
                <div style={{ flexShrink: 0, textAlign: "center", width: 52 }}>
                  <div className="t-mono" style={{ fontSize: 10, color: highlight ? "var(--teal)" : "var(--muted)", marginBottom: 2 }}>{dw}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, lineHeight: 1, color: highlight ? "var(--teal)" : "var(--ink)" }}>{d}</div>
                  <div className="t-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{m}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                    <span className={`cat-tag ${cat.toLowerCase()}`}>{cat}</span>
                    {highlight && <span className="cat-tag" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>Destaque</span>}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 600, marginBottom: 2, lineHeight: 1.2 }}>{t}</div>
                  <div className="t-mono color-muted" style={{ fontSize: 11 }}>{loc}</div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: price === "Grátis" ? "var(--success)" : "var(--ink)", marginBottom: 4 }}>
                    {price}
                  </div>
                  <div className="t-mono color-muted" style={{ fontSize: 10 }}>entrada</div>
                </div>
                <button className="btn btn-outline btn-sm">ver →</button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ background: "var(--paper-2)", borderRadius: "var(--r-l)", padding: 32, textAlign: "center" }}>
                <div className="t-mono color-muted" style={{ fontSize: 13 }}>Nenhum evento encontrado para este filtro</div>
              </div>
            )}

            <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
              <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 970×250</span>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar-sticky">
            {/* Mini calendar */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: "16px 20px" }}>
              <div className="row between" style={{ marginBottom: 12 }}>
                <span className="t-h4">Abril 2026</span>
                <div className="row" style={{ gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px" }}>‹</button>
                  <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px" }}>›</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, textAlign: "center" }}>
                {DAYS.map(d => (
                  <div key={d} className="t-mono" style={{ fontSize: 9, color: "var(--muted)", padding: "4px 0" }}>{d}</div>
                ))}
                {/* offset for April starting on Wednesday */}
                {[0,1,2].map(i => <div key={`e${i}`} />)}
                {MONTH_DATES.map(n => (
                  <div
                    key={n}
                    style={{
                      padding: "4px", fontSize: 13,
                      borderRadius: "50%",
                      background: [21,24,28].includes(n) ? "var(--teal)" : "transparent",
                      color: [21,24,28].includes(n) ? "white" : n === 23 ? "var(--teal)" : "var(--ink)",
                      fontWeight: [21,24,28].includes(n) ? 700 : 400,
                      cursor: "pointer",
                    }}
                  >{n}</div>
                ))}
              </div>
            </div>

            {/* Publish CTA */}
            <div style={{ background: "var(--teal-pale)", border: "1px solid var(--teal-light)", borderRadius: "var(--r-l)", padding: "16px 20px" }}>
              <div className="t-mono" style={{ color: "var(--teal)", fontSize: 11, marginBottom: 6 }}>ANUNCIE SEU EVENTO</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, marginBottom: 6 }}>Destaque na Agenda</div>
              <div className="t-small color-muted" style={{ marginBottom: 12 }}>a partir de R$ 199 · 7 dias em destaque + topo da lista · média de 800 visualizações</div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Publicar evento →</button>
            </div>

            <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 300×250</span>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
