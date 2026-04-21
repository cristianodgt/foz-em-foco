"use client";

import React, { useState } from "react";
import Link from "next/link";

const catClass = (c: string) =>
  c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const EDITORIAS: Record<string, { label: string; color: string }> = {
  cidade:    { label: "Cidade",    color: "var(--cat-cidade)" },
  politica:  { label: "Política",  color: "var(--cat-politica)" },
  economia:  { label: "Economia",  color: "var(--cat-economia)" },
  turismo:   { label: "Turismo",   color: "var(--cat-turismo)" },
  paraguai:  { label: "Paraguai",  color: "var(--cat-paraguai)" },
  cultura:   { label: "Cultura",   color: "var(--cat-cultura)" },
  esporte:   { label: "Esporte",   color: "var(--cat-esporte)" },
  itaipu:    { label: "Itaipu",    color: "var(--cat-itaipu)" },
  seguranca: { label: "Segurança", color: "var(--cat-seguranca)" },
};

// ── SVG Icons ──
const PATHS: Record<string, React.ReactNode> = {
  dashboard:  <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
  articles:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  media:      <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
  categories: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
  authors:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  comments:   <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  guia:       <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>,
  ads:        <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  newsletter: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>,
  agenda:     <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  check:      <><polyline points="20 6 9 17 4 12"/></>,
  x:          <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  edit:       <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash:      <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  eye:        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  chevron:    <><polyline points="9 18 15 12 9 6"/></>,
  upload:     <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
  chart:      <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  send:       <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  alert:      <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
};

const Icon = ({ name, size = 16, color = "currentColor" }: { name: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {PATHS[name] ?? null}
  </svg>
);

// ── Reusable components ──
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

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>{label}</label>
    {children}
  </div>
);

