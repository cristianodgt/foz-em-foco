"use client";

import React from "react";
import Link from "next/link";

const catClass = (c: string) =>
  c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const ChevronIcon = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const StatCard = ({ label, value, delta, deltaPositive = true, color = "var(--teal)" }: { label: string; value: string; delta?: string; deltaPositive?: boolean; color?: string }) => (
  <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: "20px 22px", borderLeft: `3px solid ${color}` }}>
    <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{label}</div>
    <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, lineHeight: 1, color: "var(--ink)", marginBottom: 6 }}>{value}</div>
    {delta && (
      <div style={{ fontSize: 12, color: deltaPositive ? "var(--success)" : "var(--danger)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
        <span>{deltaPositive ? "↑" : "↓"}</span>{delta}
      </div>
    )}
  </div>
);

export default function AdminPage() {
  const barData = [120, 145, 132, 168, 180, 155, 172, 184, 160, 190, 205, 184];
  const maxBar = Math.max(...barData);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--ink)", marginBottom: 4 }}>Bom dia, Admin</div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Segunda-feira, 21 de abril de 2026</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Pageviews hoje"      value="18.420" delta="12% vs ontem"   color="var(--teal)" />
        <StatCard label="Notícias publicadas" value="1.847"  delta="12 esta semana" color="var(--cat-economia)" />
        <StatCard label="Visitantes únicos"   value="6.340"  delta="8% vs ontem"    color="var(--cat-cultura)" />
        <StatCard label="Receita do mês"      value="R$ 12.480" delta="23% vs mar"  color="var(--success)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Pageviews · últimas 12h</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>atualizado às 14:08</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["7d", "30d", "90d"].map((p) => (
                <button key={p} className={`btn btn-sm ${p === "7d" ? "btn-primary" : "btn-outline"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
            {barData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: "100%", borderRadius: "3px 3px 0 0",
                  background: i === barData.length - 1 ? "var(--teal)" : "var(--teal-light)",
                  border: i === barData.length - 1 ? "1px solid var(--teal)" : "1px solid transparent",
                  height: (v / maxBar * 100) + "%",
                }} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--muted)" }}>{i + 1}h</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>Atividade recente</div>
          {[
            ["Mariana Souza publicou uma notícia em Cidade", "há 5min"],
            ["Carlos Lima publicou em Política", "há 18min"],
            ["Negócio aguarda aprovação no Guia", "há 32min"],
            ["12 comentários aguardam moderação", "há 45min"],
            ["Newsletter diária enviada (14.847)", "há 1h"],
            ["Pagamento confirmado · Rafain · Ouro", "há 2h"],
          ].map(([d, t], i) => (
            <div key={i} style={{ padding: "10px 18px", borderBottom: i < 5 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 13, lineHeight: 1.4, color: "var(--ink-2)" }}>{d}</div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", flexShrink: 0 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Mais lidas hoje</div>
          <Link href="/admin/noticias" className="btn-ghost btn-sm" style={{ fontSize: 12, color: "#0a7a6b", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
            ver todas <ChevronIcon size={12} color="#0a7a6b" />
          </Link>
        </div>
        <table className="table">
          <thead><tr><th style={{ width: 32 }}>#</th><th>Título</th><th>Categoria</th><th>Autor</th><th>Views</th><th>Tempo médio</th></tr></thead>
          <tbody>
            {[
              ["Prefeitura anuncia R$ 12 mi para revitalizar o Centro", "Cidade",   "Mariana Souza", "2.104", "6min"],
              ["Cataratas batem recorde de visitantes em abril",         "Turismo",  "Ana Ferreira",  "1.840", "8min"],
              ["Concurso público: 450 vagas abertas na prefeitura",      "Cidade",   "Mariana Souza", "1.620", "5min"],
              ["Câmbio favorece varejo: fluxo de argentinos sobe 60%",   "Economia", "Carlos Lima",   "1.380", "4min"],
              ["Festival das Etnias confirma 15 países em maio",         "Cultura",  "Ana Ferreira",  "1.240", "9min"],
            ].map(([t, c, a, v, tm], i) => (
              <tr key={i}>
                <td style={{ paddingLeft: 18 }}><span style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--teal)", fontWeight: 400 }}>{i + 1}</span></td>
                <td style={{ fontWeight: 500, fontSize: 13, maxWidth: 400 }}><div className="truncate-2">{t}</div></td>
                <td><span className={`cat-tag ${catClass(c as string)}`}>{c}</span></td>
                <td style={{ fontSize: 13, color: "var(--ink-2)" }}>{a}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--teal)", fontWeight: 600 }}>{v}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>{tm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
