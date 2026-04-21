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

const TIER_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  URGENTE:  { bg: "#fdecea", color: "#c0392b", border: "#f5c6c2" },
  NOVA:     { bg: "#e8f8f0", color: "#27ae60", border: "#a3dfc0" },
  DESTAQUE: { bg: "#fff8e6", color: "#d4a017", border: "#f0d48c" },
};

const REGIMES = ["Todos","CLT","PJ","Estágio","Freelance","Remoto"];

const CATEGORIAS = [
  { nome:"Hotelaria",    count: 87 },
  { nome:"Comércio",     count: 64 },
  { nome:"Gastronomia",  count: 58 },
  { nome:"Saúde",        count: 42 },
  { nome:"Tecnologia",   count: 36 },
  { nome:"Educação",     count: 31 },
  { nome:"Serviços",     count: 73 },
  { nome:"Construção",   count: 41 },
];

const MEDIAS = [
  { cargo:"Recepcionista",      valor:"R$ 2.100" },
  { cargo:"Motorista",          valor:"R$ 2.800" },
  { cargo:"Garçom / Garçonete", valor:"R$ 1.900" },
  { cargo:"Cozinheiro",         valor:"R$ 2.600" },
  { cargo:"Analista TI",        valor:"R$ 4.500" },
  { cargo:"Professor",          valor:"R$ 3.200" },
];

export default function EmpregosPage() {
  const [activeRegime, setActiveRegime] = useState("Todos");
  const [activeCategoria, setActiveCategoria] = useState<string | null>(null);
  const [search, setSearch]             = useState("");

  const filtered = VAGAS.filter(v => {
    if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && !v.empresa.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeRegime !== "Todos" && !v.regime.includes(activeRegime)) return false;
    return true;
  });

  return (
    <>
      {/* Hero preto — estilo Guia */}
      <div style={{ background: "#111", padding: "32px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "clamp(28px,4vw,44px)", color: "white", marginBottom: 6 }}>Empregos em Foz</h1>
              <div style={{ fontFamily: "monospace", color: "rgba(255,255,255,.5)", fontSize: 12 }}>432 vagas · 89 novas esta semana</div>
            </div>
            <button style={{ padding: "10px 16px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>+ Publicar vaga · R$ 149</button>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              placeholder="Cargo, empresa ou palavra-chave…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 2, minWidth: 200, padding: "10px 14px", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "white", fontSize: 15, outline: "none" }}
            />
            <input
              placeholder="Cidade ou bairro"
              style={{ flex: 1, minWidth: 140, padding: "10px 14px", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "white", fontSize: 15, outline: "none" }}
            />
            <button style={{ padding: "10px 20px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Buscar</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>
        {/* Categorias — grid 4 colunas ANTES da lista */}
        <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: 12 }}>Categorias</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 24 }}>
          {CATEGORIAS.map(({ nome, count }) => (
            <button
              key={nome}
              onClick={() => setActiveCategoria(activeCategoria === nome ? null : nome)}
              style={{
                padding: "12px 14px",
                border: `1px solid ${activeCategoria === nome ? "#0a7a6b" : "#e2e8f0"}`,
                borderRadius: 8, cursor: "pointer", textAlign: "left",
                background: activeCategoria === nome ? "#f2faf9" : "white",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, color: activeCategoria === nome ? "#0a7a6b" : "#111", marginBottom: 2 }}>{nome}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#888" }}>{count} vagas</div>
            </button>
          ))}
        </div>

        {/* Filtros de tipo — 1 linha, outline simples */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {REGIMES.map(r => (
            <button
              key={r}
              onClick={() => setActiveRegime(r)}
              style={{
                padding: "8px 16px",
                border: `1.5px solid ${activeRegime === r ? "#0a7a6b" : "#e2e8f0"}`,
                borderRadius: 8,
                background: activeRegime === r ? "#f2faf9" : "white",
                color: activeRegime === r ? "#0a7a6b" : "#444",
                fontSize: 13,
                fontWeight: activeRegime === r ? 600 : 500,
                cursor: "pointer",
              }}
            >{r}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0a7a6b", marginBottom: 12 }}>
              {filtered.length} vaga{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((v, i) => {
                const tc = TIER_COLORS[v.tier] ?? null;
                return (
                  <div
                    key={i}
                    style={{
                      background: "white", borderRadius: 12, padding: "16px 20px",
                      border: `1.5px solid ${tc ? tc.border : "#e2e8f0"}`,
                      display: "flex", gap: 16, alignItems: "center",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer",
                    }}
                  >
                    <div style={{
                      width: 56, height: 56, flexShrink: 0, borderRadius: 10,
                      background: "#dde2e8",
                      backgroundImage: "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)",
                      backgroundSize: "10px 10px",
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        {tc && (
                          <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", background: tc.bg, color: tc.color, padding: "2px 7px", borderRadius: 3 }}>
                            {v.tier}
                          </span>
                        )}
                        <span style={{ fontWeight: 700, fontSize: 16 }}>{v.title}</span>
                      </div>
                      <div style={{ fontSize: 14, color: "#444", marginBottom: 6 }}>{v.empresa}</div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, padding: "3px 10px", border: "1px solid #e2e8f0", borderRadius: 999, color: "#555" }}>{v.regime}</span>
                        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888" }}>{v.local}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: "#888", marginBottom: 8 }}>há {v.tempo}</div>
                      <button style={{ padding: "6px 12px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Candidatar →</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div style={{ background: "#f5f7fa", borderRadius: 12, padding: 48, textAlign: "center" }}>
                <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 22, marginBottom: 8 }}>Nenhuma vaga encontrada</div>
                <div style={{ fontSize: 13, color: "#888" }}>Tente outros filtros ou palavras-chave</div>
              </div>
            )}
          </div>

          {/* Sidebar 320px */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 }}>
            {/* Para Empresas — teal */}
            <div style={{ background: "#0a7a6b", color: "white", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, opacity: .7, marginBottom: 8, letterSpacing: "0.08em" }}>PARA EMPRESAS</div>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, marginBottom: 6 }}>Publique sua vaga</div>
              <div style={{ fontSize: 13, opacity: .9, marginBottom: 14, lineHeight: 1.4 }}>A partir de R$ 149 · média de 1.400 candidatos · 7 dias em destaque</div>
              <button style={{ background: "white", color: "#0a7a6b", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 13, width: "100%", cursor: "pointer" }}>
                Publicar vaga →
              </button>
            </div>

            {/* Crie seu perfil */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Candidatos</div>
              <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 20, marginBottom: 6 }}>Crie seu perfil</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 14, lineHeight: 1.4 }}>Receba vagas por e-mail e candidate-se com 1 clique.</div>
              <button style={{ width: "100%", padding: "10px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Começar grátis →
              </button>
            </div>

            {/* MPU 300x250 */}
            <div style={{ background: "#f5f7fa", border: "1px dashed #cbd5e0", borderRadius: 10, height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "monospace", color: "#888", fontSize: 11 }}>PUBLICIDADE · 300×250</span>
            </div>

            {/* Médias Salariais */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a7a6b", marginBottom: 12 }}>Médias Salariais</div>
              {MEDIAS.map((m, i) => (
                <div key={m.cargo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < MEDIAS.length - 1 ? "1px solid #f0f2f5" : "none", fontSize: 13 }}>
                  <span style={{ color: "#111" }}>{m.cargo}</span>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#0a7a6b" }}>{m.valor}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