const ApproveBtn = () => (
  <button className="btn btn-sm" style={{ background: "#e8f8f0", color: "var(--success)", border: "1px solid #b2dfca", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
    <Icon name="check" size={11} color="var(--success)" /> Aprovar
  </button>
);
const RejectBtn = () => (
  <button className="btn btn-sm" style={{ background: "white", color: "var(--danger)", border: "1px solid #f5b7b1", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
    <Icon name="x" size={11} color="var(--danger)" /> Rejeitar
  </button>
);

// ── Sections ──

const AdminDash = ({ onSection }: { onSection: (s: string) => void }) => {
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
          <button className="btn-ghost btn-sm" style={{ fontSize: 12, color: "var(--teal)", display: "flex", alignItems: "center", gap: 4 }} onClick={() => onSection("articles")}>
            ver todas <Icon name="chevron" size={12} color="var(--teal)" />
          </button>
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
};

const ArticlesList = ({ onEdit }: { onEdit: (a: object) => void }) => {
  const [filter, setFilter] = useState("Todos");
  const articles = [
    { id: 1, title: "Prefeitura anuncia R$ 12 mi para revitalizar o Centro", cat: "Cidade",   author: "Mariana Souza", status: "Publicado",   views: "2.104", date: "20/04 14:08" },
    { id: 2, title: "Câmara aprova novo Plano Diretor com foco em mobilidade", cat: "Política", author: "Carlos Lima",   status: "Publicado",   views: "1.240", date: "20/04 11:20" },
    { id: 3, title: "Cataratas batem recorde de visitantes em abril",          cat: "Turismo",  author: "Ana Ferreira",  status: "Publicado",   views: "1.840", date: "19/04 16:45" },
    { id: 4, title: "Itaipu anuncia investimento em energia solar para 2026",  cat: "Itaipu",   author: "Mariana Souza", status: "Rascunho",    views: "—",     date: "20/04 09:30" },
    { id: 5, title: "Novo shopping no bairro Três Lagoas até 2027",            cat: "Economia", author: "João Melo",     status: "Em revisão",  views: "—",     date: "20/04 10:12" },
    { id: 6, title: "Festival das Etnias confirma 15 países em maio",          cat: "Cultura",  author: "Ana Ferreira",  status: "Agendado",    views: "—",     date: "21/04 08:00" },
  ];
  const statusStyle: Record<string, { background: string; color: string }> = {
    "Publicado":  { background: "#e8f8f0", color: "var(--success)" },
    "Rascunho":   { background: "#f5f5f5", color: "var(--muted)" },
    "Em revisão": { background: "#fff8e6", color: "var(--warning)" },
    "Agendado":   { background: "#e8edf8", color: "var(--cat-esporte)" },
  };
  const filtered = filter === "Todos" ? articles : articles.filter(a => a.status === filter);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["Todos", "Publicado", "Rascunho", "Em revisão", "Agendado"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}>{f}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" placeholder="Buscar notícias..." style={{ width: 220, padding: "7px 12px", fontSize: 13 }} />
          <select className="input" style={{ width: "auto", padding: "7px 12px", fontSize: 13 }}>
            <option>Todas as categorias</option>
            {Object.entries(EDITORIAS).map(([k, v]) => <option key={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ paddingLeft: 18, width: 32 }}><input type="checkbox" /></th>
              <th>Título</th><th>Categoria</th><th>Autor</th><th>Status</th><th>Views</th><th>Data</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => {
              const ss = statusStyle[a.status] ?? {};
              return (
                <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => onEdit(a)}>
                  <td style={{ paddingLeft: 18 }} onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  <td><div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.3 }} className="truncate-2">{a.title}</div></td>
                  <td><span className={`cat-tag ${catClass(a.cat)}`}>{a.cat}</span></td>
                  <td style={{ fontSize: 13, color: "var(--ink-3)" }}>{a.author}</td>
                  <td><span style={{ ...ss, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{a.status}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{a.views}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>{a.date}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={() => onEdit(a)}>
                        <Icon name="edit" size={12} /> Editar
                      </button>
                      <button className="btn btn-sm" style={{ background: "none", border: "none", color: "var(--danger)", padding: "4px 6px" }}>
                        <Icon name="trash" size={14} color="var(--danger)" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Mostrando {filtered.length} de 1.847</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["←", "1", "2", "3", "...", "184", "→"].map((p, i) => (
            <button key={i} className={`btn btn-sm ${p === "1" ? "btn-primary" : "btn-outline"}`}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleEditor = ({ article, onBack }: { article: Record<string, string>; onBack: () => void }) => {
  const [title, setTitle] = useState(article.title ?? "");
  const [status, setStatus] = useState(article.status ?? "Rascunho");
  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={onBack}>← Voltar</button>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>{article.id ? "Editar notícia" : "Nova notícia"}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="eye" size={13} /> Pré-visualizar
          </button>
          <select className="input" value={status} onChange={e => setStatus(e.target.value)} style={{ width: "auto", padding: "7px 12px", fontSize: 13 }}>
            {["Rascunho", "Em revisão", "Agendado", "Publicado"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary btn-sm">Salvar</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: "22px 24px" }}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da notícia..."
              style={{ width: "100%", border: "none", outline: "none", fontFamily: "var(--font-serif)", fontSize: 26, lineHeight: 1.2, background: "transparent", color: "var(--ink)" }} />
            <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />
            <input placeholder="Lead / subtítulo (aparece no destaque da home)..."
              style={{ width: "100%", border: "none", outline: "none", fontSize: 16, color: "var(--ink-3)", fontStyle: "italic", background: "transparent" }} />
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["B", "I", "H2", "H3", "Link", "Imagem", "Bloco", "Lista"].map(l => (
                <button key={l} style={{ padding: "4px 10px", border: "1px solid var(--border)", borderRadius: "var(--r-s)", background: "var(--paper-2)", fontSize: 12, fontWeight: l === "B" ? 700 : 400, fontStyle: l === "I" ? "italic" : "normal" }}>{l}</button>
              ))}
            </div>
            <textarea placeholder="Escreva o corpo da notícia aqui..."
              style={{ width: "100%", minHeight: 360, padding: "22px 24px", border: "none", outline: "none", resize: "vertical", fontFamily: "Georgia,serif", fontSize: 17, lineHeight: 1.8, color: "var(--ink-2)", background: "transparent" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {([
            ["Publicação", <>
              <Row label="Status">
                <select value={status} onChange={e => setStatus(e.target.value)} className="input" style={{ padding: "6px 10px", fontSize: 13 }}>
                  {["Rascunho", "Em revisão", "Agendado", "Publicado"].map(s => <option key={s}>{s}</option>)}
                </select>
              </Row>
              <Row label="Autor">
                <select className="input" style={{ padding: "6px 10px", fontSize: 13 }}>
                  {["Mariana Souza", "Carlos Lima", "Ana Ferreira"].map(s => <option key={s}>{s}</option>)}
                </select>
              </Row>
              <Row label="Data e hora"><input type="datetime-local" className="input" style={{ padding: "6px 10px", fontSize: 13 }} /></Row>
            </>],
            ["Categoria & Tags", <>
              <Row label="Categoria">
                <select className="input" style={{ padding: "6px 10px", fontSize: 13 }}>
                  {Object.entries(EDITORIAS).map(([k, v]) => <option key={k}>{v.label}</option>)}
                </select>
              </Row>
              <Row label="Tags"><input className="input" placeholder="separadas por vírgula" style={{ fontSize: 13 }} /></Row>
            </>],
            ["Imagem de destaque", <>
              <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--r-m)", padding: 20, textAlign: "center", cursor: "pointer", background: "var(--paper-2)" }}>
                <Icon name="upload" size={24} color="var(--muted)" />
                <div style={{ fontSize: 13, marginTop: 8, color: "var(--muted)" }}>Upload ou arraste</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, fontFamily: "var(--font-mono)" }}>JPG, PNG, WebP · máx 5MB</div>
              </div>
            </>],
            ["SEO", <>
              <Row label="Meta título"><input className="input" defaultValue={title} style={{ fontSize: 13 }} /></Row>
              <Row label="Meta descrição"><textarea className="input" rows={3} style={{ resize: "none", fontSize: 13 }} /></Row>
              <div style={{ padding: "6px 10px", background: "var(--teal-pale)", borderRadius: "var(--r-s)", fontSize: 11, color: "var(--teal)" }}>
                {title.length > 10 ? "✓ Título com boa extensão" : "✗ Título muito curto"}
              </div>
            </>],
          ] as [string, React.ReactNode][]).map(([h, content]) => (
            <div key={h} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
              <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{h}</div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>{content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MediaLibrary = () => (
  <div>
    <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" placeholder="Buscar arquivos..." style={{ width: 220, padding: "7px 12px", fontSize: 13 }} />
        <select className="input" style={{ width: "auto", padding: "7px 12px", fontSize: 13 }}>
          <option>Todos os tipos</option><option>Imagens</option><option>Vídeos</option><option>PDFs</option>
        </select>
      </div>
      <button className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="upload" size={13} /> Upload
      </button>
    </div>
    <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--r-l)", padding: 28, textAlign: "center", marginBottom: 20, cursor: "pointer", background: "white" }}>
      <Icon name="upload" size={28} color="var(--muted)" />
      <div style={{ fontWeight: 600, marginTop: 10, marginBottom: 4 }}>Arraste arquivos para fazer upload</div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>JPG, PNG, WebP, MP4, PDF · máx 50MB por arquivo</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-m)", overflow: "hidden", cursor: "pointer", boxShadow: "var(--shadow-s)" }}>
          <div className="imgph" data-label={`img-${i + 1}`} style={{ aspectRatio: "1/1" }} />
          <div style={{ padding: "7px 10px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>foto-{i + 1}.jpg</div>
            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>1.2MB · 1920×1080</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CategoriesAdmin = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>Categorias existentes</div>
      {Object.entries(EDITORIAS).map(([k, { label, color }], i, arr) => (
        <div key={k} style={{ padding: "12px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>/categoria/{k} · {Math.floor(Math.random() * 200) + 50} notícias</div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="edit" size={12} /> Editar
          </button>
        </div>
      ))}
    </div>
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>Nova categoria</div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        {(["Nome", "Slug", "Descrição"] as const).map((l) => (
          <Row key={l} label={l}>
            {l === "Descrição" ? <textarea className="input" rows={3} style={{ resize: "none" }} /> : <input className="input" />}
          </Row>
        ))}
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Criar categoria</button>
      </div>
    </div>
  </div>
);

const AuthorsAdmin = () => (
  <div>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
      <button className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="plus" size={13} /> Convidar autor
      </button>
    </div>
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
      {[
        { name: "Mariana Souza", role: "Editora · Cidade & Política",   articles: 340, level: "Editor" },
        { name: "Carlos Lima",   role: "Repórter · Economia",           articles: 218, level: "Repórter" },
        { name: "Ana Ferreira",  role: "Repórter · Turismo & Cultura",  articles: 195, level: "Repórter" },
        { name: "João Melo",     role: "Repórter · Esporte",            articles: 142, level: "Repórter" },
        { name: "Sofia Alves",   role: "Estagiária",                    articles: 28,  level: "Estagiário" },
      ].map(({ name, role, articles, level }, i, arr) => (
        <div key={name} style={{ padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--teal-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "var(--teal)", fontSize: 15, fontWeight: 700 }}>{name[0]}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{role}</div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--teal)", fontWeight: 600, marginRight: 12 }}>{articles} notícias</div>
          <select className="input" style={{ width: "auto", padding: "5px 10px", fontSize: 12 }} defaultValue={level}>
            {["Super Admin", "Editor", "Repórter", "Estagiário"].map(r => <option key={r}>{r}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="edit" size={12} /> Editar
          </button>
        </div>
      ))}
    </div>
  </div>
);

const CommentsAdmin = () => {
  const comments = [
    { author: "Paulo R.",   text: "Esperamos que desta vez saia do papel. O Centro precisa urgente.",     article: "Prefeitura anuncia R$ 12 mi...", status: "Pendente", date: "há 5min" },
    { author: "Silvia M.",  text: "Alguém verificou se o projeto tem ART registrada?",                    article: "Prefeitura anuncia R$ 12 mi...", status: "Pendente", date: "há 12min" },
    { author: "João C.",    text: "O engenheiro tem razão. Vi projeto similar levar 18 meses.",            article: "Prefeitura anuncia R$ 12 mi...", status: "Pendente", date: "há 20min" },
    { author: "Maria L.",   text: "Ótima reportagem! Muito necessária.",                                   article: "Cataratas batem recorde...",     status: "Aprovado", date: "há 1h" },
    { author: "Carlos F.",  text: "Isso é mentira! O prefeito está errado.",                              article: "Câmara aprova...",              status: "Spam",     date: "há 2h" },
  ];
  const statusStyle: Record<string, { background: string; color: string }> = {
    Pendente: { background: "#fff8e6", color: "var(--warning)" },
    Aprovado: { background: "#e8f8f0", color: "var(--success)" },
    Spam:     { background: "#fdecea", color: "var(--danger)" },
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["Todos (12)", "Pendentes (8)", "Aprovados (3)", "Spam (1)"].map(f => (
          <button key={f} className="btn btn-outline btn-sm">{f}</button>
        ))}
      </div>
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
        {comments.map(({ author, text, article, status, date }, i) => {
          const ss = statusStyle[status] ?? {};
          return (
            <div key={i} style={{ padding: "16px 20px", borderBottom: i < comments.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-3)" }}>{author[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                    <strong style={{ fontSize: 14 }}>{author}</strong>
                    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>{date}</span>
                    <span style={{ ...ss, padding: "1px 8px", borderRadius: 999, fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{status}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>em: <em>{article}</em></span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10, color: "var(--ink-2)" }}>{text}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <ApproveBtn />
                    <button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="edit" size={12} /> Editar</button>
                    <button className="btn btn-sm" style={{ background: "#fdecea", color: "var(--danger)", border: "1px solid #f5b7b1", display: "flex", alignItems: "center", gap: 4 }}><Icon name="trash" size={12} color="var(--danger)" /> Excluir</button>
                    <button className="btn btn-sm" style={{ background: "var(--paper-2)", color: "var(--muted)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="alert" size={12} color="var(--muted)" /> Spam</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GuiaAdmin = () => (
  <div>
    <div style={{ background: "#fff8e6", border: "1px solid #f5d57a", borderRadius: "var(--r-l)", padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
      <Icon name="alert" size={16} color="var(--warning)" />
      <span><strong>3 negócios aguardam aprovação.</strong> Revise os dados antes de publicar.</span>
    </div>
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Aguardando aprovação</div>
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden", marginBottom: 24 }}>
      {[
        ["Pastelaria do Neto", "Gastronomia", "Antonio Neto", "há 2h"],
        ["Auto Elétrica Central", "Serviços", "Carlos Vieira", "há 5h"],
        ["Clínica Dental Sorrir", "Saúde", "Dra. Fernanda", "há 1d"],
      ].map(([n, c, o, d], i, arr) => (
        <div key={n} style={{ padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 12, alignItems: "center" }}>
          <div className="imgph" data-label="" style={{ width: 44, height: 44, borderRadius: "var(--r-m)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{n}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{c} · {o} · {d}</div>
          </div>
          <button className="btn btn-outline btn-sm">Ver detalhes</button>
          <ApproveBtn /><RejectBtn />
        </div>
      ))}
    </div>
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Negócios ativos · 1.847</div>
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
        <input className="input" placeholder="Buscar negócios..." style={{ maxWidth: "100%" }} />
      </div>
      <table className="table">
        <thead><tr><th>Nome</th><th>Categoria</th><th>Plano</th><th>Validade</th><th>Views/mês</th><th>Ações</th></tr></thead>
        <tbody>
          {[
            ["Rafain Churrascaria", "Gastronomia", "OURO",  "30/06", "3.240"],
            ["Hotel Bourbon",       "Hotelaria",   "OURO",  "31/12", "2.800"],
            ["Tempero da Terra",    "Gastronomia", "PRATA", "31/05", "1.420"],
            ["Trapiche",            "Bar/Rest.",   "PRATA", "30/06", "980"],
          ].map(([n, c, p, v, views]) => (
            <tr key={n}>
              <td style={{ fontWeight: 500, fontSize: 13 }}>{n}</td>
              <td><span className="cat-tag">{c}</span></td>
              <td><span style={{ background: p === "OURO" ? "var(--warning-bg)" : "#f5f5f5", color: p === "OURO" ? "var(--warning)" : "var(--muted)", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)" }}>{p}</span></td>
              <td style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{v}</td>
              <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--teal)", fontWeight: 600 }}>{views}</td>
              <td><button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="edit" size={12} /> Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SLOTS = [
  { id: "leaderboard", name: "Leaderboard",       fmt: "970×258",  pos: "Topo · todas as páginas" },
  { id: "sticky",      name: "Sticky Bottom",      fmt: "970×90",   pos: "Rodapé fixo · todas as páginas" },
  { id: "mpu",         name: "MPU Sidebar",         fmt: "300×250",  pos: "Sidebar · artigos e home" },
  { id: "halfpage",    name: "Half Page",            fmt: "300×600",  pos: "Sidebar · posição baixa" },
  { id: "infeed",      name: "Nativo in-feed",      fmt: "Flexível", pos: "Feed de notícias" },
  { id: "newsletter",  name: "Newsletter",           fmt: "640×200",  pos: "Newsletter diária · header" },
  { id: "section",     name: "Patrocínio de seção", fmt: "Logo+texto", pos: "Editoria (ex: Turismo by X)" },
  { id: "video",       name: "Vídeo pre-roll",      fmt: "560×315",  pos: "Player de vídeo" },
];

const ANUNCIANTES = [
  { id: 1, nome: "Sicredi Foz",              segmento: "Financeiro",  contato: "marketing@sicredi.foz",   slots: ["leaderboard", "mpu"],     status: "Ativo",    inicio: "01/04", fim: "30/06" },
  { id: 2, nome: "Parque das Aves",          segmento: "Turismo",     contato: "comercial@parquedasaves", slots: ["sticky"],                  status: "Ativo",    inicio: "01/05", fim: "31/07" },
  { id: 3, nome: "Rafain Churrascaria",      segmento: "Gastronomia", contato: "mkt@rafain.com.br",       slots: ["mpu", "infeed"],           status: "Ativo",    inicio: "01/05", fim: "31/05" },
  { id: 4, nome: "Construtora 3 Fronteiras", segmento: "Construção",  contato: "ads@3fronteiras.com",     slots: ["section"],                 status: "Ativo",    inicio: "01/04", fim: "30/06" },
  { id: 5, nome: "Belmond Hotel",            segmento: "Hotelaria",   contato: "mkt@belmond.foz",         slots: ["newsletter", "halfpage"],  status: "Ativo",    inicio: "01/01", fim: "31/12" },
  { id: 6, nome: "Shopping JL",             segmento: "Varejo",      contato: "ads@shoppingjl.com.br",   slots: ["sticky"],                  status: "Expirado", inicio: "01/03", fim: "30/04" },
];

type Anunciante = typeof ANUNCIANTES[number];

const AdsAdmin = () => {
  const [view, setView] = useState<"anunciantes" | "slots" | "novo" | "detalhe">("anunciantes");
  const [selectedAnunc, setSelectedAnunc] = useState<Anunciante | null>(null);

  const slotOcupacao: Record<string, string[]> = {};
  ANUNCIANTES.filter(a => a.status === "Ativo").forEach(a =>
    a.slots.forEach(s => { slotOcupacao[s] = (slotOcupacao[s] ?? []).concat(a.nome); })
  );
  const livres = SLOTS.filter(s => !slotOcupacao[s.id]).length;

  if (selectedAnunc) return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <button className="btn btn-outline btn-sm" onClick={() => { setSelectedAnunc(null); setView("anunciantes"); }}>← Voltar</button>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>{selectedAnunc.nome}</div>
        <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)", background: selectedAnunc.status === "Ativo" ? "#e8f8f0" : "#f5f5f5", color: selectedAnunc.status === "Ativo" ? "var(--success)" : "var(--muted)" }}>{selectedAnunc.status}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm">Editar dados</button>
          <button className="btn btn-primary btn-sm">+ Novo criativo</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>Dados do anunciante</div>
          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            {([["Empresa", selectedAnunc.nome], ["Segmento", selectedAnunc.segmento], ["Contato", selectedAnunc.contato], ["Período", `${selectedAnunc.inicio} → ${selectedAnunc.fim}`]] as [string, string][]).map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
                <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>Slots ativos</div>
          <div style={{ padding: "8px 0" }}>
            {SLOTS.map(s => {
              const ativo = selectedAnunc.slots.includes(s.id);
              return (
                <div key={s.id} style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, background: ativo ? "var(--teal-pale)" : "white" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: ativo ? "var(--teal)" : "var(--border)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: ativo ? 600 : 400, fontSize: 13 }}>{s.name}</div>
                    <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>{s.fmt} · {s.pos}</div>
                  </div>
                  <button className="btn btn-sm" style={{ background: ativo ? "transparent" : "var(--teal)", color: ativo ? "var(--danger)" : "white", border: `1px solid ${ativo ? "var(--danger)" : "var(--teal)"}` }}>{ativo ? "Remover" : "Adicionar"}</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Criativos / materiais</span>
          <button className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="upload" size={12} color="white" /> Fazer upload
          </button>
        </div>
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {selectedAnunc.slots.map(sid => {
            const slot = SLOTS.find(s => s.id === sid);
            return (
              <div key={sid} style={{ border: "2px dashed var(--border)", borderRadius: "var(--r-m)", padding: 16, textAlign: "center", cursor: "pointer", background: "var(--paper-2)" }}>
                <Icon name="upload" size={20} color="var(--muted)" />
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8 }}>{slot?.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{slot?.fmt}</div>
                <div style={{ fontSize: 11, color: "var(--teal)", marginTop: 8 }}>Clique para enviar</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (view === "novo") return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <button className="btn btn-outline btn-sm" onClick={() => setView("anunciantes")}>← Voltar</button>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>Novo anunciante</div>
      </div>
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Dados da empresa</div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {([["Nome da empresa", "text", "Ex: Rafain Churrascaria"], ["Segmento", "text", "Ex: Gastronomia, Turismo, Saúde..."], ["Responsável", "text", "Nome do responsável"], ["E-mail de contato", "email", "mkt@empresa.com.br"], ["Telefone / WhatsApp", "tel", "(45) 9 9999-9999"]] as [string, string, string][]).map(([l, t, p]) => (
            <div key={l}>
              <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</label>
              <input type={t} className="input" placeholder={p} />
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Slots contratados</div>
        <div style={{ padding: "8px 0" }}>
          {SLOTS.map((s, i) => (
            <label key={s.id} style={{ display: "flex", gap: 12, padding: "10px 18px", borderBottom: i < SLOTS.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", alignItems: "center" }}>
              <input type="checkbox" style={{ width: 16, height: 16 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{s.name}</div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>{s.fmt} · {s.pos}</div>
              </div>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 8px", borderRadius: 4, background: slotOcupacao[s.id] ? "#fdecea" : "#e8f8f0", color: slotOcupacao[s.id] ? "var(--danger)" : "var(--success)" }}>
                {slotOcupacao[s.id] ? "Ocupado" : "Disponível"}
              </div>
            </label>
          ))}
        </div>
        <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)", fontWeight: 600 }}>Período da campanha</div>
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {(["Início", "Fim"] as const).map(l => (
            <div key={l}>
              <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</label>
              <input type="date" className="input" />
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-outline" onClick={() => setView("anunciantes")}>Cancelar</button>
          <button className="btn btn-primary">Cadastrar anunciante →</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
        {([["anunciantes", "Anunciantes"], ["slots", "Ocupação de slots"]] as [string, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setView(id as "anunciantes" | "slots")} style={{ padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: view === id ? 600 : 400, color: view === id ? "var(--teal)" : "var(--ink-3)", borderBottom: view === id ? "2px solid var(--teal)" : "2px solid transparent", marginBottom: -1 }}>{label}</button>
        ))}
        <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto", alignSelf: "center" }} onClick={() => setView("novo")}>
          <Icon name="plus" size={13} color="white" /> Novo anunciante
        </button>
      </div>

      {view === "anunciantes" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            <StatCard label="Anunciantes ativos"  value={ANUNCIANTES.filter(a => a.status === "Ativo").length.toString()} color="var(--teal)" />
            <StatCard label="Slots ocupados"      value={`${Object.keys(slotOcupacao).length} / ${SLOTS.length}`} color="var(--cat-economia)" />
            <StatCard label="Slots disponíveis"   value={livres.toString()} color="var(--success)" />
            <StatCard label="Receita do mês"      value="R$ 12.480" delta="23% vs mar" color="var(--cat-cultura)" />
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
            <table className="table">
              <thead><tr><th>Empresa</th><th>Segmento</th><th>Slots ativos</th><th>Período</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {ANUNCIANTES.map(a => (
                  <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => setSelectedAnunc(a)}>
                    <td style={{ fontWeight: 600, fontSize: 14 }}>{a.nome}</td>
                    <td><span className="t-mono" style={{ fontSize: 11, background: "var(--paper-2)", padding: "2px 8px", borderRadius: 4 }}>{a.segmento}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {a.slots.map(sid => {
                          const s = SLOTS.find(x => x.id === sid);
                          return <span key={sid} style={{ background: "var(--teal-light)", color: "var(--teal)", padding: "1px 8px", borderRadius: 999, fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{s?.name}</span>;
                        })}
                      </div>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>{a.inicio} → {a.fim}</td>
                    <td><span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)", background: a.status === "Ativo" ? "#e8f8f0" : "#f5f5f5", color: a.status === "Ativo" ? "var(--success)" : "var(--muted)" }}>{a.status}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={() => setSelectedAnunc(a)}>
                        <Icon name="edit" size={12} /> Gerenciar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "slots" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {SLOTS.map(s => {
            const ocupantes = slotOcupacao[s.id] ?? [];
            const livre = ocupantes.length === 0;
            return (
              <div key={s.id} style={{ background: "white", border: `1.5px solid ${livre ? "var(--border)" : "var(--teal)"}`, borderRadius: "var(--r-l)", padding: "16px 20px", borderLeft: `4px solid ${livre ? "var(--border)" : "var(--teal)"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>{s.fmt} · {s.pos}</div>
                  </div>
                  <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)", background: livre ? "#fdecea" : "#e8f8f0", color: livre ? "var(--danger)" : "var(--success)" }}>{livre ? "DISPONÍVEL" : "OCUPADO"}</span>
                </div>
                {ocupantes.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {ocupantes.map(n => <span key={n} style={{ background: "var(--teal-light)", color: "var(--teal)", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500 }}>{n}</span>)}
                  </div>
                )}
                {livre && <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => setView("novo")}>+ Atribuir anunciante</button>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const NewsletterAdmin = () => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
      <StatCard label="Inscritos"        value="14.847" delta="89 novos esta semana"    color="var(--teal)" />
      <StatCard label="Taxa de abertura" value="58%"    delta="1,2pp vs mês anterior"   color="var(--cat-economia)" />
      <StatCard label="Taxa de clique"   value="24%"    delta="2pp vs mês anterior"     color="var(--cat-cultura)" />
      <StatCard label="Edições enviadas" value="182"    color="var(--muted)" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Edições recentes</div>
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
          {[
            ["Foz em 5min · seg 20/abr", "14.847", "58,2%", "24,1%"],
            ["Foz em 5min · sex 18/abr", "14.601", "57,8%", "23,4%"],
            ["Foz em 5min · qui 17/abr", "14.590", "59,1%", "25,2%"],
            ["Turismo · qui 17/abr",     "2.341",  "62,3%", "28,8%"],
          ].map(([t, env, ab, cl], i, arr) => (
            <div key={t} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>{env} · {ab} · {cl}</div>
              <button className="btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>Ver <Icon name="chevron" size={11} /></button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Nova edição</div>
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <Row label="Assunto"><input className="input" defaultValue="Foz em 5min · seg 21/abr" /></Row>
          <Row label="Lista de destinatários">
            <select className="input">
              <option>Foz em 5min (14.847)</option><option>Turismo (2.341)</option><option>Negócios (1.884)</option><option>Paraguai (3.122)</option>
            </select>
          </Row>
          <Row label="Manchete principal"><input className="input" placeholder="A manchete do dia..." /></Row>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button className="btn btn-outline btn-sm">Pré-visualizar</button>
            <button className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="send" size={12} /> Teste</button>
            <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}><Icon name="send" size={12} /> Enviar agora</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AgendaAdmin = () => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {([
        ["Eventos pendentes", [["Festival Gastronômico", "21 abr · Gramadão", "R$ 199 pago"], ["Show Cover Beatles", "24 abr · Teatro", "Grátis (revisão)"], ["Corrida Noturna", "25 abr · Orla", "R$ 199 pago"]]],
        ["Vagas pendentes",   [["Recepcionista bilíngue", "Hotel Wyndham · R$ 149", ""], ["Chef de Cozinha", "Restaurante Novo · R$ 149", ""], ["Motorista PJ", "Empresa X · Grátis (revisão)", ""]]],
      ] as [string, [string, string, string][]][]).map(([title, items]) => (
        <div key={title}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>{title}</div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
            {items.map(([t, d, s], i, arr) => (
              <div key={t} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{t}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{d}{s ? ` · ${s}` : ""}</div>
                </div>
                <ApproveBtn /><RejectBtn />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsAdmin = () => (
  <div>
    {([
      ["Configurações gerais", [["Nome do portal", "Foz em Foco"], ["URL", "https://fozemfoco.com.br"], ["Slogan", "Jornalismo local, utilidade pública e a tríplice fronteira"]]],
      ["Newsletter",           [["Remetente", "redacao@fozemfoco.com.br"], ["Nome do remetente", "Foz em Foco"], ["Plataforma", "Brevo (ex Sendinblue)"]]],
      ["SEO & Analytics",      [["Google Analytics ID", "G-XXXXXXXXXX"], ["Search Console", "verificado"], ["Sitemap", "https://fozemfoco.com.br/sitemap.xml"]]],
    ] as [string, [string, string][]][]).map(([title, fields]) => (
      <div key={title} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {fields.map(([l, v]) => <Row key={l} label={l}><input className="input" defaultValue={v} /></Row>)}
          <button className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>Salvar alterações</button>
        </div>
      </div>
    ))}
  </div>
);

// ── Nav config ──
const NAV_GROUPS = [
  { label: "Conteúdo", items: [
    { id: "dashboard",  icon: "dashboard",  label: "Dashboard" },
    { id: "articles",   icon: "articles",   label: "Notícias" },
    { id: "media",      icon: "media",      label: "Biblioteca de Mídia" },
    { id: "categories", icon: "categories", label: "Categorias & Tags" },
    { id: "authors",    icon: "authors",    label: "Autores" },
    { id: "comments",   icon: "comments",   label: "Comentários", badge: 12, badgeColor: "var(--danger)" },
  ]},
  { label: "Produtos", items: [
    { id: "guia",       icon: "guia",       label: "Guia Comercial", badge: 3, badgeColor: "var(--warning)" },
    { id: "ads",        icon: "ads",        label: "Anúncios & Slots" },
    { id: "newsletter", icon: "newsletter", label: "Newsletter" },
    { id: "agenda",     icon: "agenda",     label: "Agenda & Empregos" },
  ]},
  { label: "Sistema", items: [
    { id: "settings",   icon: "settings",   label: "Configurações" },
  ]},
];

export default function AdminPage() {
  const [section, setSection] = useState("dashboard");
  const [editingArticle, setEditingArticle] = useState<Record<string, string> | null>(null);

  const currentLabel = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === section)?.label ?? "";

  function renderSection() {
    if (section === "dashboard")  return <AdminDash onSection={s => { setSection(s); setEditingArticle(null); }} />;
    if (section === "articles")   return editingArticle ? <ArticleEditor article={editingArticle} onBack={() => setEditingArticle(null)} /> : <ArticlesList onEdit={a => setEditingArticle(a as Record<string, string>)} />;
    if (section === "media")      return <MediaLibrary />;
    if (section === "categories") return <CategoriesAdmin />;
    if (section === "authors")    return <AuthorsAdmin />;
    if (section === "comments")   return <CommentsAdmin />;
    if (section === "guia")       return <GuiaAdmin />;
    if (section === "ads")        return <AdsAdmin />;
    if (section === "newsletter") return <NewsletterAdmin />;
    if (section === "agenda")     return <AgendaAdmin />;
    if (section === "settings")   return <SettingsAdmin />;
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5", fontFamily: "var(--font-sans)" }}>

      {/* Sidebar */}
      <aside style={{ width: 240, flexShrink: 0, background: "#0f1923", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="var(--teal)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="9"  stroke="var(--teal)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="4"  fill="var(--teal)" />
            </svg>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "white", fontWeight: 400 }}>
              Foz <span style={{ color: "var(--teal-mid)" }}>em</span> Foco
            </span>
          </Link>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,.25)", letterSpacing: "0.14em" }}>PAINEL ADMINISTRATIVO</div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          {NAV_GROUPS.map(({ label, items }) => (
            <div key={label} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,.2)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 8px 4px" }}>{label}</div>
              {items.map(({ id, icon, label: lbl, badge, badgeColor }) => {
                const active = section === id;
                return (
                  <button key={id} onClick={() => { setSection(id); setEditingArticle(null); }} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "8px 10px", border: "none",
                    borderRadius: "var(--r-m)", cursor: "pointer",
                    background: active ? "rgba(10,122,107,.2)" : "transparent",
                    color: active ? "var(--teal-mid)" : "rgba(255,255,255,.55)",
                    fontSize: 14, fontWeight: active ? 600 : 400,
                    marginBottom: 1, textAlign: "left",
                  }}>
                    <Icon name={icon} size={15} color={active ? "var(--teal-mid)" : "rgba(255,255,255,.4)"} />
                    <span style={{ flex: 1 }}>{lbl}</span>
                    {badge && (
                      <span style={{ background: badgeColor, color: "white", borderRadius: 999, fontSize: 10, padding: "1px 7px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>A</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "white", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Administrador</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", fontFamily: "var(--font-mono)" }}>Super Admin</div>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", opacity: .4, color: "white" }}>
            <Icon name="x" size={14} color="white" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13 }}>
            <span>Admin</span>
            <Icon name="chevron" size={12} />
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>{currentLabel}</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/" className="btn btn-outline btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="eye" size={13} /> Ver site
            </Link>
            {section === "articles" && !editingArticle && (
              <button className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={() => setEditingArticle({})}>
                <Icon name="plus" size={13} /> Nova notícia
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
