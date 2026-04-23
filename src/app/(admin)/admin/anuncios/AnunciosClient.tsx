"use client";

import React, { useState } from "react";
import Link from "next/link";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type SlotId = "leaderboard" | "mpu1" | "infeed" | "halfpage" | "sticky";

function mapSlot(slot: string): SlotId | null {
  switch (slot) {
    case "leaderboard": return "leaderboard";
    case "mpu": return "mpu1";
    case "infeed": return "infeed";
    case "halfpage": return "halfpage";
    case "sticky": return "sticky";
    default: return null;
  }
}

function PageDiagram({ highlighted }: { highlighted: string | null }) {
  const slots: Record<SlotId, { top: string; left: string; width: string; height: string; color: string; label: string }> = {
    leaderboard: { top: "12%", left: "10%", width: "80%", height: "8%", color: TEAL, label: "Leaderboard" },
    mpu1: { top: "24%", left: "72%", width: "18%", height: "18%", color: "#1e4d8c", label: "MPU" },
    infeed: { top: "44%", left: "10%", width: "58%", height: "10%", color: "#d35400", label: "Nativo in-feed" },
    halfpage: { top: "46%", left: "72%", width: "18%", height: "30%", color: "#6c3483", label: "Half Page" },
    sticky: { top: "88%", left: "10%", width: "80%", height: "7%", color: "#c0392b", label: "Sticky Bottom" },
  };
  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "62%", background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "8%", background: "#fff", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 4%", gap: "2%" }}>
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
            background: isActive ? s.color : "rgba(0,0,0,.05)",
            border: `2px ${isActive ? "solid" : "dashed"} ${isActive ? s.color : "rgba(0,0,0,.15)"}`,
            borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .2s", cursor: "pointer",
          }}>
            {isActive && <span style={{ color: "white", fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700, textAlign: "center", lineHeight: 1.2, padding: "2px 4px" }}>{s.label}</span>}
          </div>
        );
      })}
    </div>
  );
}

export type AdvertiserRow = {
  id: string;
  name: string;
  segment: string;
  email: string;
  campaigns: {
    id: string;
    name: string;
    active: boolean;
    startDate: string;
    endDate: string;
    creatives: { id: string; slot: string }[];
  }[];
};

export default function AnunciosClient({ advertisers }: { advertisers: AdvertiserRow[] }) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const now = new Date();
  const totalAdvertisers = advertisers.length;
  const totalActive = advertisers.reduce(
    (acc, a) => acc + a.campaigns.filter((c) => c.active && new Date(c.endDate) >= now).length,
    0
  );
  const totalCreatives = advertisers.reduce(
    (acc, a) => acc + a.campaigns.reduce((s, c) => s + c.creatives.length, 0),
    0
  );
  const totalPending = advertisers.reduce(
    (acc, a) => acc + a.campaigns.filter((c) => !c.active).length,
    0
  );

  const kpis = [
    { label: "Anunciantes", value: totalAdvertisers.toString(), color: TEAL },
    { label: "Campanhas ativas", value: totalActive.toString(), color: "#047857" },
    { label: "Criativos", value: totalCreatives.toString(), color: "#d35400" },
    { label: "Pendentes", value: totalPending.toString(), color: "#92400e" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Anúncios
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            {totalAdvertisers} anunciantes · {totalActive} campanhas ativas
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/anuncios/relatorios" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
            border: `1px solid ${BORDER}`, borderRadius: 8, background: "white",
            fontSize: 13, color: INK, textDecoration: "none", fontWeight: 500,
          }}>
            Relatórios
          </Link>
          <Link href="/admin/anuncios/novo" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
            background: TEAL, borderRadius: 8, fontSize: 13, color: "white",
            textDecoration: "none", fontWeight: 600,
          }}>
            + Novo anunciante
          </Link>
        </div>
      </div>

      {/* KPI Row */}
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

      {/* Main grid: lista + diagrama sticky */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {advertisers.map((adv) => {
            const active = adv.campaigns.filter((c) => c.active && new Date(c.endDate) >= now);
            const totalC = adv.campaigns.reduce((s, c) => s + c.creatives.length, 0);

            return (
              <div key={adv.id} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: INK, marginBottom: 2 }}>{adv.name}</div>
                    <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {adv.segment || "sem segmento"} · {adv.email || "sem email"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{
                      fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                      padding: "3px 8px", borderRadius: 99,
                      background: "#e6f9f3", color: "#047857",
                    }}>
                      {active.length} ATIVA(S)
                    </span>
                    <span style={{
                      fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                      padding: "3px 8px", borderRadius: 99,
                      background: "#f3f4f6", color: MUTED,
                    }}>
                      {totalC} CRIATIVOS
                    </span>
                  </div>
                </div>

                {adv.campaigns.length === 0 ? (
                  <div style={{ padding: "22px 24px", fontSize: 13, color: MUTED }}>
                    Nenhuma campanha cadastrada.
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: BG }}>
                        {["Campanha", "Período", "Criativos", "Status"].map((h, i) => (
                          <th key={i} style={{
                            padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)",
                            color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em",
                            textAlign: "left", fontWeight: 600,
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {adv.campaigns.map((c, i) => {
                        const isActive = c.active && new Date(c.endDate) >= now;
                        const campaignSlot = c.creatives[0]?.slot ? mapSlot(c.creatives[0].slot) : null;
                        return (
                          <tr
                            key={c.id}
                            style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none", cursor: campaignSlot ? "pointer" : "default" }}
                            onMouseEnter={() => campaignSlot && setActiveSlot(campaignSlot)}
                            onMouseLeave={() => setActiveSlot(null)}
                          >
                            <td style={{ padding: "12px 14px", fontSize: 13, color: INK, fontWeight: 500 }}>{c.name}</td>
                            <td style={{ padding: "12px 14px", fontSize: 12, fontFamily: "var(--font-mono)", color: MUTED }}>
                              {new Date(c.startDate).toLocaleDateString("pt-BR")} — {new Date(c.endDate).toLocaleDateString("pt-BR")}
                            </td>
                            <td style={{ padding: "12px 14px", fontSize: 12, fontFamily: "var(--font-mono)", color: INK }}>
                              {c.creatives.map((cr) => cr.slot).join(", ") || "—"}
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{
                                fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                                padding: "3px 8px", borderRadius: 99,
                                background: isActive ? "#e6f9f3" : "#f3f4f6",
                                color: isActive ? "#047857" : MUTED,
                              }}>
                                {isActive ? "ATIVO" : "ENCERRADO"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}

          {advertisers.length === 0 && (
            <div style={{
              background: "white", border: `1px solid ${BORDER}`, borderRadius: 14,
              padding: "60px 24px", textAlign: "center",
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f3f4f6", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontSize: 22, fontFamily: "var(--font-serif)" }}>A</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: INK, marginBottom: 6 }}>Nenhum anunciante</div>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>Cadastre o primeiro anunciante para começar a vender espaços.</div>
              <Link href="/admin/anuncios/novo" style={{
                display: "inline-flex", padding: "9px 16px", background: TEAL, color: "white",
                borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
                + Novo anunciante
              </Link>
            </div>
          )}
        </div>

        <div style={{ position: "sticky", top: 24 }}>
          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: INK, marginBottom: 4 }}>Mapa de slots</div>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
              {activeSlot ? `slot: ${activeSlot}` : "passe o mouse em uma campanha"}
            </div>
            <PageDiagram highlighted={activeSlot} />
            <div style={{ marginTop: 10, fontSize: 11, color: MUTED, textAlign: "center", fontFamily: "var(--font-mono)" }}>
              diagrama representativo · posições aproximadas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
