"use client";

import React, { useState } from "react";

type SlotId = "leaderboard" | "mpu1" | "infeed" | "halfpage" | "sticky";

function PageDiagram({ highlighted }: { highlighted: string | null }) {
  const slots: Record<SlotId, { top: string; left: string; width: string; height: string; color: string; label: string }> = {
    leaderboard: { top: "12%", left: "10%", width: "80%", height: "8%", color: "#0a7a6b", label: "Leaderboard" },
    mpu1: { top: "24%", left: "72%", width: "18%", height: "18%", color: "#1e4d8c", label: "MPU" },
    infeed: { top: "44%", left: "10%", width: "58%", height: "10%", color: "#d35400", label: "Nativo in-feed" },
    halfpage: { top: "46%", left: "72%", width: "18%", height: "30%", color: "#6c3483", label: "Half Page" },
    sticky: { top: "88%", left: "10%", width: "80%", height: "7%", color: "#c0392b", label: "Sticky Bottom" },
  };
  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "62%", background: "#f8f9fa", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "8%", background: "#fff", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", padding: "0 4%", gap: "2%" }}>
        <div style={{ width: "12%", height: "50%", background: "#ddd", borderRadius: 2 }} />
        <div style={{ width: "40%", height: "35%", background: "#eee", borderRadius: 2 }} />
      </div>
      {[
        { top: "12%", left: "10%", w: "58%", h: "10%", bg: "#e8e8e8" },
        { top: "26%", left: "10%", w: "58%", h: "16%", bg: "#efefef" },
        { top: "46%", left: "10%", w: "28%", h: "8%", bg: "#e8e8e8" },
        { top: "58%", left: "10%", w: "58%", h: "28%", bg: "#f2f2f2" },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", top: s.top, left: s.left, width: s.w, height: s.h, background: s.bg, borderRadius: 2 }} />
      ))}
      {(Object.entries(slots) as [SlotId, typeof slots[SlotId]][]).map(([id, s]) => {
        const isActive = highlighted === id;
        return (
          <div key={id} style={{
            position: "absolute", top: s.top, left: s.left, width: s.width, height: s.height,
            background: isActive ? s.color : "rgba(0,0,0,.06)",
            border: `2px ${isActive ? "solid" : "dashed"} ${isActive ? s.color : "rgba(0,0,0,.15)"}`,
            borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .25s", cursor: "pointer",
          }}>
            {isActive && <span style={{ color: "white", fontSize: 9, fontFamily: "monospace", fontWeight: 700, textAlign: "center", lineHeight: 1.2, padding: "2px 4px" }}>{s.label}</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function AnunciePage() {
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  const formats = [
    { id: "leaderboard", name: "Leaderboard", pos: "Topo de todas as páginas", desc: "Primeira coisa que o leitor vê ao entrar no site. Formato obrigatório nos planos premium.", color: "#0a7a6b", size: "970×258" },
    { id: "mpu1", name: "MPU", pos: "Sidebar, ao lado do conteúdo", desc: "Acompanha o leitor durante toda a leitura do artigo. Alto tempo de exposição.", color: "#1e4d8c", size: "300×250" },
    { id: "infeed", name: "Nativo in-feed", pos: "Dentro do feed de notícias", desc: "Parece uma notícia, performa como publicidade. Maior taxa de engajamento de todos os formatos.", color: "#d35400", size: "Flexível" },
    { id: "halfpage", name: "Half Page", pos: "Sidebar, posição baixa", desc: "Grande área de impacto visual. Ideal para campanhas de awareness e branding.", color: "#6c3483", size: "300×600" },
    { id: "sticky", name: "Sticky Bottom", pos: "Rodapé fixo da tela", desc: "Permanece visível durante todo o scroll. Impossível de ignorar sem fechar.", color: "#c0392b", size: "970×90" },
  ];

  const plans: { name: string; ideal: string; features: string[]; color: string; highlight?: boolean }[] = [
    { name: "Presença", ideal: "Negócios locais que querem aparecer no Guia", features: ["Perfil no Guia Comercial", "Foto, endereço e telefone", "Avaliações verificadas de clientes", "Botão WhatsApp direto", "Estatísticas mensais"], color: "#27ae60" },
    { name: "Destaque", ideal: "Negócios que querem se destacar dos concorrentes", features: ["Tudo do Presença", "1ª posição na categoria no Guia", "Banner no topo do Guia", "Galeria de fotos", "Menção na newsletter temática", "Relatório detalhado de visitas"], color: "#d4a017", highlight: true },
    { name: "Parceiro", ideal: "Marcas que querem presença editorial e máxima visibilidade", features: ["Tudo do Destaque", "Banner display em rotação no site", "1 matéria patrocinada por mês", "Patrocínio de seção editorial", "Newsletter patrocinada mensal", "Gestão de campanha incluída"], color: "#0a7a6b" },
  ];

  return (
    <>
      <div style={{ background: "#111", padding: "56px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,.35)", letterSpacing: "0.15em", marginBottom: 14 }}>ANUNCIE · MÍDIA KIT 2026</div>
              <h1 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "clamp(36px,5vw,56px)", color: "white", lineHeight: 1.05, marginBottom: 16 }}>
                Sua marca para quem vive, visita e faz negócios em Foz do Iguaçu
              </h1>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.7)", lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>
                O Foz em Foco é o maior portal de notícias e utilidade da tríplice fronteira. Audiência qualificada, formatos que performam, resultado mensurável.
              </p>
              <button
                style={{ padding: "14px 28px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 16 }}
                onClick={() => document.getElementById("contato-anuncie")?.scrollIntoView?.()}
              >
                Quero anunciar →
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["180 mil", "leitores por mês"],
                ["14,8 mil", "inscritos na newsletter"],
                ["3,2 min", "tempo médio no site"],
                ["62%", "do PR, PY e AR"],
              ].map(([v, l]) => (
                <div key={l} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "20px 18px" }}>
                  <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 34, color: "white", lineHeight: 1, marginBottom: 4 }}>{v}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", fontFamily: "monospace" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px" }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 32, marginBottom: 6 }}>Onde seu anúncio vai aparecer</div>
            <div style={{ fontSize: 15, color: "#888", maxWidth: 560 }}>Passe o mouse nos formatos abaixo para visualizar a posição exata no site. Cada posição atinge o leitor num momento diferente.</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 32, marginTop: 28, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {formats.map((f) => (
                <div
                  key={f.id}
                  onMouseEnter={() => setActiveFormat(f.id)}
                  onMouseLeave={() => setActiveFormat(null)}
                  style={{
                    background: "white",
                    border: "1.5px solid",
                    borderColor: activeFormat === f.id ? f.color : "#e2e8f0",
                    borderLeft: `4px solid ${activeFormat === f.id ? f.color : "#e2e8f0"}`,
                    borderRadius: 12,
                    padding: "16px 20px",
                    cursor: "pointer",
                    transition: "all .2s",
                    boxShadow: activeFormat === f.id ? `0 4px 16px ${f.color}22` : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{f.name}</div>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888", marginLeft: "auto" }}>{f.size}</span>
                  </div>
                  <div style={{ fontSize: 12, color: f.color, fontFamily: "monospace", marginBottom: 4, marginLeft: 20 }}>{f.pos}</div>
                  <div style={{ fontSize: 13, color: "#555", marginLeft: 20, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ position: "sticky", top: 90 }}>
              <div style={{ fontSize: 12, color: "#888", fontFamily: "monospace", marginBottom: 8, textAlign: "center" }}>
                {activeFormat ? `posição: ${formats.find((f) => f.id === activeFormat)?.name}` : "passe o mouse em um formato"}
              </div>
              <PageDiagram highlighted={activeFormat} />
              <div style={{ marginTop: 10, fontSize: 11, color: "#888", textAlign: "center", fontFamily: "monospace" }}>
                diagrama representativo · posições aproximadas
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 32, marginBottom: 6 }}>Planos para negócios locais</div>
          <div style={{ fontSize: 15, color: "#888", marginBottom: 28 }}>Presença no Guia Comercial com diferentes níveis de visibilidade. Valores sob consulta.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {plans.map(({ name, ideal, features, color, highlight }) => (
              <div
                key={name}
                style={{
                  background: "white",
                  border: "2px solid",
                  borderColor: highlight ? color : "#e2e8f0",
                  borderRadius: 16,
                  padding: "28px 24px",
                  position: "relative",
                  boxShadow: highlight ? `0 8px 32px ${color}22` : "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                {highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: -13,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: color,
                      color: "white",
                      padding: "3px 16px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      letterSpacing: "0.06em",
                    }}
                  >
                    MAIS ESCOLHIDO
                  </div>
                )}
                <div style={{ width: 6, height: 36, background: color, borderRadius: 3, marginBottom: 14 }} />
                <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 28, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.5 }}>{ideal}</div>
                <div style={{ marginBottom: 24 }}>
                  {features.map((f) => (
                    <div key={f} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #e2e8f0", fontSize: 13, alignItems: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: highlight ? color : "transparent",
                    border: `2px solid ${color}`,
                    color: highlight ? "white" : color,
                    fontWeight: 600,
                    borderRadius: 8,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                  onClick={() => document.getElementById("contato-anuncie")?.scrollIntoView?.()}
                >
                  Solicitar proposta →
                </button>
              </div>
            ))}
          </div>
        </div>

        <div id="contato-anuncie" style={{ background: "#111", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ padding: "48px 40px", color: "white" }}>
              <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 36, marginBottom: 12, lineHeight: 1.1 }}>
                Vamos conversar sobre sua campanha?
              </div>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", lineHeight: 1.7, marginBottom: 28 }}>
                Nossa equipe de mídia responde em até 2 horas úteis. Sem compromisso — vamos entender seu objetivo e montar a proposta ideal.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["Consultoria gratuita", "Analisamos seu objetivo antes de qualquer proposta"],
                  ["Sem contrato longo", "Campanhas a partir de 30 dias"],
                  ["Relatório mensal", "Você sabe exatamente o retorno do investimento"],
                ].map(([t, d]) => (
                  <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0a7a6b", marginTop: 7, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,.04)", padding: "48px 40px", borderLeft: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 22, color: "white", marginBottom: 20 }}>Fale com a gente</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  ["Nome", "text", "Seu nome"],
                  ["Empresa", "text", "Nome da empresa"],
                  ["E-mail", "email", "seu@email.com"],
                  ["Telefone / WhatsApp", "tel", "(45) 9 9999-9999"],
                ].map(([l, t, p]) => (
                  <div key={l}>
                    <label style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,.35)", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>{l.toUpperCase()}</label>
                    <input
                      type={t}
                      placeholder={p}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid rgba(255,255,255,.15)",
                        borderRadius: 8,
                        background: "rgba(255,255,255,.07)",
                        color: "white",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,.35)", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>OBJETIVO DA CAMPANHA</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: divulgar meu restaurante para turistas, lançar produto..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid rgba(255,255,255,.15)",
                      borderRadius: 8,
                      background: "rgba(255,255,255,.07)",
                      color: "white",
                      fontSize: 14,
                      outline: "none",
                      resize: "none",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  />
                </div>
                <button style={{ width: "100%", padding: "13px", fontSize: 15, fontWeight: 700, marginTop: 4, background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
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
