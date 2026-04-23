"use client";

import React from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

const SECTIONS: Array<[string, string, Array<[string, string]>]> = [
  ["Configurações gerais", "Identidade e domínio do portal", [
    ["Nome do portal", "Foz em Foco"],
    ["URL", "https://fozemfoco.com.br"],
    ["Slogan", "Jornalismo local, utilidade pública e a tríplice fronteira"],
  ]],
  ["Newsletter", "Integração com Brevo e dados de remetente", [
    ["Remetente", "redacao@fozemfoco.com.br"],
    ["Nome do remetente", "Foz em Foco"],
    ["Plataforma", "Brevo (ex Sendinblue)"],
  ]],
  ["SEO & Analytics", "Rastreamento e descoberta", [
    ["Google Analytics ID", "G-XXXXXXXXXX"],
    ["Search Console", "verificado"],
    ["Sitemap", "https://fozemfoco.com.br/sitemap.xml"],
  ]],
];

export default function ConfiguracoesPage() {
  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Configurações
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            ajustes globais do portal · última alteração há 3 dias
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            padding: "9px 14px", border: `1px solid ${BORDER}`, borderRadius: 8,
            background: "white", fontSize: 13, color: INK, fontWeight: 500, cursor: "pointer",
          }}>
            Descartar
          </button>
          <button style={{
            padding: "9px 16px", background: TEAL, borderRadius: 8,
            fontSize: 13, color: "white", fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            Salvar tudo
          </button>
        </div>
      </div>

      {/* Layout 2 colunas: nav lateral + conteúdo */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>
        {/* Nav lateral */}
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", position: "sticky", top: 24 }}>
          {SECTIONS.map(([title], i) => (
            <a
              key={title}
              href={`#sec-${i}`}
              style={{
                display: "block",
                padding: "12px 18px",
                borderBottom: i < SECTIONS.length - 1 ? `1px solid ${BORDER}` : "none",
                fontSize: 13, color: i === 0 ? TEAL : INK, fontWeight: i === 0 ? 600 : 500,
                textDecoration: "none",
                borderLeft: i === 0 ? `3px solid ${TEAL}` : "3px solid transparent",
              }}
            >
              {title}
            </a>
          ))}
        </div>

        {/* Seções */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SECTIONS.map(([title, subtitle, fields], i) => (
            <div key={title} id={`sec-${i}`} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: INK, marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {subtitle}
                </div>
              </div>
              <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                {fields.map(([l, v]) => (
                  <div key={l}>
                    <label style={{
                      fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      display: "block", marginBottom: 6, fontWeight: 600,
                    }}>
                      {l}
                    </label>
                    <input
                      defaultValue={v}
                      style={{
                        padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8,
                        fontSize: 13, width: "100%", outline: "none",
                        background: BG, color: INK,
                      }}
                    />
                  </div>
                ))}
                <div>
                  <button style={{
                    padding: "9px 16px", background: TEAL, color: "white",
                    border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>
                    Salvar alterações
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
