"use client";

import React, { useCallback, useEffect, useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Config = {
  id?: string;
  siteName?: string;
  siteDescription?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  bridgeTancredo?: string;
  bridgeAmizade?: string;
  cataratosVazao?: string | null;
  dashboardSponsor?: string | null;
  dashboardSponsorUrl?: string | null;
  newsletterBrevoList?: string | null;
};

const BRIDGE_STATUSES = ["livre", "moderado", "lento", "fechado"];

export default function ConfiguracoesPage() {
  const [cfg, setCfg] = useState<Config>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    setCfg(data ?? {});
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  function update<K extends keyof Config>(k: K, v: Config[K]) { setCfg((p) => ({ ...p, [k]: v })); }

  async function saveAll() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cfg),
      });
      if (!res.ok) { alert("Falha ao salvar"); return; }
      alert("Configurações salvas!");
      await load();
    } finally { setSaving(false); }
  }

  if (!loaded) return <div style={{ padding: 40, color: MUTED, fontFamily: "var(--font-mono)" }}>Carregando...</div>;

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>Configurações</div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>Identidade, pontes, dashboard e newsletter</div>
        </div>
        <button disabled={saving} onClick={saveAll}
          style={{ padding: "9px 16px", background: TEAL, borderRadius: 8, fontSize: 13, color: "white", fontWeight: 600, border: "none", cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Salvando..." : "Salvar tudo"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card title="Identidade">
          <Field label="Nome do site"><input value={cfg.siteName ?? ""} onChange={(e) => update("siteName", e.target.value)} style={input} /></Field>
          <Field label="Descrição"><textarea rows={3} value={cfg.siteDescription ?? ""} onChange={(e) => update("siteDescription", e.target.value)} style={{ ...input, resize: "none" }} /></Field>
          <Field label="Logo URL"><input value={cfg.logoUrl ?? ""} onChange={(e) => update("logoUrl", e.target.value)} style={input} /></Field>
          <Field label="Favicon URL"><input value={cfg.faviconUrl ?? ""} onChange={(e) => update("faviconUrl", e.target.value)} style={input} /></Field>
        </Card>

        <Card title="Pontes (tríplice fronteira)">
          <Field label="Ponte da Amizade">
            <select value={cfg.bridgeAmizade ?? "livre"} onChange={(e) => update("bridgeAmizade", e.target.value as any)} style={input}>
              {BRIDGE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Ponte Tancredo Neves">
            <select value={cfg.bridgeTancredo ?? "livre"} onChange={(e) => update("bridgeTancredo", e.target.value as any)} style={input}>
              {BRIDGE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Vazão Cataratas"><input value={cfg.cataratosVazao ?? ""} onChange={(e) => update("cataratosVazao", e.target.value)} style={input} placeholder="ex.: 1.234 m³/s" /></Field>
        </Card>

        <Card title="Dashboard — Patrocinador">
          <Field label="Nome"><input value={cfg.dashboardSponsor ?? ""} onChange={(e) => update("dashboardSponsor", e.target.value)} style={input} /></Field>
          <Field label="URL"><input value={cfg.dashboardSponsorUrl ?? ""} onChange={(e) => update("dashboardSponsorUrl", e.target.value)} style={input} /></Field>
        </Card>

        <Card title="Newsletter (Brevo)">
          <Field label="ID da lista Brevo"><input value={cfg.newsletterBrevoList ?? ""} onChange={(e) => update("newsletterBrevoList", e.target.value)} style={input} /></Field>
        </Card>
      </div>
    </div>
  );
}

const input: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, width: "100%", outline: "none", background: BG, color: INK };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>{title}</div>
      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}
