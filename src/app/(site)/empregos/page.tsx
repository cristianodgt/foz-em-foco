"use client";

import { useState } from "react";

const VAGAS = [
  { tier:"URGENTE",  title:"Atendente de Recepção",        empresa:"Hotel Bourbon Cataratas",      regime:"CLT · R$ 2.500–3.000",   local:"Vila Yolanda",    tempo:"2 dias" },
  { tier:"NOVA",     title:"Motorista Executivo",           empresa:"Transportadora 3 Fronteiras",  regime:"PJ · R$ 4.000",          local:"Centro",          tempo:"3 dias" },
  { tier:"DESTAQUE", title:"Gerente de Operações",          empresa:"Grupo Belmond",                regime:"CLT · R$ 8.000–12.000",  local:"Foz do Iguaçu",   tempo:"1d" },
  { tier:"NOVA",     title:"Recepcionista Bilíngue",        empresa:"Hotel Wyndham Grand",          regime:"CLT · R$ 2.200",         local:"Av. Cataratas",   tempo:"1d" },
  { tier:"",         title:"Analista Contábil",             empresa:"Contabilidade Iguaçu",         regime:"CLT · R$ 3.500",         local:"Centro",          tempo:"3d" },
  { tier:"",         title:"Professor de Espanhol",         empresa:"Escola Trinacional",           regime:"CLT / Horista",          local:"Foz do Iguaçu",   tempo:"4d" },
  { tier:"",         title:"Auxiliar de Cozinha",           empresa:"Restaurante Rafain",           regime:"CLT · R$ 1.800",         local:"Vila Yolanda",    tempo:"4d" },
  { tier:"",         title:"Desenvolvedor front-end",       empresa:"Startup Tech 3 Fronteiras",    regime:"Remoto · R$ 6.000",      local:"Foz / Remoto",    tempo:"4d" },
];

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  URGENTE:  { bg: "#fdecea", color: "var(--danger)" },
  NOVA:     { bg: "#e8f8f0", color: "var(--success)" },
  DESTAQUE: { bg: "#fff8e6", color: "var(--warning)" },
};

const REGIMES = ["Todos","CLT","PJ","Estágio","Freelance","Remoto"];
const AREAS   = ["Todas","Turismo & Hotel","Tecnologia","Saúde","Educação","Comércio","Serviços"];

export default function EmpregosPage() {
  const [activeRegime, setActiveRegime] = useState("Todos");
  const [activeArea, setActiveArea]     = useState("Todas");
  const [search, setSearch]             = useState("");

  const filtered = VAGAS.filter(v => {
    if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && !v.empresa.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeRegime !== "Todos" && !v.regime.includes(activeRegime)) return false;
    return true;
  });

  return (
    <>
      {/* Hero */}
      <div style={{ background: "var(--ink)", padding: "32px 0" }}>
        <div className="container">
          <div className="row between" style={{ flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,44px)", color: "white" }}>Empregos em Foz</h1>
              <div className="t-mono" style={{ color: "rgba(255,255,255,.5)", marginTop: 4 }}>432 vagas · 89 novas esta semana · atualizado toda segunda</div>
            </div>
            <button className="btn btn-primary">+ Publicar vaga · R$ 149</button>
          </div>

          {/* Search */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              className="input"
              placeholder="Cargo, empresa ou palavra-chave…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 260, maxWidth: 440 }}
            />
            <input className="input" placeholder="Cidade ou bairro" style={{ maxWidth: 200 }} />
            <button className="btn btn-primary">Buscar vagas</button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "28px 20px" }}>
        {/* Regime filters */}
        <div className="row" style={{ gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {REGIMES.map(r => (
            <button
              key={r}
              onClick={() => setActiveRegime(r)}
              className={activeRegime === r ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
            >{r}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AREAS.map(a => (
              <button
                key={a}
                onClick={() => setActiveArea(a)}
                className="pill"
                style={{ cursor: "pointer", background: activeArea === a ? "var(--teal-light)" : undefined, color: activeArea === a ? "var(--teal)" : undefined, borderColor: activeArea === a ? "var(--teal)" : undefined }}
              >{a}</button>
            ))}
          </div>
        </div>

        <div className="grid-main-side">
          <div>
            <div className="sec-label bold" style={{ marginBottom: 12 }}>{filtered.length} vaga{filtered.length !== 1 ? "s" : ""} encontradas</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((v, i) => {
                const tc = TIER_COLORS[v.tier] ?? null;
                return (
                  <div
                    key={i}
                    style={{
                      background: "white", borderRadius: "var(--r-l)", padding: "16px 20px",
                      border: "1.5px solid", borderColor: tc ? tc.color.replace("var(","").replace(")","") === "--danger" ? "#f5c6c2" : tc.color === "var(--success)" ? "#a3dfc0" : "#f0d48c" : "var(--border)",
                      display: "flex", gap: 16, alignItems: "center",
                      boxShadow: "var(--shadow-s)", cursor: "pointer",
                    }}
                  >
                    <div className="imgph" data-label="logo" style={{ width: 56, height: 56, flexShrink: 0, borderRadius: "var(--r-m)" }} />
                    <div style={{ flex: 1 }}>
                      <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                        {tc && (
                          <span className="t-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", ...tc, padding: "2px 7px", borderRadius: 3 }}>
                            {v.tier}
                          </span>
                        )}
                        <span style={{ fontWeight: 700, fontSize: 16 }}>{v.title}</span>
                      </div>
                      <div style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 4 }}>{v.empresa}</div>
                      <div className="row" style={{ gap: 10 }}>
                        <span className="pill">{v.regime}</span>
                        <span className="t-mono color-muted" style={{ fontSize: 11 }}>📍 {v.local}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div className="t-mono color-muted" style={{ fontSize: 11, marginBottom: 8 }}>há {v.tempo}</div>
                      <button className="btn btn-outline btn-sm">Candidatar →</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div style={{ background: "var(--paper-2)", borderRadius: "var(--r-l)", padding: 48, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 8 }}>Nenhuma vaga encontrada</div>
                <div className="t-small color-muted">Tente outros filtros ou palavras-chave</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar-sticky">
            <div style={{ background: "var(--teal)", color: "white", borderRadius: "var(--r-l)", padding: 20 }}>
              <div className="t-mono" style={{ fontSize: 10, opacity: .65, marginBottom: 8 }}>PARA EMPRESAS</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, marginBottom: 6 }}>Publique sua vaga</div>
              <div style={{ fontSize: 13, opacity: .85, marginBottom: 14 }}>A partir de R$ 149 · média de 1.400 candidatos · 7 dias em destaque</div>
              <button style={{ background: "white", color: "var(--teal)", border: "none", borderRadius: "var(--r-m)", padding: "10px 20px", fontWeight: 700, fontSize: 13, width: "100%", cursor: "pointer" }}>
                Publicar vaga →
              </button>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: 20 }}>
              <div className="t-h4" style={{ marginBottom: 12 }}>Mais buscadas</div>
              {["Recepcionista","Motorista","Garçom","Cozinheiro","Analista TI","Professor","Vendedor"].map((k, i) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 6 ? "1px solid var(--border)" : "none", fontSize: 13 }}>
                  <span>{k}</span>
                  <span className="t-mono color-muted" style={{ fontSize: 11 }}>{[24,18,15,12,10,9,7][i]} vagas</span>
                </div>
              ))}
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
