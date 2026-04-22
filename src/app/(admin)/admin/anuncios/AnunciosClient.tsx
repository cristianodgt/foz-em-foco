"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";

type SlotId = "leaderboard" | "mpu1" | "infeed" | "halfpage" | "sticky";

// Map DB AdSlotType to diagram slot ids
function mapSlot(slot: string): SlotId | null {
  switch (slot) {
    case "leaderboard": return "leaderboard";
    case "mpu": return "mpu1";
    case "infeed": return "infeed";
    case "halfpage": return "halfpage";
    case "sticky": return "sticky";
    default: return null; // newsletter, section, video -> no diagram position
  }
}

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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Anúncios</h1>
        <Link href="/admin/anuncios/novo" className="flex items-center gap-2 bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark transition-colors">
          <Plus size={16} /> Novo anunciante
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 32, alignItems: "start" }}>
        <div className="grid grid-cols-1 gap-4">
          {advertisers.map((adv) => {
            const active = adv.campaigns.filter((c) => c.active && new Date(c.endDate) >= new Date());
            const totalCreatives = adv.campaigns.reduce((s, c) => s + c.creatives.length, 0);

            return (
              <div key={adv.id} className="bg-gray-900 border border-white/5 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{adv.name}</h3>
                    <p className="text-xs text-white/40 font-mono mt-0.5">{adv.segment} · {adv.email}</p>
                  </div>
                  <div className="flex gap-2 text-xs font-mono">
                    <span className="bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">{active.length} campanha(s) ativa(s)</span>
                    <span className="bg-gray-800 text-white/40 px-2 py-0.5 rounded">{totalCreatives} criativos</span>
                  </div>
                </div>

                {adv.campaigns.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {adv.campaigns.map((c) => {
                      const isActive = c.active && new Date(c.endDate) >= new Date();
                      const campaignSlot = c.creatives[0]?.slot ? mapSlot(c.creatives[0].slot) : null;
                      return (
                        <div
                          key={c.id}
                          className="flex items-center gap-3 text-sm border-t border-white/5 pt-2"
                          onMouseEnter={() => campaignSlot && setActiveSlot(campaignSlot)}
                          onMouseLeave={() => setActiveSlot(null)}
                          style={{ cursor: campaignSlot ? "pointer" : "default" }}
                        >
                          <Calendar size={12} className="text-white/30" />
                          <span className="text-white/60">{c.name}</span>
                          <span className="text-white/30 font-mono text-xs">
                            {new Date(c.startDate).toLocaleDateString("pt-BR")} — {new Date(c.endDate).toLocaleDateString("pt-BR")}
                          </span>
                          <span className={`ml-auto text-xs px-2 py-0.5 rounded font-mono ${isActive ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-white/30"}`}>
                            {isActive ? "ativo" : "encerrado"}
                          </span>
                          <span className="text-xs text-white/30">{c.creatives.length} criativos</span>
                        </div>
                      );
                    })}
                    {/* Per-creative hover rows */}
                    {adv.campaigns.flatMap((c) =>
                      c.creatives.map((cr) => {
                        const slot = mapSlot(cr.slot);
                        return (
                          <div
                            key={cr.id}
                            onMouseEnter={() => slot && setActiveSlot(slot)}
                            onMouseLeave={() => setActiveSlot(null)}
                            className="flex items-center gap-3 text-xs text-white/40 pl-6 py-1 font-mono"
                            style={{ cursor: slot ? "pointer" : "default" }}
                          >
                            <span>▸ {c.name}</span>
                            <span className="text-white/30">slot: {cr.slot}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {advertisers.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <p className="text-4xl mb-3">📢</p>
              <p>Nenhum anunciante cadastrado.</p>
            </div>
          )}
        </div>

        <div style={{ position: "sticky", top: 32 }}>
          <div style={{ fontSize: 12, color: "#888", fontFamily: "monospace", marginBottom: 8, textAlign: "center" }}>
            {activeSlot ? `slot: ${activeSlot}` : "passe o mouse em uma campanha"}
          </div>
          <PageDiagram highlighted={activeSlot} />
          <div style={{ marginTop: 10, fontSize: 11, color: "#888", textAlign: "center", fontFamily: "monospace" }}>
            diagrama representativo · posições aproximadas
          </div>
        </div>
      </div>
    </div>
  );
}
