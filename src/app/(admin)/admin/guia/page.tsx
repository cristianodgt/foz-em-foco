"use client";

import React, { useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Pending = [string, string, string, string];
const INITIAL: Pending[] = [
  ["Pastelaria do Neto", "Gastronomia", "Antonio Neto", "há 2h"],
  ["Auto Elétrica Central", "Serviços", "Carlos Vieira", "há 5h"],
  ["Clínica Dental Sorrir", "Saúde", "Dra. Fernanda", "há 1d"],
];

const ACTIVE: Array<[string, string, "OURO" | "PRATA", string, string]> = [
  ["Rafain Churrascaria", "Gastronomia", "OURO", "30/06", "3.240"],
  ["Hotel Bourbon", "Hotelaria", "OURO", "31/12", "2.800"],
  ["Tempero da Terra", "Gastronomia", "PRATA", "31/05", "1.420"],
  ["Trapiche", "Bar/Rest.", "PRATA", "30/06", "980"],
];

export default function GuiaPage() {
  const [pending, setPending] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const remove = (n: string) => setPending((p) => p.filter((x) => x[0] !== n));

  const filtered = ACTIVE.filter((r) => r[0].toLowerCase().includes(search.toLowerCase()));

  const kpis = [
    { label: "Negócios ativos", value: "1.847", color: TEAL },
    { label: "Destaques OURO", value: "42", color: "#d4a017" },
    { label: "Pendentes", value: pending.length.toString(), color: "#92400e" },
    { label: "Views do mês", value: "84.3k", color: "#047857" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Guia Comercial
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            diretório de negócios · {pending.length} aguardando aprovação
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            padding: "9px 14px", border: `1px solid ${BORDER}`, borderRadius: 8,
            background: "white", fontSize: 13, color: INK, fontWeight: 500, cursor: "pointer",
          }}>
            Exportar CSV
          </button>
          <button style={{
            padding: "9px 16px", background: TEAL, borderRadius: 8,
            fontSize: 13, color: "white", fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            + Novo negócio
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

      {/* Pendentes */}
      <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to right, #fef3c7, white)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#92400e", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>{pending.length}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Aguardando aprovação</div>
          </div>
        </div>
        {pending.map(([n, c, o, d], i, arr) => (
          <div key={n} style={{
            padding: "14px 22px",
            borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
            display: "flex", gap: 12, alignItems: "center",
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontFamily: "var(--font-serif)", fontSize: 16 }}>
              {n[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: INK }}>{n}</div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
                {c} · {o} · {d}
              </div>
            </div>
            <button style={{
              padding: "6px 12px", background: "white", color: INK,
              border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}>
              Detalhes
            </button>
            <button onClick={() => remove(n)} style={{
              padding: "6px 12px", background: TEAL, color: "white",
              border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              Aprovar
            </button>
            <button onClick={() => remove(n)} style={{
              padding: "6px 12px", background: "transparent", color: "#b91c1c",
              border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}>
              Rejeitar
            </button>
          </div>
        ))}
        {pending.length === 0 && (
          <div style={{ padding: "24px", textAlign: "center", color: MUTED, fontSize: 13 }}>
            Nenhum negócio pendente.
          </div>
        )}
      </div>

      {/* Ativos - toolbar */}
      <div style={{
        background: "white", border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", marginBottom: 16,
      }}>
        <input
          placeholder="Buscar negócios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, padding: "9px 12px", fontSize: 13,
            border: `1px solid ${BORDER}`, borderRadius: 8, outline: "none",
            background: BG, color: INK,
          }}
        />
        <select style={{
          padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`,
          borderRadius: 8, outline: "none", background: "white", color: INK,
        }}>
          <option>Todas as categorias</option>
          <option>Gastronomia</option>
          <option>Hotelaria</option>
          <option>Serviços</option>
        </select>
        <select style={{
          padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`,
          borderRadius: 8, outline: "none", background: "white", color: INK,
        }}>
          <option>Todos os planos</option>
          <option>OURO</option>
          <option>PRATA</option>
        </select>
      </div>

      {/* Ativos - tabela */}
      <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>
          Negócios ativos · 1.847
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: BG }}>
              {["Nome", "Categoria", "Plano", "Validade", "Views/mês", ""].map((h, i) => (
                <th key={h} style={{
                  padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)",
                  color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em",
                  textAlign: i === 4 ? "right" : "left", fontWeight: 600,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(([n, c, p, v, views], i) => (
              <tr key={n} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>{n}</td>
                <td style={{ padding: "14px", fontSize: 13, color: INK }}>
                  <span style={{
                    padding: "3px 10px", border: `1px solid ${BORDER}`, borderRadius: 99,
                    fontSize: 11, background: "white", color: INK,
                  }}>
                    {c}
                  </span>
                </td>
                <td style={{ padding: "14px" }}>
                  <span style={{
                    fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                    padding: "3px 8px", borderRadius: 99,
                    background: p === "OURO" ? "#fef3c7" : "#f3f4f6",
                    color: p === "OURO" ? "#92400e" : MUTED,
                  }}>
                    {p}
                  </span>
                </td>
                <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{v}</td>
                <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 13, color: TEAL, fontWeight: 700, textAlign: "right" }}>{views}</td>
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
    </div>
  );
}
