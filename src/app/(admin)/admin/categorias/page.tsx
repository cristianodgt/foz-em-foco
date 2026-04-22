"use client";

import React, { useState } from "react";

const EDITORIAS: Record<string, { label: string; color: string }> = {
  cidade:    { label: "Cidade",    color: "#2563eb" },
  politica:  { label: "Política",  color: "#7c3aed" },
  economia:  { label: "Economia",  color: "#059669" },
  turismo:   { label: "Turismo",   color: "#ea580c" },
  paraguai:  { label: "Paraguai",  color: "#dc2626" },
  cultura:   { label: "Cultura",   color: "#db2777" },
  esporte:   { label: "Esporte",   color: "#0891b2" },
  itaipu:    { label: "Itaipu",    color: "#65a30d" },
  seguranca: { label: "Segurança", color: "#b91c1c" },
};

const inputStyle: React.CSSProperties = { padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, width: "100%", outline: "none" };

export default function CategoriasPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div>
      <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 26, marginBottom: 20 }}>Categorias & Tags</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, fontSize: 14 }}>Categorias existentes</div>
          {Object.entries(EDITORIAS).map(([k, { label, color }], i, arr) => (
            <div key={k} style={{ padding: "12px 18px", borderBottom: i < arr.length - 1 ? "1px solid #e2e8f0" : "none", display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: "#888" }}>/categoria/{k} · {Math.floor(Math.random() * 200) + 50} notícias</div>
              </div>
              <button style={{ padding: "6px 12px", background: "white", color: "#111", border: "1.5px solid #e2e8f0", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>✎ Editar</button>
            </div>
          ))}
        </div>
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, fontSize: 14 }}>Nova categoria</div>
          <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Row label="Nome"><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} /></Row>
            <Row label="Slug"><input style={inputStyle} value={slug} onChange={e => setSlug(e.target.value)} /></Row>
            <Row label="Descrição"><textarea style={{ ...inputStyle, resize: "none" }} rows={3} value={desc} onChange={e => setDesc(e.target.value)} /></Row>
            <button style={{ width: "100%", padding: "10px 20px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Criar categoria</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontFamily: "monospace", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}
