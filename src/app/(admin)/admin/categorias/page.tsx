"use client";

import React, { useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

const EDITORIAS: Record<string, { label: string; color: string; count: number }> = {
  cidade:    { label: "Cidade",    color: "#2563eb", count: 184 },
  politica:  { label: "Política",  color: "#7c3aed", count: 122 },
  economia:  { label: "Economia",  color: "#059669", count: 98 },
  turismo:   { label: "Turismo",   color: "#ea580c", count: 156 },
  paraguai:  { label: "Paraguai",  color: "#dc2626", count: 74 },
  cultura:   { label: "Cultura",   color: "#db2777", count: 88 },
  esporte:   { label: "Esporte",   color: "#0891b2", count: 62 },
  itaipu:    { label: "Itaipu",    color: "#65a30d", count: 45 },
  seguranca: { label: "Segurança", color: "#b91c1c", count: 93 },
};

export default function CategoriasPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");

  const total = Object.values(EDITORIAS).reduce((s, e) => s + e.count, 0);

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Categorias & Tags
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            {Object.keys(EDITORIAS).length} editorias · {total.toLocaleString("pt-BR")} artigos classificados
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Lista */}
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>
            Categorias existentes
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: BG }}>
                {["Nome", "Slug", "Artigos", ""].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)",
                    color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em",
                    textAlign: i === 2 ? "right" : "left", fontWeight: 600,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(EDITORIAS).map(([k, { label, color, count }], i) => (
                <tr key={k} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: INK }}>{label}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>/categoria/{k}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 13, color: TEAL, fontWeight: 700, textAlign: "right" }}>
                    {count}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Form */}
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", alignSelf: "start" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>
            Nova categoria
          </div>
          <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Nome">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Meio ambiente"
                style={inputStyle}
              />
            </Field>
            <Field label="Slug">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="meio-ambiente"
                style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
              />
            </Field>
            <Field label="Descrição">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="Resumo curto para SEO e página de categoria"
                style={{ ...inputStyle, resize: "none" }}
              />
            </Field>
            <button style={{
              padding: "10px 16px", background: TEAL, color: "white",
              border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              Criar categoria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8,
  fontSize: 13, width: "100%", outline: "none", background: BG, color: INK,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED,
        textTransform: "uppercase", letterSpacing: "0.06em",
        display: "block", marginBottom: 6, fontWeight: 600,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}
