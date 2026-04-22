"use client";

import React from "react";

const SECTIONS: Array<[string, Array<[string, string]>]> = [
  ["Configurações gerais", [
    ["Nome do portal", "Foz em Foco"],
    ["URL", "https://fozemfoco.com.br"],
    ["Slogan", "Jornalismo local, utilidade pública e a tríplice fronteira"],
  ]],
  ["Newsletter", [
    ["Remetente", "redacao@fozemfoco.com.br"],
    ["Nome do remetente", "Foz em Foco"],
    ["Plataforma", "Brevo (ex Sendinblue)"],
  ]],
  ["SEO & Analytics", [
    ["Google Analytics ID", "G-XXXXXXXXXX"],
    ["Search Console", "verificado"],
    ["Sitemap", "https://fozemfoco.com.br/sitemap.xml"],
  ]],
];

const inputStyle: React.CSSProperties = { padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, width: "100%", outline: "none" };

export default function ConfiguracoesPage() {
  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 26, marginBottom: 20 }}>Configurações</div>
      {SECTIONS.map(([title, fields]) => (
        <div key={title} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, fontSize: 14 }}>{title}</div>
          <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 12 }}>
            {fields.map(([l, v]) => (
              <div key={l}>
                <label style={{ fontSize: 11, fontFamily: "monospace", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>{l}</label>
                <input style={inputStyle} defaultValue={v} />
              </div>
            ))}
            <button style={{ alignSelf: "flex-start", padding: "6px 12px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Salvar alterações</button>
          </div>
        </div>
      ))}
    </div>
  );
}
