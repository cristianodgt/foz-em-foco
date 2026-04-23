"use client";

import React from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

const AUTHORS = [
  { name: "Mariana Souza", role: "Editora · Cidade & Política", articles: 340, role_level: "Editor" },
  { name: "Carlos Lima", role: "Repórter · Economia", articles: 218, role_level: "Repórter" },
  { name: "Ana Ferreira", role: "Repórter · Turismo & Cultura", articles: 195, role_level: "Repórter" },
  { name: "João Melo", role: "Repórter · Esporte", articles: 142, role_level: "Repórter" },
  { name: "Sofia Alves", role: "Estagiária", articles: 28, role_level: "Estagiário" },
];

const ROLE_STYLES: Record<string, { bg: string; fg: string }> = {
  "Super Admin": { bg: "#ede9fe", fg: "#5b21b6" },
  Editor:        { bg: "#e6f9f3", fg: "#047857" },
  Repórter:      { bg: "#e0f2fe", fg: "#075985" },
  Estagiário:    { bg: "#f3f4f6", fg: "#6b7280" },
};

export default function AutoresPage() {
  const totalArticles = AUTHORS.reduce((s, a) => s + a.articles, 0);

  const kpis = [
    { label: "Total de autores", value: AUTHORS.length.toString(), color: TEAL },
    { label: "Editores", value: AUTHORS.filter((a) => a.role_level === "Editor").length.toString(), color: "#047857" },
    { label: "Repórteres", value: AUTHORS.filter((a) => a.role_level === "Repórter").length.toString(), color: "#075985" },
    { label: "Artigos publicados", value: totalArticles.toLocaleString("pt-BR"), color: "#065a4f" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Autores
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            equipe editorial · {AUTHORS.length} contas ativas
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            padding: "9px 14px", border: `1px solid ${BORDER}`, borderRadius: 8,
            background: "white", fontSize: 13, color: INK, fontWeight: 500, cursor: "pointer",
          }}>
            Permissões
          </button>
          <button style={{
            padding: "9px 16px", background: TEAL, borderRadius: 8,
            fontSize: 13, color: "white", fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            + Convidar autor
          </button>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{
            background: "white", border: `1px solid ${BORDER}`, borderRadius: 14,
            padding: "18px 20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: k.color }} />
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>{k.label}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, lineHeight: 1, color: INK }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: BG }}>
              {["Autor", "Função", "Permissão", "Artigos", ""].map((h, i) => (
                <th key={i} style={{
                  padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)",
                  color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em",
                  textAlign: i === 3 ? "right" : "left", fontWeight: 600,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AUTHORS.map((a, i) => {
              const rs = ROLE_STYLES[a.role_level] ?? { bg: "#f3f4f6", fg: MUTED };
              return (
                <tr key={a.name} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "#e6f9f3", color: TEAL,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {a.name[0]}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: INK }}>{a.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: "14px", fontSize: 13, color: INK }}>{a.role}</td>
                  <td style={{ padding: "14px" }}>
                    <span style={{
                      fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                      padding: "3px 8px", borderRadius: 99,
                      background: rs.bg, color: rs.fg,
                    }}>
                      {a.role_level.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 13, color: TEAL, fontWeight: 700, textAlign: "right" }}>
                    {a.articles}
                  </td>
                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <button style={{
                      padding: "6px 12px", background: "white", color: INK,
                      border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    }}>
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
