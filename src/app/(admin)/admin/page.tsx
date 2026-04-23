"use client";

import React, { useState } from "react";
import Link from "next/link";

const TEAL = "#0a7a6b";
const TEAL_DARK = "#065a4f";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

const catClass = (c: string) =>
  c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// ————————————————————————————————————————————————————————————
// Icons
const Icon = ({ d, size = 16, color = "currentColor", fill = "none", sw = 1.75 }: { d: string; size?: number; color?: string; fill?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ArrowUp = (p: any) => <Icon d="M12 19V5 M5 12l7-7 7 7" {...p} />;
const ArrowDown = (p: any) => <Icon d="M12 5v14 M19 12l-7 7-7-7" {...p} />;
const Chevron = (p: any) => <Icon d="M9 18l6-6-6-6" {...p} />;
const PlusIcon = (p: any) => <Icon d="M12 5v14 M5 12h14" {...p} />;
const ExternalIcon = (p: any) => <Icon d="M15 3h6v6 M10 14L21 3 M21 14v7H3V3h7" {...p} />;

// ————————————————————————————————————————————————————————————
// Mini Sparkline
const Sparkline = ({ data, color = TEAL, width = 90, height = 28 }: { data: number[]; color?: string; width?: number; height?: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ————————————————————————————————————————————————————————————
// KPI Card
type KPI = { label: string; value: string; delta: number; spark: number[]; color: string; suffix?: string };
const KpiCard = ({ k }: { k: KPI }) => (
  <div style={{
    background: "white", border: `1px solid ${BORDER}`, borderRadius: 14,
    padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12,
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: k.color }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{k.label}</div>
      <div style={{
        fontSize: 10.5, fontWeight: 700, fontFamily: "var(--font-mono)",
        padding: "3px 7px", borderRadius: 99,
        background: k.delta >= 0 ? "#e6f9f3" : "#fee2e2",
        color: k.delta >= 0 ? "#047857" : "#b91c1c",
        display: "flex", alignItems: "center", gap: 3,
      }}>
        {k.delta >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
        {Math.abs(k.delta)}%
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, lineHeight: 1, color: INK }}>
        {k.value}{k.suffix && <span style={{ fontSize: 14, color: MUTED, marginLeft: 3 }}>{k.suffix}</span>}
      </div>
      <Sparkline data={k.spark} color={k.color} />
    </div>
  </div>
);

// ————————————————————————————————————————————————————————————
// Audience Area Chart
const AudienceChart = ({ period }: { period: string }) => {
  const data = period === "7d"
    ? [12400, 14200, 13800, 15600, 14900, 16800, 18420]
    : period === "30d"
    ? [10200, 11400, 12100, 11800, 13200, 14500, 15100, 14800, 15900, 17200, 16800, 17500, 18100, 18800, 19200, 18600, 19400, 20100, 19700, 20400, 21000, 20600, 21400, 22100, 21800, 22500, 23100, 22800, 23500, 18420]
    : Array.from({ length: 12 }, (_, i) => 8000 + Math.sin(i * 0.5) * 4000 + i * 900);
  const labels = period === "7d" ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] : [];
  const W = 720, H = 220, PAD_L = 40, PAD_B = 30, PAD_T = 20, PAD_R = 10;
  const cw = W - PAD_L - PAD_R, ch = H - PAD_T - PAD_B;
  const max = Math.max(...data) * 1.1;
  const step = cw / (data.length - 1);
  const pts = data.map((v, i) => ({ x: PAD_L + i * step, y: PAD_T + ch - (v / max) * ch, v }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${path} L${pts[pts.length - 1].x},${PAD_T + ch} L${pts[0].x},${PAD_T + ch} Z`;
  const last = pts[pts.length - 1];
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ y: PAD_T + ch - t * ch, v: Math.round(max * t) }));
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.35" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={PAD_L} y1={t.y} x2={W - PAD_R} y2={t.y} stroke={BORDER} strokeDasharray="2 3" />
          <text x={PAD_L - 8} y={t.y + 4} fontSize="10" fontFamily="var(--font-mono)" fill={MUTED} textAnchor="end">
            {(t.v / 1000).toFixed(0)}k
          </text>
        </g>
      ))}
      <path d={area} fill="url(#area-grad)" />
      <path d={path} fill="none" stroke={TEAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {labels.map((l, i) => (
        <text key={i} x={PAD_L + i * step} y={H - 10} fontSize="10.5" fontFamily="var(--font-mono)" fill={MUTED} textAnchor="middle">{l}</text>
      ))}
      <circle cx={last.x} cy={last.y} r="5" fill="white" stroke={TEAL} strokeWidth="2.5" />
      <g transform={`translate(${last.x - 45},${last.y - 38})`}>
        <rect width="90" height="26" rx="6" fill={INK} />
        <text x="45" y="17" fontSize="11" fontFamily="var(--font-mono)" fill="white" textAnchor="middle" fontWeight="600">
          {last.v.toLocaleString("pt-BR")}
        </text>
      </g>
    </svg>
  );
};

// ————————————————————————————————————————————————————————————
// Category Breakdown
const CATEGORIAS = [
  { name: "Cidade",   pct: 28, color: TEAL,      views: "5.160" },
  { name: "Turismo",  pct: 22, color: "#1a6b5a", views: "4.050" },
  { name: "Política", pct: 16, color: "#c0392b", views: "2.950" },
  { name: "Economia", pct: 14, color: "#d35400", views: "2.580" },
  { name: "Paraguai", pct: 11, color: "#8e6914", views: "2.020" },
  { name: "Outros",   pct: 9,  color: "#9ca3af", views: "1.660" },
];

// ————————————————————————————————————————————————————————————
// Page
export default function AdminPage() {
  const [period, setPeriod] = useState("7d");

  const kpis: KPI[] = [
    { label: "Pageviews hoje", value: "18.420", delta: 12,  spark: [12, 14, 13, 15, 14, 16, 18], color: TEAL },
    { label: "Visitantes únicos", value: "6.340", delta: 8, spark: [5, 5.4, 5.8, 6, 5.7, 6.1, 6.3], color: "#1a6b5a" },
    { label: "Notícias publicadas", value: "1.847", delta: 4, spark: [1820, 1825, 1830, 1834, 1838, 1842, 1847], color: "#d35400" },
    { label: "Receita do mês", value: "12.480", suffix: "R$", delta: 23, spark: [8, 9, 9.5, 10, 10.8, 11.5, 12.4], color: "#065a4f" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>Bom dia, Admin</div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            SEG · 21 ABR 2026 · 14:08 <span style={{ color: TEAL, marginLeft: 10 }}>● online</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" target="_blank" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
            border: `1px solid ${BORDER}`, borderRadius: 8, background: "white",
            fontSize: 13, color: INK, textDecoration: "none", fontWeight: 500,
          }}>
            <ExternalIcon size={14} /> Ver site
          </Link>
          <Link href="/admin/noticias/nova" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
            background: TEAL, borderRadius: 8, fontSize: 13, color: "white",
            textDecoration: "none", fontWeight: 600,
          }}>
            <PlusIcon size={14} /> Publicar notícia
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => <KpiCard key={i} k={k} />)}
      </div>

      {/* Main grid: chart + categorias */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: INK, marginBottom: 2 }}>Audiência</div>
              <div style={{ fontSize: 12, color: MUTED }}>Pageviews nos últimos {period}</div>
            </div>
            <div style={{ display: "flex", gap: 4, background: BG, padding: 4, borderRadius: 8 }}>
              {["7d", "30d", "90d"].map((p) => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding: "6px 12px", fontSize: 12, fontWeight: 600,
                  border: "none", borderRadius: 6, cursor: "pointer",
                  background: period === p ? "white" : "transparent",
                  color: period === p ? INK : MUTED,
                  boxShadow: period === p ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                }}>{p}</button>
              ))}
            </div>
          </div>
          <AudienceChart period={period} />
        </div>

        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: INK, marginBottom: 2 }}>Top categorias</div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Distribuição de views hoje</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {CATEGORIAS.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>
                    {c.views} <span style={{ color: c.color, fontWeight: 600, marginLeft: 4 }}>{c.pct}%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${c.pct * 3.5}%`, height: "100%", background: c.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row: Aprovações + Atividade */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to right, #e6f9f3, white)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>3</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Aprovações pendentes</div>
            </div>
            <Link href="/admin/comentarios" style={{ fontSize: 12, color: TEAL, textDecoration: "none", fontWeight: 600 }}>ver tudo</Link>
          </div>
          {[
            { type: "Comentário", who: "João Silva", on: "em \"Cataratas batem recorde...\"", time: "5min" },
            { type: "Guia",       who: "Restaurante Rafain", on: "aguarda aprovação", time: "32min" },
            { type: "Newsletter", who: "Nova edição",   on: "pronta para envio (14.847)", time: "1h" },
          ].map((a, i) => (
            <div key={i} style={{ padding: "14px 22px", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{a.type} · {a.time}</div>
                <div style={{ fontSize: 13, color: INK }}><strong>{a.who}</strong> {a.on}</div>
              </div>
              <button style={{ padding: "6px 12px", background: TEAL, color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Aprovar</button>
              <button style={{ padding: "6px 10px", background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Rejeitar</button>
            </div>
          ))}
        </div>

        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Atividade recente</div>
          {[
            { c: TEAL,      t: "Mariana Souza publicou em Cidade", tm: "5min" },
            { c: "#c0392b", t: "Carlos Lima publicou em Política",  tm: "18min" },
            { c: "#d35400", t: "Ana Ferreira editou artigo em Economia", tm: "24min" },
            { c: "#1a6b5a", t: "Newsletter diária enviada (14.847)",  tm: "1h" },
            { c: "#065a4f", t: "Pagamento confirmado · Rafain · Ouro", tm: "2h" },
            { c: "#6c3483", t: "Nova campanha aprovada · Itaipu Binacional", tm: "3h" },
          ].map((a, i) => (
            <div key={i} style={{ padding: "11px 22px", borderBottom: i < 5 ? `1px solid ${BORDER}` : "none", display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: a.c, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, color: INK }}>{a.t}</div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED }}>há {a.tm}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mais lidas */}
      <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Mais lidas hoje</div>
          <Link href="/admin/noticias" style={{ fontSize: 12, color: TEAL, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
            ver todas <Chevron size={12} color={TEAL} />
          </Link>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: BG }}>
              {["#", "Título", "Categoria", "Autor", "Views", "Tempo médio", "Tendência"].map((h, i) => (
                <th key={i} style={{ padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Prefeitura anuncia R$ 12 mi para revitalizar o Centro", "Cidade",   "Mariana Souza", "2.104", "6min", 18],
              ["Cataratas batem recorde de visitantes em abril",         "Turismo",  "Ana Ferreira",  "1.840", "8min", 24],
              ["Concurso público: 450 vagas abertas na prefeitura",      "Cidade",   "Mariana Souza", "1.620", "5min", 8],
              ["Câmbio favorece varejo: fluxo de argentinos sobe 60%",   "Economia", "Carlos Lima",   "1.380", "4min", -3],
              ["Festival das Etnias confirma 15 países em maio",         "Cultura",  "Ana Ferreira",  "1.240", "9min", 12],
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                <td style={{ padding: "14px", paddingLeft: 22 }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: TEAL }}>{i + 1}</span>
                </td>
                <td style={{ padding: "14px", fontSize: 13, fontWeight: 500, color: INK, maxWidth: 380 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r[0]}</div>
                </td>
                <td style={{ padding: "14px" }}><span className={`cat-tag ${catClass(r[1] as string)}`}>{r[1]}</span></td>
                <td style={{ padding: "14px", fontSize: 13, color: INK }}>{r[2]}</td>
                <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 13, color: TEAL, fontWeight: 700 }}>{r[3]}</td>
                <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{r[4]}</td>
                <td style={{ padding: "14px" }}>
                  <span style={{
                    fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                    padding: "3px 8px", borderRadius: 99,
                    background: (r[5] as number) >= 0 ? "#e6f9f3" : "#fee2e2",
                    color:      (r[5] as number) >= 0 ? "#047857" : "#b91c1c",
                    display: "inline-flex", alignItems: "center", gap: 2,
                  }}>
                    {(r[5] as number) >= 0 ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
                    {Math.abs(r[5] as number)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
        {[
          { l: "Nova notícia",   h: "/admin/noticias/nova", c: TEAL },
          { l: "Mídia",          h: "/admin/midia",         c: "#1a6b5a" },
          { l: "Guia comercial", h: "/admin/guia",          c: "#065a4f" },
          { l: "Agenda",         h: "/admin/agenda",        c: "#6c3483" },
          { l: "Anúncios",       h: "/admin/anuncios",      c: "#d35400" },
          { l: "Configurações",  h: "/admin/configuracoes", c: MUTED },
        ].map((a, i) => (
          <Link key={i} href={a.h} style={{
            padding: "16px 14px", background: "white", border: `1px solid ${BORDER}`,
            borderRadius: 12, textDecoration: "none", display: "flex", flexDirection: "column",
            gap: 10, transition: "all 0.15s",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.c}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlusIcon size={16} color={a.c} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{a.l}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
