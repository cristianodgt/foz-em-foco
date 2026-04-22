"use client";

import React from "react";

const AUTHORS = [
  { name: "Mariana Souza", role: "Editora · Cidade & Política", articles: 340, role_level: "Editor" },
  { name: "Carlos Lima", role: "Repórter · Economia", articles: 218, role_level: "Repórter" },
  { name: "Ana Ferreira", role: "Repórter · Turismo & Cultura", articles: 195, role_level: "Repórter" },
  { name: "João Melo", role: "Repórter · Esporte", articles: 142, role_level: "Repórter" },
  { name: "Sofia Alves", role: "Estagiária", articles: 28, role_level: "Estagiário" },
];

export default function AutoresPage() {
  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 26 }}>Autores</div>
        <button style={{ padding: "6px 12px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>+ Convidar autor</button>
      </div>
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        {AUTHORS.map((a, i, arr) => (
          <div key={a.name} style={{ padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid #e2e8f0" : "none", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e6f4f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#0a7a6b", fontSize: 15, fontWeight: 700 }}>{a.name[0]}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{a.role}</div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#0a7a6b", fontWeight: 600, marginRight: 12 }}>{a.articles} notícias</div>
            <select defaultValue={a.role_level} style={{ width: "auto", padding: "5px 10px", fontSize: 12, border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "white" }}>
              {["Super Admin", "Editor", "Repórter", "Estagiário"].map(r => <option key={r}>{r}</option>)}
            </select>
            <button style={{ padding: "6px 12px", background: "white", color: "#111", border: "1.5px solid #e2e8f0", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>✎ Editar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
