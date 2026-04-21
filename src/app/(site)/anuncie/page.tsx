"use client";

import { useState } from "react";
import Link from "next/link";

const FORMATS = [
  { id:"leaderboard", name:"Leaderboard",       fmt:"970×90",  pos:"Topo de todas as páginas",      cpm:"R$ 25/CPM",   destaque:false },
  { id:"mpu",         name:"MPU Sidebar",        fmt:"300×250", pos:"Sidebar · artigos e home",      cpm:"R$ 35/CPM",   destaque:true  },
  { id:"halfpage",    name:"Half Page",          fmt:"300×600", pos:"Sidebar · posição baixa",       cpm:"R$ 42/CPM",   destaque:false },
  { id:"infeed",      name:"Nativo in-feed",     fmt:"Flexível",pos:"Feed de notícias",              cpm:"R$ 55/CPM",   destaque:true  },
  { id:"newsletter",  name:"Newsletter",         fmt:"640×200", pos:"Newsletter diária · 14k leitores",cpm:"R$ 120/CPM",destaque:true  },
  { id:"section",     name:"Patrocínio de seção",fmt:"Logo+texto",pos:"Editoria exclusiva por mês",  cpm:"R$ 1.500/mês",destaque:false },
];

const PLANS = [
  {
    name: "Básico",
    price: "R$ 490",
    period: "/mês",
    desc: "Ideal para negócios locais",
    features: ["1 banner MPU (300×250)","até 50k impressões","relatório mensal","atendimento por e-mail"],
    color: "var(--border)",
    primary: false,
  },
  {
    name: "Destaque",
    price: "R$ 1.290",
    period: "/mês",
    desc: "Maior visibilidade e alcance",
    features: ["Leaderboard + MPU","até 150k impressões","banner in-feed","relatório semanal","atendimento prioritário"],
    color: "var(--teal)",
    primary: true,
  },
  {
    name: "Premium",
    price: "R$ 2.990",
    period: "/mês",
    desc: "Presença editorial e máxima visibilidade",
    features: ["Tudo do Destaque","banner em rotação no site","1 matéria patrocinada/mês","patrocínio de seção editorial","newsletter patrocinada mensal","gestão de campanha incluída"],
    color: "var(--teal)",
    primary: false,
  },
];

const METRICS = [
  ["180 mil", "leitores por mês"],
  ["14,8 mil", "inscritos na newsletter"],
  ["58%", "taxa de abertura"],
  ["4,2 min", "tempo médio por sessão"],
];

