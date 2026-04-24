"use client";

import { useState } from "react";
import MobileAgendaLayout from "@/components/mobile/MobileAgendaLayout";

const FILTERS = ["Tudo","Cultura","Gastronomia","Esporte","Negócios","Infantil","Paraguai","Grátis","Pago"];

const DESTAQUES = [
  {
    d: "24", m: "abr",
    t: "Show: Os Paralamas do Sucesso",
    loc: "Centro de Convenções · 21h",
    desc: "Turnê 2026 passa por Foz com repertório que celebra 40 anos de carreira. Abertura com banda local.",
    sponsored: true,
  },
  {
    d: "28", m: "abr",
    t: "Visita Noturna às Cataratas",
    loc: "Parque Nacional do Iguaçu · 19h30",
    desc: "Experiência única com iluminação especial das quedas. Inclui transporte interno e taça de espumante.",
    sponsored: false,
  },
];

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

  const tabStyle = (active: boolean) => ({
    padding: "10px 18px",
    border: "none",
    background: active ? "white" : "transparent",
    color: active ? "#111" : "rgba(255,255,255,0.7)",
    borderRadius: active ? "8px 8px 0 0" : 0,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  });

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <MobileAgendaLayout />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
      {/* Hero */}
      <div style={{ background: "#111", padding: "32px 0 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "clamp(28px,4vw,44px)", color: "white" }}>Agenda de Foz</h1>
              <div style={{ fontFamily: "monospace", color: "rgba(255,255,255,.45)", marginTop: 4, fontSize: 12 }}>347 eventos nos próximos 90 dias · abril–julho 2026</div>
            </div>
            <button style={{ padding: "10px 16px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Publicar evento</button>
          </div>

          {/* Filter tabs — white active tab glued to header bottom */}
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 20 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={tabStyle(activeFilter === f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>
          <div>
            {/* Destaques */}
            <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0a7a6b", marginBottom: 12 }}>Destaques</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {DESTAQUES.map(ev => (
                <div key={ev.t} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {/* Image 16/7 */}
                  <div style={{
                    position: "relative",
                    aspectRatio: "16 / 7",
                    background: "#dde2e8",
                    backgroundImage: "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)",
                    backgroundSize: "20px 20px",
                  }}>
                    {/* Date badge */}
                    <div style={{
                      position: "absolute", top: 12, left: 12,
                      background: "white", borderRadius: 8, padding: "6px 12px", textAlign: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)", minWidth: 52,
                    }}>
                      <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, lineHeight: 1, color: "#0a7a6b" }}>{ev.d}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: "#888", textTransform: "uppercase", marginTop: 2 }}>{ev.m}</div>
                    </div>
                    {ev.sponsored && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: "#d4a017", color: "white", padding: "3px 10px", borderRadius: 4,
                        fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                      }}>PATROCINADO</div>
                    )}
                  </div>
                  <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 18, lineHeight: 1.25, marginBottom: 6, color: "#111" }}>{ev.t}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: "#888", marginBottom: 10 }}>{ev.loc}</div>
                    <div style={{ fontSize: 13, color: "#444", lineHeight: 1.5, marginBottom: 16, flex: 1 }}>{ev.desc}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ flex: 1, padding: "8px 14px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Ingressos</button>
                      <button style={{ padding: "8px 14px", background: "white", color: "#111", border: "1.5px solid #e2e8f0", borderRadius: 8, fontWeight: 500, fontSize: 13, cursor: "pointer" }}>Adicionar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0a7a6b", marginBottom: 12 }}>Esta semana</div>
            {filtered.map(({ d, m, dw, t, cat, loc, price, highlight }) => (
              <div
                key={t}
                style={{
                  background: "white", border: "1.5px solid",
                  borderColor: highlight ? "#0a7a6b" : "#e2e8f0",
                  borderRadius: 12, padding: "14px 18px", marginBottom: 10,
                  display: "flex", gap: 16, alignItems: "center",
                  boxShadow: highlight ? "0 4px 12px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ flexShrink: 0, textAlign: "center", width: 52 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: highlight ? "#0a7a6b" : "#888", marginBottom: 2 }}>{dw}</div>
                  <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 32, lineHeight: 1, color: highlight ? "#0a7a6b" : "#111" }}>{d}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#888" }}>{m}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#e6f4f2", color: "#0a7a6b", textTransform: "uppercase" }}>{cat}</span>
                    {highlight && <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#fff4d6", color: "#8a6b00", textTransform: "uppercase" }}>Destaque</span>}
                  </div>
                  <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 16, fontWeight: 600, marginBottom: 2, lineHeight: 1.2 }}>{t}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#888" }}>{loc}</div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: price === "Grátis" ? "#27ae60" : "#111", marginBottom: 4 }}>
                    {price}
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#888" }}>entrada</div>
                </div>
                <button style={{ padding: "6px 12px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>ver →</button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ background: "#f5f7fa", borderRadius: 12, padding: 32, textAlign: "center" }}>
                <div style={{ fontFamily: "monospace", color: "#888", fontSize: 13 }}>Nenhum evento encontrado para este filtro</div>
              </div>
            )}

            <div style={{ background: "#f5f7fa", border: "1px dashed #cbd5e0", borderRadius: 10, height: 200, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
              <span style={{ fontFamily: "monospace", color: "#888", fontSize: 11 }}>PUBLICIDADE · 970×250</span>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 }}>
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: "DM Serif Display, serif", fontSize: 18 }}>Abril 2026</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ padding: "4px 8px", border: "none", background: "transparent", cursor: "pointer" }}>‹</button>
                  <button style={{ padding: "4px 8px", border: "none", background: "transparent", cursor: "pointer" }}>›</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, textAlign: "center" }}>
                {DAYS.map(d => (
                  <div key={d} style={{ fontFamily: "monospace", fontSize: 9, color: "#888", padding: "4px 0" }}>{d}</div>
                ))}
                {[0,1,2].map(i => <div key={`e${i}`} />)}
                {MONTH_DATES.map(n => (
                  <div
                    key={n}
                    style={{
                      padding: "4px", fontSize: 13,
                      borderRadius: "50%",
                      background: [21,24,28].includes(n) ? "#0a7a6b" : "transparent",
                      color: [21,24,28].includes(n) ? "white" : n === 23 ? "#0a7a6b" : "#111",
                      fontWeight: [21,24,28].includes(n) ? 700 : 400,
                      cursor: "pointer",
                    }}
                  >{n}</div>
                ))}
              </div>
            </div>

            <div style={{ background: "#e6f4f2", border: "1px solid #c5e8e2", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontFamily: "monospace", color: "#0a7a6b", fontSize: 11, marginBottom: 6, letterSpacing: "0.08em" }}>ANUNCIE SEU EVENTO</div>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, marginBottom: 6 }}>Destaque na Agenda</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>a partir de R$ 199 · 7 dias em destaque + topo da lista · média de 800 visualizações</div>
              <button style={{ width: "100%", padding: "10px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Publicar evento →</button>
            </div>

            <div style={{ background: "#f5f7fa", border: "1px dashed #cbd5e0", borderRadius: 10, height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "monospace", color: "#888", fontSize: 11 }}>PUBLICIDADE · 300×250</span>
            </div>
          </aside>
        </div>
      </div>
      </div>
    </>
  );
}
