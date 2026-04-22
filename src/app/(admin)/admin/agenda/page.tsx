"use client";

import React, { useState } from "react";

const INITIAL: Array<[string, Array<[string, string, string?]>]> = [
  ["Eventos pendentes", [
    ["Festival Gastronômico", "21 abr · Gramadão", "R$ 199 pago"],
    ["Show Cover Beatles", "24 abr · Teatro", "Grátis (revisão)"],
    ["Corrida Noturna", "25 abr · Orla", "R$ 199 pago"],
  ]],
  ["Vagas pendentes", [
    ["Recepcionista bilíngue", "Hotel Wyndham · R$ 149"],
    ["Chef de Cozinha", "Restaurante Novo · R$ 149"],
    ["Motorista PJ", "Empresa X · Grátis (revisão)"],
  ]],
];

export default function AgendaPage() {
  const [groups, setGroups] = useState(INITIAL);

  const removeItem = (gi: number, key: string) => {
    setGroups(g => g.map((grp, idx) => idx === gi ? [grp[0], grp[1].filter(x => x[0] !== key)] : grp));
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 26, marginBottom: 20 }}>Agenda & Empregos</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {groups.map(([title, items], gi) => (
          <div key={title}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>{title}</div>
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
              {items.map((row, i, arr) => {
                const t = row[0];
                const d = row[1];
                const s = row[2];
                return (
                  <div key={t} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid #e2e8f0" : "none", display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{t}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{d}{s ? ` · ${s}` : ""}</div>
                    </div>
                    <button onClick={() => removeItem(gi, t)} style={{ padding: "6px 12px", background: "white", color: "#27ae60", border: "1.5px solid #27ae60", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>✓</button>
                    <button onClick={() => removeItem(gi, t)} style={{ padding: "6px 12px", background: "white", color: "#c0392b", border: "1.5px solid #c0392b", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>✕</button>
                  </div>
                );
              })}
              {items.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#888", fontSize: 13 }}>Nenhum item pendente</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
