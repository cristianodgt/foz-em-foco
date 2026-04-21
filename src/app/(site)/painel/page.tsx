"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  { id: "visao-geral", label: "Visão Geral" },
  { id: "campanhas",   label: "Campanhas" },
  { id: "relatorios",  label: "Relatórios" },
  { id: "materiais",   label: "Materiais" },
  { id: "faturamento", label: "Faturamento" },
];

const CAMPANHAS = [
  { slot: "Leaderboard",   status: "Ativa",    inicio: "01/04", fim: "30/04", impressoes: "62.4k", cliques: "284",  ctr: "0.45%" },
  { slot: "MPU Sidebar",   status: "Ativa",    inicio: "01/04", fim: "30/04", impressoes: "38.1k", cliques: "198",  ctr: "0.52%" },
  { slot: "Newsletter",    status: "Pausada",  inicio: "01/03", fim: "31/03", impressoes: "14.2k", cliques: "892",  ctr: "6.28%" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Ativa:   { bg: "#e8f8f0", color: "var(--success)" },
  Pausada: { bg: "#fff8e6", color: "var(--warning)" },
  Expirada:{ bg: "#fdecea", color: "var(--danger)" },
};

// Mini sparkline
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 80}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" style={{ width: 80, height: 32 }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function PainelAnunciantePage() {
  const [activeTab, setActiveTab] = useState("visao-geral");

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-2)" }}>
      <div className="container" style={{ padding: "32px 20px" }}>
        {/* Header */}
        <div className="row between" style={{ marginBottom: 28 }}>
          <div>
            <div className="t-mono" style={{ color: "var(--muted)", fontSize: 11, marginBottom: 4 }}>BEM-VINDO DE VOLTA</div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32 }}>Painel do Anunciante</h1>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <Link href="/anuncie"><button className="btn btn-primary btn-sm">+ Nova campanha</button></Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: 4, marginBottom: 28, width: "fit-content" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="btn btn-sm"
              style={{
                background: activeTab === t.id ? "var(--teal)" : "transparent",
                color: activeTab === t.id ? "white" : "var(--ink-3)",
                border: "none",
              }}
            >{t.label}</button>
          ))}
        </div>

        {activeTab === "visao-geral" && (
          <>
            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Impressões totais", value: "124.7k", delta: "+18% vs mês ant.", up: true,  spark: [40,52,48,61,58,72,68,80] },
                { label: "Cliques",           value: "1.374",  delta: "+8%",             up: true,  spark: [20,28,25,35,38,30,42,44] },
                { label: "CTR médio",         value: "0.49%",  delta: "+0.04pp",          up: true,  spark: [44,46,43,48,50,47,52,50] },
                { label: "Gasto no mês",      value: "R$ 1.290", delta: "Plano Destaque", up: null, spark: [80,80,80,80,80,80,80,80] },
              ].map(({ label, value, delta, up, spark }) => (
                <div key={label} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: "20px 20px 14px", boxShadow: "var(--shadow-s)" }}>
                  <div className="t-mono color-muted" style={{ fontSize: 10, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, lineHeight: 1, marginBottom: 6 }}>{value}</div>
                  <div className="row between">
                    <div style={{ fontSize: 12, color: up === true ? "var(--success)" : up === false ? "var(--danger)" : "var(--muted)", fontWeight: 600 }}>
                      {up !== null && (up ? "↑ " : "↓ ")}{delta}
                    </div>
                    <Sparkline values={spark} />
                  </div>
                </div>
              ))}
            </div>

            {/* Active campaigns */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="t-h4">Campanhas ativas</span>
                <button className="btn btn-ghost btn-sm">Ver todas</button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Slot</th><th>Status</th><th>Período</th><th>Impressões</th><th>Cliques</th><th>CTR</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPANHAS.map((c) => {
                    const ss = STATUS_STYLE[c.status] ?? {};
                    return (
                      <tr key={c.slot}>
                        <td style={{ fontWeight: 600 }}>{c.slot}</td>
                        <td>
                          <span style={{ ...ss, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                            {c.status}
                          </span>
                        </td>
                        <td className="t-mono" style={{ fontSize: 12 }}>{c.inicio} – {c.fim}</td>
                        <td style={{ fontWeight: 600 }}>{c.impressoes}</td>
                        <td>{c.cliques}</td>
                        <td style={{ color: "var(--teal)", fontWeight: 700 }}>{c.ctr}</td>
                        <td><button className="btn btn-ghost btn-sm">Relatório</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* CTAs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { icon: "➕", t: "Nova campanha",      d: "Crie um novo anúncio ou patrocínio",       cta: "Criar",           href: "/anuncie" },
                { icon: "📊", t: "Relatório completo", d: "Exportar dados em PDF ou CSV",             cta: "Exportar",        href: null },
                { icon: "💬", t: "Falar com consultor",d: "Dúvidas ou otimizações de campanha",       cta: "Abrir chat",      href: null },
              ].map(({ icon, t, d, cta, href }) => (
                <div key={t} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: 20, boxShadow: "var(--shadow-s)" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <div className="t-h4" style={{ marginBottom: 4 }}>{t}</div>
                  <div className="t-small color-muted" style={{ marginBottom: 12 }}>{d}</div>
                  {href ? (
                    <Link href={href}><button className="btn btn-outline btn-sm">{cta}</button></Link>
                  ) : (
                    <button className="btn btn-outline btn-sm">{cta}</button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab !== "visao-geral" && (
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: 48, textAlign: "center", boxShadow: "var(--shadow-s)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 8 }}>Seção em construção</div>
            <div className="t-small color-muted">Esta área do painel estará disponível em breve.</div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setActiveTab("visao-geral")}>← Voltar à visão geral</button>
          </div>
        )}
      </div>
    </div>
  );
}
