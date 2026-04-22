"use client";

import React, { useState } from "react";

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

const imgPh: React.CSSProperties = {
  width: 44, height: 44, borderRadius: 8, flexShrink: 0,
  background: "#dde2e8",
  backgroundImage: "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)",
  backgroundSize: "12px 12px",
};

export default function GuiaPage() {
  const [pending, setPending] = useState(INITIAL);
  const remove = (n: string) => setPending(p => p.filter(x => x[0] !== n));

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 26, marginBottom: 20 }}>Guia Comercial</div>
      <div style={{ background: "#fff8e6", border: "1px solid #f5d57a", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
        <span style={{ color: "#d4a017" }}>⚠</span>
        <span><strong>{pending.length} negócios aguardam aprovação.</strong> Revise os dados antes de publicar.</span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Aguardando aprovação</div>
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
        {pending.map(([n, c, o, d], i, arr) => (
          <div key={n} style={{ padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid #e2e8f0" : "none", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={imgPh} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{n}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{c} · {o} · {d}</div>
            </div>
            <button style={btnOutlineSm}>Ver detalhes</button>
            <button onClick={() => remove(n)} style={{ ...btnOutlineSm, color: "#27ae60", borderColor: "#27ae60" }}>✓ Aprovar</button>
            <button onClick={() => remove(n)} style={{ ...btnOutlineSm, color: "#c0392b", borderColor: "#c0392b" }}>✕ Rejeitar</button>
          </div>
        ))}
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Negócios ativos · 1.847</div>
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
          <input placeholder="Buscar negócios..." style={{ maxWidth: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, width: "100%", outline: "none" }} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f7fa", fontSize: 11, fontFamily: "monospace", color: "#888", textTransform: "uppercase" }}>
              {["Nome", "Categoria", "Plano", "Validade", "Views/mês", "Ações"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIVE.map(([n, c, p, v, views]) => (
              <tr key={n} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 16px", fontWeight: 500, fontSize: 13 }}>{n}</td>
                <td style={{ padding: "10px 16px" }}><span style={pill}>{c}</span></td>
                <td style={{ padding: "10px 16px" }}>
                  <span style={{ background: p === "OURO" ? "#fff8e6" : "#f5f5f5", color: p === "OURO" ? "#d4a017" : "#888", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{p}</span>
                </td>
                <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 11 }}>{v}</td>
                <td style={{ padding: "10px 16px", fontFamily: "monospace", fontSize: 12, color: "#0a7a6b", fontWeight: 600 }}>{views}</td>
                <td style={{ padding: "10px 16px" }}>
                  <button style={btnOutlineSm}>✎ Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const btnOutlineSm: React.CSSProperties = { padding: "6px 12px", background: "white", color: "#111", border: "1.5px solid #e2e8f0", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12 };
const pill: React.CSSProperties = { padding: "3px 10px", border: "1px solid #e2e8f0", borderRadius: 999, fontSize: 11, background: "white" };
