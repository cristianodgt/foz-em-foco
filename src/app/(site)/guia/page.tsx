"use client";

import { useState } from "react";
import Link from "next/link";

const CATS = [
  ["Restaurantes",312],["Hotéis",87],["Saúde",198],["Compras",265],["Educação",143],
  ["Veículos",91],["Beleza",184],["Serviços",220],["Turismo",118],["Imóveis",76],
] as [string, number][];

const BUSINESSES = [
  { tier:"OURO",  name:"Rafain Churrascaria",    cat:"Restaurante", rating:"4.8", reviews:1243, loc:"Vila Yolanda", feat:["Reserva online","Estacionamento","AC"], price:"R$80–R$150/pessoa", open:true },
  { tier:"OURO",  name:"Tempero da Terra",        cat:"Restaurante", rating:"4.7", reviews:892,  loc:"Centro",       feat:["Petiscos","Cardápio executivo"],         price:"R$35–R$65/pessoa", open:true },
  { tier:"PRATA", name:"Churrascaria Gaúcha",     cat:"Churrascaria",rating:"4.5", reviews:623,  loc:"Morumbi",      feat:["Rodízio","Estacionamento"],              price:"R$55–R$80/pessoa", open:true },
  { tier:"PRATA", name:"Restaurante Recanto",     cat:"Restaurante", rating:"4.4", reviews:412,  loc:"Vila A",       feat:["Delivery"],                             price:"R$25–R$50",        open:false },
  { tier:"",      name:"Bar do Tião",             cat:"Bar",         rating:"4.3", reviews:289,  loc:"Centro",       feat:["Chope artesanal"],                      price:"R$15–R$35",        open:true },
  { tier:"",      name:"Lanchonete Boa Hora",     cat:"Lanchonete",  rating:"4.1", reviews:154,  loc:"Porto Meira",  feat:["Delivery"],                             price:"R$10–R$20",        open:true },
];

const TIER_COLOR: Record<string, string> = { OURO:"#d4a017", PRATA:"#888" };

export default function GuiaPage() {
  const [activeCategory, setActiveCategory] = useState("Restaurantes");
  const [search, setSearch] = useState("");

  return (
    <>
      {/* Hero */}
      <div style={{ background: "var(--ink)", padding: "32px 0" }}>
        <div className="container">
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,44px)", color: "white", marginBottom: 6 }}>Guia de Foz &amp; Região</h1>
          <div className="t-mono" style={{ color: "rgba(255,255,255,.5)", marginBottom: 20, fontSize: 12 }}>1.847 negócios · 12 mil avaliações verificadas · atualizado diariamente</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="Buscar negócio, bairro ou categoria…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 280, maxWidth: 480 }}
            />
            <button className="btn btn-primary">Buscar</button>
            <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.1)", color: "white", border: "1px solid rgba(255,255,255,.15)" }}>Próximo a mim</button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 20px" }}>
        {/* Category grid */}
        <div className="sec-label bold mb-m">Categorias</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 24 }}>
          {CATS.map(([n, c]) => (
            <button
              key={n}
              onClick={() => setActiveCategory(n)}
              style={{
                padding: "10px 8px", borderRadius: "var(--r-m)", border: "1.5px solid",
                borderColor: activeCategory === n ? "var(--teal)" : "var(--border)",
                background: activeCategory === n ? "var(--teal-pale)" : "white",
                cursor: "pointer", textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, color: activeCategory === n ? "var(--teal)" : "var(--ink)" }}>{n}</div>
              <div className="t-mono color-muted" style={{ fontSize: 10, marginTop: 2 }}>{c} negócios</div>
            </button>
          ))}
        </div>

        <div className="grid-main-side">
          {/* Business list */}
          <div>
            <div className="sec-label bold" style={{ marginBottom: 12 }}>{activeCategory} em Foz</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BUSINESSES.map((b) => (
                <div key={b.name} style={{
                  background: "white", border: "1.5px solid",
                  borderColor: b.tier === "OURO" ? "#e8c060" : "var(--border)",
                  borderRadius: "var(--r-l)", padding: "16px 20px",
                  display: "flex", gap: 16, alignItems: "flex-start",
                  boxShadow: "var(--shadow-s)",
                }}>
                  {/* Thumbnail placeholder */}
                  <div className="imgph" data-label="foto" style={{ width: 80, height: 80, flexShrink: 0, borderRadius: "var(--r-m)" }} />

                  <div style={{ flex: 1 }}>
                    <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                      {b.tier && (
                        <span className="t-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: TIER_COLOR[b.tier], background: b.tier === "OURO" ? "#fef9ec" : "#f5f5f5", padding: "2px 7px", borderRadius: 3 }}>
                          {b.tier}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</span>
                      <span className="t-mono color-muted" style={{ fontSize: 11 }}>{b.cat}</span>
                    </div>
                    <div className="row" style={{ gap: 12, marginBottom: 8 }}>
                      <span style={{ color: "#f59e0b", fontSize: 14 }}>{"★".repeat(Math.round(parseFloat(b.rating)))}{"☆".repeat(5 - Math.round(parseFloat(b.rating)))}</span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{b.rating}</span>
                      <span className="t-mono color-muted" style={{ fontSize: 11 }}>({b.reviews.toLocaleString()} avaliações)</span>
                      <span className="t-mono color-muted" style={{ fontSize: 11 }}>📍 {b.loc}</span>
                    </div>
                    <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                      {b.feat.map(f => <span key={f} className="pill">{f}</span>)}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: b.open ? "var(--success)" : "var(--danger)", fontWeight: 600, marginBottom: 4, fontFamily: "var(--font-mono)" }}>
                      {b.open ? "● Aberto" : "○ Fechado"}
                    </div>
                    <div className="t-mono color-muted" style={{ fontSize: 11, marginBottom: 10 }}>{b.price}</div>
                    <button className="btn btn-outline btn-sm">Ver perfil</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 24 }}>
              <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 970×250</span>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar-sticky">
            <div style={{ background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", borderRadius: "var(--r-m)", height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="t-mono" style={{ color: "var(--ad)", fontSize: 11 }}>PUBLICIDADE · 300×250</span>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: 20, boxShadow: "var(--shadow-s)" }}>
              <div className="t-h4" style={{ marginBottom: 12 }}>Mais avaliados</div>
              {["Rafain Churrascaria","Hotel Bourbon Cataratas","Parque das Aves","Belmond Das Cataratas","Sky Grill"].map((n, i) => (
                <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--teal)", width: 28, textAlign: "center" }}>{i + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{n}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--teal)", color: "white", borderRadius: "var(--r-l)", padding: 20 }}>
              <div className="t-mono" style={{ fontSize: 10, opacity: .6, marginBottom: 8, letterSpacing: "0.1em" }}>ANUNCIE NO GUIA</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, marginBottom: 6 }}>Destaque seu negócio</div>
              <div style={{ fontSize: 13, opacity: .85, marginBottom: 14 }}>A partir de R$ 149/mês · média de 1.2k visitas</div>
              <Link href="/anuncie">
                <button style={{ background: "white", color: "var(--teal)", border: "none", borderRadius: "var(--r-m)", padding: "10px 20px", fontWeight: 700, fontSize: 13, width: "100%", cursor: "pointer" }}>
                  Cadastrar meu negócio →
                </button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
