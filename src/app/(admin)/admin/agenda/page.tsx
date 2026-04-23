"use client";

import React, { useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

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
    setGroups((g) =>
      g.map((grp, idx) => (idx === gi ? [grp[0], grp[1].filter((x) => x[0] !== key)] : grp))
    );
  };

  const totalPending = groups.reduce((s, g) => s + g[1].length, 0);

  const kpis = [
    { label: "Eventos ativos", value: "34", color: TEAL },
    { label: "Vagas ativas", value: "18", color: "#047857" },
    { label: "Pendentes", value: totalPending.toString(), color: "#92400e" },
    { label: "Receita do mês", value: "R$ 2.4k", color: "#065a4f" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Agenda & Empregos
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            eventos da cidade e classificados · {totalPending} aguardam aprovação
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            padding: "9px 14px", border: `1px solid ${BORDER}`, borderRadius: 8,
            background: "white", fontSize: 13, color: INK, fontWeight: 500, cursor: "pointer",
          }}>
            Nova vaga
          </button>
          <button style={{
            padding: "9px 16px", background: TEAL, borderRadius: 8,
            fontSize: 13, color: "white", fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            + Novo evento
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

      {/* Grupos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {groups.map(([title, items], gi) => (
          <div key={title} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>{title}</div>
              <span style={{
                fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                padding: "3px 8px", borderRadius: 99,
                background: "#fef3c7", color: "#92400e",
              }}>
                {items.length} PENDENTE(S)
              </span>
            </div>
            {items.map((row, i, arr) => {
              const t = row[0];
              const d = row[1];
              const s = row[2];
              return (
                <div key={t} style={{
                  padding: "14px 22px",
                  borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
                  display: "flex", gap: 12, alignItems: "center",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: INK }}>{t}</div>
                    <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {d}{s ? ` · ${s}` : ""}
                    </div>
                  </div>
                  <button onClick={() => removeItem(gi, t)} style={{
                    padding: "6px 12px", background: TEAL, color: "white",
                    border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>
                    Aprovar
                  </button>
                  <button onClick={() => removeItem(gi, t)} style={{
                    padding: "6px 12px", background: "transparent", color: "#b91c1c",
                    border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  }}>
                    Rejeitar
                  </button>
                </div>
              );
            })}
            {items.length === 0 && (
              <div style={{ padding: "32px 22px", textAlign: "center", color: MUTED, fontSize: 13 }}>
                Nenhum item pendente.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