export default function AnunciePage() {
  const [activeFormat, setActiveFormat] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", empresa: "", email: "", telefone: "", plano: "", mensagem: "" });

  function handleForm(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <>
      {/* Hero */}
      <div style={{ background: "var(--ink)", padding: "56px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="t-mono" style={{ color: "rgba(255,255,255,.35)", letterSpacing: "0.15em", marginBottom: 14 }}>ANUNCIE · MÍDIA KIT 2026</div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5vw,56px)", color: "white", lineHeight: 1.05, marginBottom: 16 }}>
                Sua marca para quem vive, visita e faz negócios em Foz
              </h1>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", lineHeight: 1.7, marginBottom: 28 }}>
                O maior portal de notícias e utilidade da tríplice fronteira. Audiência qualificada, formatos que performam, resultado mensurável.
              </p>
              <button
                className="btn btn-primary"
                style={{ padding: "14px 28px", fontSize: 16, fontWeight: 700 }}
                onClick={() => document.getElementById("contato-anuncie")?.scrollIntoView({ behavior: "smooth" })}
              >
                Quero anunciar →
              </button>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {METRICS.map(([v, l]) => (
                <div key={l} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "var(--r-l)", padding: "24px 20px" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 36, color: "white", lineHeight: 1, marginBottom: 6 }}>{v}</div>
                  <div className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,.45)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Formatos */}
      <div className="container" style={{ padding: "60px 20px" }}>
        <div className="sec-label bold" style={{ marginBottom: 24 }}>Formatos disponíveis</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {FORMATS.map((f) => (
            <div
              key={f.id}
              onClick={() => setActiveFormat(f.id === activeFormat ? null : f.id)}
              style={{
                background: "white", borderRadius: "var(--r-l)", padding: 20, cursor: "pointer",
                border: "2px solid", borderColor: activeFormat === f.id ? "var(--teal)" : f.destaque ? "var(--teal-light)" : "var(--border)",
                boxShadow: activeFormat === f.id ? "var(--shadow-hover)" : "var(--shadow-s)",
                position: "relative",
              }}
            >
              {f.destaque && (
                <div style={{ position: "absolute", top: -10, right: 16, background: "var(--teal)", color: "white", fontFamily: "var(--font-mono)", fontSize: 9, padding: "2px 10px", borderRadius: 3 }}>
                  RECOMENDADO
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{f.name}</div>
              <div className="t-mono" style={{ color: "var(--muted)", fontSize: 11, marginBottom: 8 }}>{f.fmt} · {f.pos}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--teal)" }}>{f.cpm}</div>
              {activeFormat === f.id && (
                <div style={{ marginTop: 12, padding: "12px", background: "var(--teal-pale)", borderRadius: "var(--r-m)" }}>
                  <div className="imgph" data-label={f.fmt} style={{ height: 60, borderRadius: "var(--r-s)", marginBottom: 8 }} />
                  <div className="t-small color-muted">Clique em "Quero anunciar" para solicitar este formato.</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Plans */}
        <div style={{ marginTop: 60 }}>
          <div className="sec-label bold" style={{ marginBottom: 24 }}>Planos & Preços</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {PLANS.map((p) => (
              <div
                key={p.name}
                style={{
                  background: "white", borderRadius: "var(--r-l)", padding: 32,
                  border: p.primary ? "2px solid var(--teal)" : "1px solid var(--border)",
                  boxShadow: p.primary ? "var(--shadow-l)" : "var(--shadow-s)",
                  position: "relative",
                }}
              >
                {p.primary && (
                  <div style={{ position: "absolute", top: -12, left: 24, background: "var(--teal)", color: "white", fontFamily: "var(--font-mono)", fontSize: 10, padding: "3px 12px", borderRadius: 3 }}>
                    MAIS POPULAR
                  </div>
                )}
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 4 }}>{p.name}</div>
                <div className="t-small color-muted" style={{ marginBottom: 16 }}>{p.desc}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 36, color: "var(--teal)" }}>{p.price}</span>
                  <span className="t-mono color-muted" style={{ fontSize: 12 }}>{p.period}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 8, fontSize: 14, alignItems: "center" }}>
                      <span style={{ color: "var(--success)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span style={{ color: "var(--ink-2)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  className={`btn ${p.primary ? "btn-primary" : "btn-outline"}`}
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => { setForm(prev => ({ ...prev, plano: p.name })); document.getElementById("contato-anuncie")?.scrollIntoView({ behavior: "smooth" }); }}
                >
                  Escolher {p.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div id="contato-anuncie" style={{ marginTop: 60, background: "var(--ink)", borderRadius: "var(--r-xl)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: "48px 40px", color: "white" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 36, marginBottom: 12 }}>Vamos conversar</div>
              <p style={{ fontSize: 16, opacity: .65, lineHeight: 1.7, marginBottom: 32 }}>
                Nossa equipe de mídia responde em até 2 horas em dias úteis. Montamos uma proposta personalizada para o seu negócio.
              </p>
              {[["📧","anuncie@fozemfoco.com.br"],["📱","(45) 99999-1234"],["💼","CNPJ: 12.345.678/0001-99"]].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", gap: 12, fontSize: 14, opacity: .75, marginBottom: 12 }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: "48px 40px", background: "rgba(255,255,255,.04)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {([
                  { name: "nome", placeholder: "Seu nome completo", type: "text" },
                  { name: "empresa", placeholder: "Empresa ou negócio", type: "text" },
                  { name: "email", placeholder: "E-mail comercial", type: "email" },
                  { name: "telefone", placeholder: "WhatsApp ou telefone", type: "tel" },
                ] as const).map(({ name, placeholder, type }) => (
                  <input
                    key={name}
                    className="input"
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleForm}
                    style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "white" }}
                  />
                ))}
                <select
                  className="input"
                  name="plano"
                  value={form.plano}
                  onChange={handleForm}
                  style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: form.plano ? "white" : "rgba(255,255,255,.4)" }}
                >
                  <option value="">Plano de interesse</option>
                  {PLANS.map(p => <option key={p.name} value={p.name} style={{ color: "var(--ink)" }}>{p.name} — {p.price}/mês</option>)}
                  <option value="personalizado" style={{ color: "var(--ink)" }}>Quero proposta personalizada</option>
                </select>
                <textarea
                  className="input"
                  name="mensagem"
                  placeholder="Mensagem (opcional)"
                  rows={3}
                  value={form.mensagem}
                  onChange={handleForm}
                  style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "white", resize: "vertical" }}
                />
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15, fontWeight: 700 }}>
                  Enviar mensagem →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
